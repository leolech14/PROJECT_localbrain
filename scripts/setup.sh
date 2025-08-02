#!/bin/bash

# LocalBrain Setup Script
# This script sets up the development environment for LocalBrain

set -e  # Exit on any error

echo "🧠 LocalBrain Setup Script"
echo "=========================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS. Please adapt for your platform."
    exit 1
fi

print_info "Setting up LocalBrain development environment..."

# Check for required tools
print_info "Checking for required tools..."

# Check for Xcode Command Line Tools
if ! xcode-select -p &> /dev/null; then
    print_warning "Xcode Command Line Tools not found. Installing..."
    xcode-select --install
    print_info "Please complete the Xcode Command Line Tools installation and run this script again."
    exit 1
else
    print_status "Xcode Command Line Tools found"
fi

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    print_warning "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    print_status "Homebrew found"
fi

# Check for Rust
if ! command -v rustc &> /dev/null; then
    print_warning "Rust not found. Installing..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    print_status "Rust found"
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Installing via Homebrew..."
    brew install node
else
    print_status "Node.js found ($(node --version))"
fi

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing..."
    npm install -g pnpm
else
    print_status "pnpm found ($(pnpm --version))"
fi

# Install Tauri CLI
if ! command -v cargo-tauri &> /dev/null; then
    print_warning "Tauri CLI not found. Installing..."
    cargo install tauri-cli --version "^2.0.0-alpha"
else
    print_status "Tauri CLI found"
fi

# Install additional Rust tools
print_info "Installing additional Rust tools..."
cargo install cargo-audit cargo-deny

# Install system dependencies
print_info "Installing system dependencies..."
brew install --quiet sqlcipher

# Install frontend dependencies
print_info "Installing frontend dependencies..."
pnpm install

# Setup environment file
if [ ! -f ".env" ]; then
    print_info "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your API keys and configuration"
else
    print_status ".env file already exists"
fi

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p data/models
mkdir -p plugins
mkdir -p logs

# Initialize database (this would normally be done by the app)
print_info "Database will be initialized on first run"

# Build the project to verify everything works
print_info "Building the project to verify setup..."
cd apps/desktop

# Build frontend
print_info "Building frontend..."
pnpm build

# Build Tauri app in debug mode
print_info "Building Tauri app (debug mode)..."
pnpm tauri build --debug

cd ../..

print_status "Setup completed successfully!"
echo ""
echo "🎉 LocalBrain is ready for development!"
echo ""
echo "To get started:"
echo "  1. Edit .env file with your configuration"
echo "  2. Run: cd apps/desktop && pnpm tauri dev"
echo ""
echo "Useful commands:"
echo "  pnpm dev              - Start development server"
echo "  pnpm build            - Build for production"
echo "  pnpm test             - Run tests"
echo "  pnpm lint             - Run linting"
echo "  pnpm tauri dev        - Start Tauri development"
echo "  pnpm tauri build      - Build Tauri app"
echo ""
echo "For more information, see README.md"