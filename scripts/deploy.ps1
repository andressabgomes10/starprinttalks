# Deploy script for Cajá Talks Interface Design (PowerShell)
# This script handles the deployment process with proper error handling

param(
    [string]$DeployType = "vercel",
    [string]$Environment = "production"
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Cyan"
    White = "White"
}

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

# Check if required tools are installed
function Test-Dependencies {
    Write-Status "Checking dependencies..."
    
    try {
        $nodeVersion = node --version
        Write-Success "Node.js version: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    }
    
    try {
        $npmVersion = npm --version
        Write-Success "npm version: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }
    
    Write-Success "All dependencies are installed."
}

# Check environment variables
function Test-EnvironmentVariables {
    Write-Status "Checking environment variables..."
    
    if (-not $env:VITE_SUPABASE_URL) {
        Write-Warning "VITE_SUPABASE_URL is not set. Using default value."
        $env:VITE_SUPABASE_URL = "https://your-project.supabase.co"
    }
    
    if (-not $env:VITE_SUPABASE_ANON_KEY) {
        Write-Warning "VITE_SUPABASE_ANON_KEY is not set. Using default value."
        $env:VITE_SUPABASE_ANON_KEY = "your-anon-key-here"
    }
    
    # Set default values if not provided
    if (-not $env:VITE_APP_NAME) {
        $env:VITE_APP_NAME = "Cajá Talks Interface Design"
    }
    
    if (-not $env:VITE_APP_VERSION) {
        $env:VITE_APP_VERSION = "0.1.0"
    }
    
    Write-Success "Environment variables configured."
}

# Install dependencies
function Install-Dependencies {
    Write-Status "Installing dependencies..."
    npm ci
    Write-Success "Dependencies installed successfully."
}

# Run tests
function Invoke-Tests {
    Write-Status "Running tests..."
    npm run test:ci
    Write-Success "All tests passed."
}

# Run linting
function Invoke-Linting {
    Write-Status "Running linting..."
    try {
        npm run lint
        Write-Success "Linting completed."
    }
    catch {
        Write-Warning "Linting completed with warnings."
    }
}

# Run type checking
function Invoke-TypeCheck {
    Write-Status "Running type checking..."
    npm run type-check
    Write-Success "Type checking passed."
}

# Build application
function Build-Application {
    Write-Status "Building application..."
    npm run build
    Write-Success "Application built successfully."
}

# Deploy to Vercel
function Deploy-Vercel {
    param([string]$Env)
    
    Write-Status "Deploying to Vercel..."
    
    try {
        $vercelVersion = vercel --version
        Write-Success "Vercel CLI version: $vercelVersion"
        
        if ($Env -eq "preview") {
            vercel
        }
        else {
            vercel --prod
        }
        Write-Success "Deployed to Vercel successfully."
    }
    catch {
        Write-Warning "Vercel CLI not found. Please install it with: npm i -g vercel"
        Write-Status "Build files are ready in the 'build' directory."
    }
}

# Deploy locally
function Deploy-Local {
    Write-Status "Starting local server..."
    
    try {
        $serveVersion = serve --version
        Write-Success "Serve version: $serveVersion"
        serve -s build -l 3000
    }
    catch {
        Write-Warning "Serve not found. Installing..."
        npx serve -s build -l 3000
    }
}

# Show help
function Show-Help {
    Write-Host "Cajá Talks Interface Design - Deploy Script (PowerShell)" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Usage: .\scripts\deploy.ps1 [DeployType] [Environment]" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Deploy types:" -ForegroundColor $Colors.White
    Write-Host "  vercel    Deploy to Vercel (default)" -ForegroundColor $Colors.White
    Write-Host "  local     Deploy locally for testing" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Environments:" -ForegroundColor $Colors.White
    Write-Host "  production  Deploy to production (default)" -ForegroundColor $Colors.White
    Write-Host "  preview     Deploy preview version" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor $Colors.White
    Write-Host "  .\scripts\deploy.ps1                    # Deploy to Vercel production" -ForegroundColor $Colors.White
    Write-Host "  .\scripts\deploy.ps1 vercel preview    # Deploy preview to Vercel" -ForegroundColor $Colors.White
    Write-Host "  .\scripts\deploy.ps1 local             # Deploy locally" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Environment variables:" -ForegroundColor $Colors.White
    Write-Host "  VITE_SUPABASE_URL     Supabase project URL" -ForegroundColor $Colors.White
    Write-Host "  VITE_SUPABASE_ANON_KEY Supabase anonymous key" -ForegroundColor $Colors.White
    Write-Host "  VITE_APP_NAME         Application name" -ForegroundColor $Colors.White
    Write-Host "  VITE_APP_VERSION      Application version" -ForegroundColor $Colors.White
}

# Main deployment function
function Start-Deployment {
    param([string]$Type, [string]$Env)
    
    Write-Status "Starting deployment process..."
    Write-Status "Deploy type: $Type"
    Write-Status "Environment: $Env"
    
    Test-Dependencies
    Test-EnvironmentVariables
    Install-Dependencies
    Invoke-Tests
    Invoke-Linting
    Invoke-TypeCheck
    Build-Application
    
    switch ($Type) {
        "vercel" {
            Deploy-Vercel $Env
        }
        "local" {
            Deploy-Local
        }
        default {
            Write-Error "Unknown deploy type: $Type"
            Write-Status "Available options: vercel, local"
            exit 1
        }
    }
    
    Write-Success "Deployment completed successfully! 🎉"
}

# Parse command line arguments
if ($args -contains "--help" -or $args -contains "-h") {
    Show-Help
    exit 0
}

# Run main function
Start-Deployment $DeployType $Environment
