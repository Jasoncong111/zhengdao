#!/bin/bash

# ZhengDAO Solana SBT Program - Environment Setup Script
# TASK-B: Solana程序部署准备

set -e  # Exit on error

echo "🚀 ZhengDAO SBT Program - Environment Setup"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect OS
OS="$(uname -s)"
echo "🖥️  Detected OS: $OS"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Rust
install_rust() {
    echo "📦 Installing Rust..."
    if [[ "$OS" == "Darwin" ]]; then
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    else
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    fi

    # Source cargo environment
    source $HOME/.cargo/env

    if command_exists rustc; then
        echo -e "${GREEN}✅ Rust installed successfully${NC}"
        rustc --version
        cargo --version
    else
        echo -e "${RED}❌ Rust installation failed${NC}"
        echo "Please install manually from: https://rustup.rs/"
        exit 1
    fi
    echo ""
}

# Function to install Solana CLI
install_solana() {
    echo "📦 Installing Solana CLI..."
    if [[ "$OS" == "Darwin" ]]; then
        curl -sSfL https://release.solana.com/stable/install | sh
    else
        curl -sSfL https://release.solana.com/stable/install | sh
    fi

    # Add to PATH for current session
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

    if command_exists solana; then
        echo -e "${GREEN}✅ Solana CLI installed successfully${NC}"
        solana --version
    else
        echo -e "${RED}❌ Solana CLI installation failed${NC}"
        echo "Please install manually from: https://docs.solana.com/cli/install-solana-cli-tools"
        exit 1
    fi
    echo ""
}

# Function to install Anchor
install_anchor() {
    echo "📦 Installing Anchor Framework..."

    # First ensure Rust is available
    if ! command_exists rustc; then
        echo -e "${YELLOW}⚠️  Rust not found, installing...${NC}"
        install_rust
    fi

    # Install avm (Anchor Version Manager)
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

    # Install latest Anchor
    $HOME/.cargo/bin/avm install latest
    $HOME/.cargo/bin/avm use latest

    # Add to PATH for current session
    export PATH="$HOME/.avm/bin:$PATH"

    if command_exists anchor; then
        echo -e "${GREEN}✅ Anchor installed successfully${NC}"
        anchor --version
    else
        echo -e "${RED}❌ Anchor installation failed${NC}"
        echo "Please check: https://www.anchor-lang.com/docs/installation"
        exit 1
    fi
    echo ""
}

# Step 1: Check and install Rust
echo "🔍 Step 1/5: Checking Rust..."
if command_exists rustc; then
    echo -e "${GREEN}✅ Rust is already installed${NC}"
    rustc --version
    cargo --version
else
    echo -e "${YELLOW}⚠️  Rust not found, installing...${NC}"
    install_rust
fi
echo ""

# Step 2: Check and install Solana CLI
echo "🔍 Step 2/5: Checking Solana CLI..."
if command_exists solana; then
    echo -e "${GREEN}✅ Solana CLI is already installed${NC}"
    solana --version
else
    echo -e "${YELLOW}⚠️  Solana CLI not found, installing...${NC}"
    install_solana
fi
echo ""

# Step 3: Check and install Anchor
echo "🔍 Step 3/5: Checking Anchor..."
if command_exists anchor; then
    echo -e "${GREEN}✅ Anchor is already installed${NC}"
    anchor --version
else
    echo -e "${YELLOW}⚠️  Anchor not found, installing...${NC}"
    install_anchor
fi
echo ""

# Step 4: Configure Solana
echo "🔍 Step 4/5: Configuring Solana..."
if command_exists solana; then
    # Set to devnet
    solana config set --url devnet

    # Display current configuration
    echo ""
    echo "📊 Current Solana Configuration:"
    echo "================================"
    solana config get
    echo ""

    # Check if keypair exists
    if [ -f "$HOME/.config/solana/id.json" ]; then
        echo -e "${GREEN}✅ Solana keypair exists${NC}"
        solana address
    else
        echo -e "${YELLOW}⚠️  Creating new Solana keypair...${NC}"
        solana-keygen new --no-bip39-passphrase --silent
    fi
    echo ""

    # Check balance and request airdrop if needed
    echo "💰 Checking wallet balance..."
    BALANCE=$(solana balance | awk '{print $1}')
    echo "Current balance: $BALANCE SOL"
    echo ""

    if (( $(echo "$BALANCE < 2.0" | bc -l 2>/dev/null || echo 0) )); then
        echo "Requesting airdrop..."
        solana airdrop 2
        echo ""
    fi
fi

# Step 5: Install Node.js dependencies
echo "🔍 Step 5/5: Installing Node.js dependencies..."
if command_exists npm; then
    echo "Installing project dependencies..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  npm not found. Please install Node.js from: https://nodejs.org/${NC}"
fi
echo ""

# Final verification
echo "============================================"
echo "🎉 Environment Setup Summary"
echo "============================================"
echo ""

ENVIRONMENT_READY=true

if command_exists rustc; then
    echo -e "${GREEN}✅${NC} Rust $(rustc --version)"
else
    echo -e "${RED}❌ Rust not installed${NC}"
    ENVIRONMENT_READY=false
fi

if command_exists solana; then
    echo -e "${GREEN}✅${NC} Solana CLI $(solana --version)"
else
    echo -e "${RED}❌ Solana CLI not installed${NC}"
    ENVIRONMENT_READY=false
fi

if command_exists anchor; then
    echo -e "${GREEN}✅${NC} Anchor $(anchor --version)"
else
    echo -e "${RED}❌ Anchor not installed${NC}"
    ENVIRONMENT_READY=false
fi

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Node.js dependencies installed"
else
    echo -e "${YELLOW}⚠️  Node.js dependencies not installed${NC}"
fi

echo ""

if [ "$ENVIRONMENT_READY" = true ]; then
    echo -e "${GREEN}🎉 Environment is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Build the program: ${BLUE}anchor build${NC}"
    echo "2. Run tests: ${BLUE}anchor test${NC}"
    echo "3. Deploy to devnet: ${BLUE}./scripts/deploy-devnet.sh${NC}"
    echo ""
else
    echo -e "${RED}⚠️  Some components are missing. Please fix the errors above.${NC}"
    exit 1
fi

echo ""
echo "============================================"
echo "Setup completed!"
echo "============================================"
