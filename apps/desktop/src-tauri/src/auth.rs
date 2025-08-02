use anyhow::{anyhow, Result};
use oauth2::{
    basic::BasicClient, AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken,
    PkceCodeChallenge, PkceCodeVerifier, RedirectUrl, RevocationUrl, Scope, TokenUrl,
};
use openidconnect::{
    core::{CoreClient, CoreProviderMetadata, CoreResponseType},
    AccessTokenHash, AuthenticationFlow, AuthorizationCode as OidcAuthCode, ClientId as OidcClientId,
    ClientSecret as OidcClientSecret, CsrfToken as OidcCsrfToken, IssuerUrl, Nonce,
    OAuth2TokenResponse, RedirectUrl as OidcRedirectUrl, RequestUrl, Scope as OidcScope,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{debug, error, info};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthConfig {
    pub provider: String,
    pub client_id: String,
    pub client_secret: String,
    pub issuer_url: String,
    pub redirect_uri: String,
    pub scopes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthToken {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub id_token: Option<String>,
    pub expires_at: chrono::DateTime<chrono::Utc>,
    pub user_info: UserInfo,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserInfo {
    pub id: String,
    pub email: String,
    pub name: String,
    pub picture: Option<String>,
    pub roles: Vec<String>,
    pub permissions: Vec<String>,
}

#[derive(Clone)]
pub struct AuthManager {
    config: Arc<RwLock<Option<AuthConfig>>>,
    oidc_client: Arc<RwLock<Option<CoreClient>>>,
    current_token: Arc<RwLock<Option<AuthToken>>>,
    pkce_verifier: Arc<RwLock<Option<PkceCodeVerifier>>>,
}

impl AuthManager {
    pub fn new() -> Self {
        Self {
            config: Arc::new(RwLock::new(None)),
            oidc_client: Arc::new(RwLock::new(None)),
            current_token: Arc::new(RwLock::new(None)),
            pkce_verifier: Arc::new(RwLock::new(None)),
        }
    }
    
    pub async fn initialize(&self, config: AuthConfig) -> Result<()> {
        // Store config
        *self.config.write().await = Some(config.clone());
        
        // Initialize OIDC client
        let provider_metadata = CoreProviderMetadata::discover_async(
            IssuerUrl::new(config.issuer_url.clone())?,
            openidconnect::reqwest::async_http_client,
        )
        .await?;
        
        let client = CoreClient::from_provider_metadata(
            provider_metadata,
            OidcClientId::new(config.client_id.clone()),
            Some(OidcClientSecret::new(config.client_secret.clone())),
        )
        .set_redirect_uri(OidcRedirectUrl::new(config.redirect_uri.clone())?);
        
        *self.oidc_client.write().await = Some(client);
        
        info!("Auth manager initialized with provider: {}", config.provider);
        Ok(())
    }
    
    pub async fn start_auth_flow(&self) -> Result<String> {
        let client = self.oidc_client.read().await;
        let client = client.as_ref().ok_or_else(|| anyhow!("OIDC client not initialized"))?;
        
        let config = self.config.read().await;
        let config = config.as_ref().ok_or_else(|| anyhow!("Auth config not set"))?;
        
        // Generate PKCE challenge
        let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();
        *self.pkce_verifier.write().await = Some(pkce_verifier);
        
        // Generate the authorization URL
        let mut auth_url = client
            .authorize_url(
                AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
                OidcCsrfToken::new_random,
                Nonce::new_random,
            )
            .set_pkce_challenge(pkce_challenge);
        
        // Add scopes
        for scope in &config.scopes {
            auth_url = auth_url.add_scope(OidcScope::new(scope.clone()));
        }
        
        let (auth_url, _csrf_token, _nonce) = auth_url.url();
        
        Ok(auth_url.to_string())
    }
    
    pub async fn handle_callback(&self, code: String, state: String) -> Result<AuthToken> {
        let client = self.oidc_client.read().await;
        let client = client.as_ref().ok_or_else(|| anyhow!("OIDC client not initialized"))?;
        
        let pkce_verifier = self.pkce_verifier.write().await.take()
            .ok_or_else(|| anyhow!("No PKCE verifier found"))?;
        
        // Exchange code for token
        let token_response = client
            .exchange_code(OidcAuthCode::new(code))
            .set_pkce_verifier(pkce_verifier)
            .request_async(openidconnect::reqwest::async_http_client)
            .await?;
        
        // Extract tokens
        let id_token = token_response
            .id_token()
            .ok_or_else(|| anyhow!("No ID token in response"))?;
        
        let claims = id_token.claims();
        
        // Create user info from claims
        let user_info = UserInfo {
            id: claims.subject().to_string(),
            email: claims.email()
                .map(|e| e.to_string())
                .unwrap_or_default(),
            name: claims.name()
                .and_then(|n| n.get(None))
                .map(|n| n.to_string())
                .unwrap_or_default(),
            picture: claims.picture()
                .and_then(|p| p.get(None))
                .map(|p| p.to_string()),
            roles: vec![],
            permissions: vec![],
        };
        
        let auth_token = AuthToken {
            access_token: token_response.access_token().secret().clone(),
            refresh_token: token_response.refresh_token().map(|t| t.secret().clone()),
            id_token: Some(id_token.to_string()),
            expires_at: chrono::Utc::now() + chrono::Duration::seconds(
                token_response.expires_in()
                    .map(|d| d.as_secs() as i64)
                    .unwrap_or(3600)
            ),
            user_info,
        };
        
        // Store the token
        *self.current_token.write().await = Some(auth_token.clone());
        
        info!("User authenticated: {}", auth_token.user_info.email);
        Ok(auth_token)
    }
    
    pub async fn refresh_token(&self) -> Result<AuthToken> {
        let client = self.oidc_client.read().await;
        let client = client.as_ref().ok_or_else(|| anyhow!("OIDC client not initialized"))?;
        
        let current_token = self.current_token.read().await;
        let current_token = current_token.as_ref().ok_or_else(|| anyhow!("No current token"))?;
        
        let refresh_token = current_token.refresh_token.as_ref()
            .ok_or_else(|| anyhow!("No refresh token available"))?;
        
        // Exchange refresh token for new access token
        let token_response = client
            .exchange_refresh_token(&oauth2::RefreshToken::new(refresh_token.clone()))
            .request_async(openidconnect::reqwest::async_http_client)
            .await?;
        
        let mut auth_token = current_token.clone();
        auth_token.access_token = token_response.access_token().secret().clone();
        auth_token.expires_at = chrono::Utc::now() + chrono::Duration::seconds(
            token_response.expires_in()
                .map(|d| d.as_secs() as i64)
                .unwrap_or(3600)
        );
        
        if let Some(new_refresh_token) = token_response.refresh_token() {
            auth_token.refresh_token = Some(new_refresh_token.secret().clone());
        }
        
        // Update stored token
        *self.current_token.write().await = Some(auth_token.clone());
        
        Ok(auth_token)
    }
    
    pub async fn logout(&self) -> Result<()> {
        // Clear stored token
        *self.current_token.write().await = None;
        
        // TODO: Call revocation endpoint if supported
        
        info!("User logged out");
        Ok(())
    }
    
    pub async fn get_current_user(&self) -> Option<UserInfo> {
        let token = self.current_token.read().await;
        token.as_ref().map(|t| t.user_info.clone())
    }
    
    pub async fn is_authenticated(&self) -> bool {
        let token = self.current_token.read().await;
        
        if let Some(token) = token.as_ref() {
            // Check if token is still valid
            token.expires_at > chrono::Utc::now()
        } else {
            false
        }
    }
    
    pub async fn get_access_token(&self) -> Result<String> {
        // Check if we need to refresh
        if !self.is_authenticated().await {
            if self.current_token.read().await.as_ref().and_then(|t| t.refresh_token.as_ref()).is_some() {
                self.refresh_token().await?;
            } else {
                return Err(anyhow!("Not authenticated"));
            }
        }
        
        let token = self.current_token.read().await;
        let token = token.as_ref().ok_or_else(|| anyhow!("No current token"))?;
        
        Ok(token.access_token.clone())
    }
}

// Policy-based access control
pub struct PolicyEngine {
    policies: Vec<Policy>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Policy {
    pub id: String,
    pub name: String,
    pub resource: String,
    pub action: String,
    pub effect: PolicyEffect,
    pub conditions: Vec<PolicyCondition>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PolicyEffect {
    Allow,
    Deny,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyCondition {
    pub attribute: String,
    pub operator: String,
    pub value: serde_json::Value,
}

impl PolicyEngine {
    pub fn new() -> Self {
        Self {
            policies: vec![],
        }
    }
    
    pub fn evaluate(&self, user: &UserInfo, resource: &str, action: &str) -> bool {
        let mut allow = false;
        let mut explicit_deny = false;
        
        for policy in &self.policies {
            if policy.resource == resource && policy.action == action {
                if self.evaluate_conditions(&policy.conditions, user) {
                    match policy.effect {
                        PolicyEffect::Allow => allow = true,
                        PolicyEffect::Deny => explicit_deny = true,
                    }
                }
            }
        }
        
        // Explicit deny overrides allow
        allow && !explicit_deny
    }
    
    fn evaluate_conditions(&self, conditions: &[PolicyCondition], user: &UserInfo) -> bool {
        conditions.iter().all(|condition| {
            match condition.attribute.as_str() {
                "role" => {
                    if let Some(required_role) = condition.value.as_str() {
                        user.roles.contains(&required_role.to_string())
                    } else {
                        false
                    }
                }
                "email" => {
                    if let Some(pattern) = condition.value.as_str() {
                        user.email.contains(pattern)
                    } else {
                        false
                    }
                }
                _ => false,
            }
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_policy_evaluation() {
        let mut engine = PolicyEngine::new();
        
        engine.policies.push(Policy {
            id: "1".to_string(),
            name: "Admin access".to_string(),
            resource: "settings".to_string(),
            action: "write".to_string(),
            effect: PolicyEffect::Allow,
            conditions: vec![
                PolicyCondition {
                    attribute: "role".to_string(),
                    operator: "equals".to_string(),
                    value: serde_json::json!("admin"),
                }
            ],
        });
        
        let admin_user = UserInfo {
            id: "1".to_string(),
            email: "admin@example.com".to_string(),
            name: "Admin".to_string(),
            picture: None,
            roles: vec!["admin".to_string()],
            permissions: vec![],
        };
        
        let regular_user = UserInfo {
            id: "2".to_string(),
            email: "user@example.com".to_string(),
            name: "User".to_string(),
            picture: None,
            roles: vec!["user".to_string()],
            permissions: vec![],
        };
        
        assert!(engine.evaluate(&admin_user, "settings", "write"));
        assert!(!engine.evaluate(&regular_user, "settings", "write"));
    }
}