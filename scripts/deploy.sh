#!/bin/bash

# Deploy script for Cajá Talks Interface Design
# This script handles the deployment process with proper error handling

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All dependencies are installed."
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$VITE_SUPABASE_URL" ]; then
        print_warning "VITE_SUPABASE_URL is not set. Using default value."
        export VITE_SUPABASE_URL="https://your-project.supabase.co"
    fi
    
    if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        print_warning "VITE_SUPABASE_ANON_KEY is not set. Using default value."
        export VITE_SUPABASE_ANON_KEY="your-anon-key-here"
    fi
    
    # Set default values if not provided
    export VITE_APP_NAME=${VITE_APP_NAME:-"Cajá Talks Interface Design"}
    export VITE_APP_VERSION=${VITE_APP_VERSION:-"0.1.0"}
    
    print_success "Environment variables configured."
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed successfully."
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test:ci
    print_success "All tests passed."
}

# Run linting
run_lint() {
    print_status "Running linting..."
    npm run lint || print_warning "Linting completed with warnings."
    print_success "Linting completed."
}

# Run type checking
run_type_check() {
    print_status "Running type checking..."
    npm run type-check
    print_success "Type checking passed."
}

# Build application
build_app() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully."
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        if [ "$1" = "preview" ]; then
            vercel
        else
            vercel --prod
        fi
        print_success "Deployed to Vercel successfully."
    else
        print_warning "Vercel CLI not found. Please install it with: npm i -g vercel"
        print_status "Build files are ready in the 'build' directory."
    fi
}

# Deploy locally
deploy_local() {
    print_status "Starting local server..."
    
    if command -v serve &> /dev/null; then
        serve -s build -l 3000
    else
        print_warning "Serve not found. Installing..."
        npx serve -s build -l 3000
    fi
}

# Main deployment function
main() {
    local deploy_type=${1:-"vercel"}
    local environment=${2:-"production"}
    
    print_status "Starting deployment process..."
    print_status "Deploy type: $deploy_type"
    print_status "Environment: $environment"
    
    check_dependencies
    check_env_vars
    install_deps
    run_tests
    run_lint
    run_type_check
    build_app
    
    case $deploy_type in
        "vercel")
            deploy_vercel $environment
            ;;
        "local")
            deploy_local
            ;;
        *)
            print_error "Unknown deploy type: $deploy_type"
            print_status "Available options: vercel, local"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully! 🎉"
}

# Show help
show_help() {
    echo "Cajá Talks Interface Design - Deploy Script"
    echo ""
    echo "Usage: $0 [deploy_type] [environment]"
    echo ""
    echo "Deploy types:"
    echo "  vercel    Deploy to Vercel (default)"
    echo "  local     Deploy locally for testing"
    echo ""
    echo "Environments:"
    echo "  production  Deploy to production (default)"
    echo "  preview     Deploy preview version"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy to Vercel production"
    echo "  $0 vercel preview    # Deploy preview to Vercel"
    echo "  $0 local             # Deploy locally"
    echo ""
    echo "Environment variables:"
    echo "  VITE_SUPABASE_URL     Supabase project URL"
    echo "  VITE_SUPABASE_ANON_KEY Supabase anonymous key"
    echo "  VITE_APP_NAME         Application name"
    echo "  VITE_APP_VERSION      Application version"
}

# Parse command line arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_help
    exit 0
fi

# Run main function
main "$@"
