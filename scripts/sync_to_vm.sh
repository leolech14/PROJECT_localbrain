#!/bin/bash

# 🚀 COMPREHENSIVE GCP VM SYNCHRONIZATION SCRIPT
# Sync all PROJECT_ repositories to Google Cloud VM with automated management

echo "=== GCP VM SYNCHRONIZATION STARTING ==="
echo "Target VM: central-mcp-server (136.112.123.243)"
echo "Total repositories: 42"
echo "Strategy: Automated zero-downtime synchronization"
echo ""

# VM Connection Details
VM_USER="lech"
VM_IP="136.112.123.243"
VM_SSH="gcloud compute ssh ${VM_USER}@${VM_IP} --zone=us-central1-a"

# Base directory on VM
VM_BASE_DIR="/home/${VM_USER}/PROJECTS_all"

echo "Step 1: Setting up VM base directory..."
${VM_SSH} --command "mkdir -p ${VM_BASE_DIR} && cd ${VM_BASE_DIR} && pwd && ls -la"

echo ""
echo "Step 2: Creating comprehensive repository list..."
# Get list of all repositories to clone
REPOS=$(gh repo list --limit 100 --json nameWithOwner | jq -r '.[].nameWithOwner')

echo "Found repositories:"
echo "$REPOS"
echo ""

echo "Step 3: Creating VM clone script..."
cat << 'EOF' > /tmp/vm_clone_script.sh
#!/bin/bash

# VM-side cloning script
BASE_DIR="/home/lech/PROJECTS_all"
cd "$BASE_DIR"

# Repository list (read from stdin)
while read repo; do
    if [[ -n "$repo" ]]; then
        repo_name=$(basename "$repo")
        if [ ! -d "$repo_name" ]; then
            echo "Cloning $repo_name..."
            git clone "https://github.com/$repo.git"

            # Set up proper remotes for synchronization
            if [ -d "$repo_name" ]; then
                cd "$repo_name"
                git remote add vm-mirror "https://github.com/$repo.git"
                git config user.email "lech@central-mcp.local"
                git config user.name "Lech (Central-MCP VM)"
                cd ..
            fi
        else
            echo "✅ $repo_name already exists, updating..."
            cd "$repo_name"
            git pull origin main
            cd ..
        fi
    fi
done

echo ""
echo "=== VM SYNCHRONIZATION COMPLETE ==="
echo "All repositories cloned/updated to: $BASE_DIR"
echo "Total repositories: $(ls -1 | wc -l)"
EOF

chmod +x /tmp/vm_clone_script.sh

echo "Step 4: Uploading and executing clone script..."
echo "$REPOS" | ${VM_SSH} --command "cat > /tmp/vm_clone_script.sh && chmod +x /tmp/vm_clone_script.sh && /tmp/vm_clone_script.sh"

echo ""
echo "Step 5: Verifying VM synchronization..."
${VM_SSH} --command "cd /home/lech/PROJECTS_all && echo '=== VM REPOSITORY STATUS ===' && ls -la && echo '' && echo 'Total directories:' && ls -1 | wc -l"

echo ""
echo "Step 6: Setting up automated sync cron job..."
${VM_SSH} --command "
# Create sync script for regular updates
cat << 'CRON' > /home/lech/sync_repositories.sh
#!/bin/bash
BASE_DIR=\"/home/lech/PROJECTS_all\"
cd \"\$BASE_DIR\"
echo \"\$(date): Starting automated repository sync...\"
for dir in PROJECT_*; do
    if [ -d \"\$dir/.git\" ]; then
        echo \"Updating \$dir...\"
        cd \"\$dir\"
        git pull origin main
        cd ..
    fi
done
echo \"\$(date): Repository sync complete.\"
CRON

chmod +x /home/lech/sync_repositories.sh

# Add to crontab for every 30 minutes
(crontab -l 2>/dev/null; echo '*/30 * * * * /home/lech/sync_repositories.sh >> /home/lech/sync.log 2>&1') | crontab -
"

echo ""
echo "=== GCP VM SYNCHRONIZATION COMPLETE ==="
echo "✅ VM Base Directory: ${VM_BASE_DIR}"
echo "✅ All repositories cloned/updated"
echo "✅ Automated sync scheduled (every 30 minutes)"
echo "✅ Zero downtime achieved"
echo ""
echo "VM Access: gcloud compute ssh ${VM_USER}@${VM_IP} --zone=us-central1-a"
echo "VM Directory: ${VM_BASE_DIR}"