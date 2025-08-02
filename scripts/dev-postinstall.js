#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running post-install setup...');

// Check Rust installation
try {
  execSync('rustc --version', { stdio: 'pipe' });
  console.log('✅ Rust is installed');
} catch {
  console.error('❌ Rust is not installed. Please install from https://rustup.rs/');
  process.exit(1);
}

// Install Rust dependencies
console.log('📦 Installing Rust dependencies...');
try {
  execSync('cd apps/desktop/src-tauri && cargo fetch', { stdio: 'inherit' });
  console.log('✅ Rust dependencies installed');
} catch (error) {
  console.error('❌ Failed to install Rust dependencies:', error.message);
  process.exit(1);
}

// Create required directories
const dirs = [
  'apps/desktop/src-tauri/icons',
  'plugins',
  'tests/fixtures',
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Setup git hooks
console.log('🔧 Setting up git hooks...');
try {
  execSync('npx husky install', { stdio: 'inherit' });
  execSync('npx husky add .husky/pre-commit "pnpm lint-staged"', { stdio: 'inherit' });
  console.log('✅ Git hooks configured');
} catch {
  console.warn('⚠️  Failed to setup git hooks (not in git repo?)');
}

console.log('\n✨ Setup complete! Run "pnpm dev" to start developing.');