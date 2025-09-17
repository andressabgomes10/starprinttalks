#!/usr/bin/env python3
"""
Focused Error Handling Tests for Cajá Talks Backend
Tests specific error handling improvements after fixes
"""

import requests
import json
import uuid
from datetime import datetime
from typing import Dict, Any

class ErrorHandlingTester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_user_id = None
        self.test_client_id = None
        
        # Test data
        self.test_email = f"error_test_{uuid.uuid4().hex[:8]}@cajatalks.com"
        self.test_password = "TestSenh@123"
        
    def log(self, message: str, level: str = "INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> Dict:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add auth header if we have a token
        if self.auth_token and headers is None:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
        elif self.auth_token and headers:
            headers["Authorization"] = f"Bearer {self.auth_token}"
            
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers, timeout=10)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=headers, timeout=10)
            elif method.upper() == "PATCH":
                response = self.session.patch(url, json=data, headers=headers, timeout=10)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return {
                "status_code": response.status_code,
                "data": response.json() if response.content else {},
                "success": 200 <= response.status_code < 300,
                "response_text": response.text
            }
        except requests.exceptions.RequestException as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False,
                "response_text": str(e)
            }
        except json.JSONDecodeError:
            return {
                "status_code": response.status_code,
                "data": {"error": "Invalid JSON response"},
                "success": False,
                "response_text": response.text
            }
    
    def setup_auth(self) -> bool:
        """Setup authentication for tests"""
        self.log("Setting up authentication...")
        
        # Register user
        register_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        result = self.make_request("POST", "/api/auth/register", register_data)
        if not result["success"]:
            self.log(f"❌ Failed to register test user: {result}", "ERROR")
            return False
            
        # Login user
        login_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        result = self.make_request("POST", "/api/auth/login", login_data)
        if result["success"] and result["data"].get("ok"):
            auth_data = result["data"].get("data", {})
            if auth_data.get("access_token"):
                self.auth_token = auth_data["access_token"]
                self.log("✅ Authentication setup successful")
                return True
                
        self.log(f"❌ Failed to login test user: {result}", "ERROR")
        return False
    
    def test_health_endpoint(self) -> bool:
        """Test GET /api/health"""
        self.log("Testing health endpoint...")
        
        result = self.make_request("GET", "/api/health")
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Health endpoint working")
            return True
        else:
            self.log(f"❌ Health endpoint failed: {result}", "ERROR")
            return False
    
    def test_auth_register(self) -> bool:
        """Test POST /api/auth/register"""
        self.log("Testing auth register endpoint...")
        
        test_email = f"register_test_{uuid.uuid4().hex[:8]}@cajatalks.com"
        register_data = {
            "email": test_email,
            "password": "TestPassword123!"
        }
        
        result = self.make_request("POST", "/api/auth/register", register_data)
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Auth register working")
            return True
        else:
            self.log(f"❌ Auth register failed: {result}", "ERROR")
            return False
    
    def test_auth_login(self) -> bool:
        """Test POST /api/auth/login"""
        self.log("Testing auth login endpoint...")
        
        # Use existing test user
        login_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        result = self.make_request("POST", "/api/auth/login", login_data)
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Auth login working")
            return True
        else:
            self.log(f"❌ Auth login failed: {result}", "ERROR")
            return False
    
    def test_invalid_uuid_clients(self) -> bool:
        """Test PATCH /api/clients with invalid UUID - should return 400"""
        self.log("Testing invalid UUID for clients (should return 400)...")
        
        if not self.auth_token:
            self.log("❌ No auth token available", "ERROR")
            return False
            
        update_data = {"name": "Test Update"}
        result = self.make_request("PATCH", "/api/clients/invalid-id", update_data)
        
        if result["status_code"] == 400:
            self.log("✅ Invalid UUID properly returns 400 Bad Request")
            return True
        elif result["status_code"] == 500:
            self.log("❌ Invalid UUID still returns 500 Internal Server Error - FIX NEEDED", "ERROR")
            return False
        else:
            self.log(f"⚠️ Invalid UUID returns unexpected status {result['status_code']}: {result}", "WARN")
            return False
    
    def test_nonexistent_uuid_clients(self) -> bool:
        """Test PATCH /api/clients with valid but non-existent UUID - should return 404"""
        self.log("Testing valid but non-existent UUID for clients (should return 404)...")
        
        if not self.auth_token:
            self.log("❌ No auth token available", "ERROR")
            return False
            
        fake_uuid = "00000000-0000-0000-0000-000000000000"
        update_data = {"name": "Test Update"}
        result = self.make_request("PATCH", f"/api/clients/{fake_uuid}", update_data)
        
        if result["status_code"] == 404:
            self.log("✅ Non-existent UUID properly returns 404 Not Found")
            return True
        else:
            self.log(f"⚠️ Non-existent UUID returns status {result['status_code']}: {result}", "WARN")
            return False
    
    def test_invalid_uuid_tickets(self) -> bool:
        """Test PATCH /api/tickets with invalid UUID - should return 400"""
        self.log("Testing invalid UUID for tickets (should return 400)...")
        
        if not self.auth_token:
            self.log("❌ No auth token available", "ERROR")
            return False
            
        update_data = {"status": "in_progress"}
        result = self.make_request("PATCH", "/api/tickets/invalid-id", update_data)
        
        if result["status_code"] == 400:
            self.log("✅ Invalid UUID properly returns 400 Bad Request")
            return True
        elif result["status_code"] == 500:
            self.log("❌ Invalid UUID still returns 500 Internal Server Error - FIX NEEDED", "ERROR")
            return False
        else:
            self.log(f"⚠️ Invalid UUID returns unexpected status {result['status_code']}: {result}", "WARN")
            return False
    
    def test_teams_missing_name(self) -> bool:
        """Test POST /api/teams without name field - should return 400"""
        self.log("Testing teams creation without name field (should return 400)...")
        
        if not self.auth_token:
            self.log("❌ No auth token available", "ERROR")
            return False
            
        # Missing required "name" field
        team_data = {
            "description": "Test team without name",
            "department": "Test Department"
        }
        
        result = self.make_request("POST", "/api/teams", team_data)
        
        if result["status_code"] == 400:
            self.log("✅ Missing name field properly returns 400 Bad Request")
            return True
        elif result["status_code"] == 500:
            self.log("❌ Missing name field returns 500 Internal Server Error - FIX NEEDED", "ERROR")
            return False
        else:
            self.log(f"⚠️ Missing name field returns unexpected status {result['status_code']}: {result}", "WARN")
            return False
    
    def test_teams_valid_creation(self) -> bool:
        """Test POST /api/teams with valid data"""
        self.log("Testing teams creation with valid data...")
        
        if not self.auth_token:
            self.log("❌ No auth token available", "ERROR")
            return False
            
        team_data = {
            "name": "Test Error Handling Team",
            "description": "Team created during error handling tests",
            "department": "Quality Assurance"
        }
        
        result = self.make_request("POST", "/api/teams", team_data)
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Valid team creation working")
            return True
        else:
            self.log(f"❌ Valid team creation failed: {result}", "ERROR")
            return False
    
    def test_clients_valid_creation(self) -> bool:
        """Test POST /api/clients with valid data"""
        self.log("Testing clients creation with valid data...")
        
        if not self.auth_token:
            self.log("❌ No auth token available", "ERROR")
            return False
            
        client_data = {
            "name": "Test Error Handling Client",
            "document": "12.345.678/0001-99",
            "email": "test@errorhandling.com",
            "phone": "(11) 99999-9999"
        }
        
        result = self.make_request("POST", "/api/clients", client_data)
        
        if result["success"] and result["data"].get("ok"):
            client_info = result["data"].get("data", {})
            if client_info.get("id"):
                self.test_client_id = client_info["id"]
                self.log(f"✅ Valid client creation working - ID: {self.test_client_id}")
                return True
            else:
                self.log("❌ Client creation returned success but no ID", "ERROR")
                return False
        else:
            self.log(f"❌ Valid client creation failed: {result}", "ERROR")
            return False
    
    def check_backend_logs(self):
        """Check backend logs for errors"""
        self.log("Checking backend logs for errors...")
        try:
            import subprocess
            result = subprocess.run(
                ["tail", "-n", "20", "/var/log/supervisor/backend.err.log"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.stdout.strip():
                self.log("Recent backend error logs:")
                for line in result.stdout.strip().split('\n')[-10:]:  # Last 10 lines
                    if line.strip():
                        self.log(f"  {line}")
            else:
                self.log("✅ No recent errors in backend logs")
        except Exception as e:
            self.log(f"Could not check backend logs: {e}", "WARN")
    
    def run_focused_tests(self) -> Dict[str, bool]:
        """Run focused error handling tests"""
        self.log("=" * 60)
        self.log("TESTES FOCADOS DE ERROR HANDLING - CAJÁ TALKS")
        self.log("=" * 60)
        
        results = {}
        
        # Basic health and auth tests
        results["health_check"] = self.test_health_endpoint()
        results["auth_register"] = self.test_auth_register()
        results["auth_login"] = self.test_auth_login()
        
        # Setup authentication for protected endpoints
        if not self.setup_auth():
            self.log("❌ Failed to setup authentication - skipping protected endpoint tests", "ERROR")
            return results
        
        # Error handling tests - the main focus
        results["invalid_uuid_clients"] = self.test_invalid_uuid_clients()
        results["nonexistent_uuid_clients"] = self.test_nonexistent_uuid_clients()
        results["invalid_uuid_tickets"] = self.test_invalid_uuid_tickets()
        results["teams_missing_name"] = self.test_teams_missing_name()
        
        # Valid operations to ensure basic functionality still works
        results["teams_valid_creation"] = self.test_teams_valid_creation()
        results["clients_valid_creation"] = self.test_clients_valid_creation()
        
        # Check logs
        self.check_backend_logs()
        
        # Summary
        self.log("=" * 60)
        self.log("RESUMO DOS TESTES DE ERROR HANDLING")
        self.log("=" * 60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASSOU" if result else "❌ FALHOU"
            self.log(f"{test_name.replace('_', ' ').title()}: {status}")
        
        self.log("=" * 60)
        self.log(f"RESULTADO FINAL: {passed}/{total} testes passaram")
        
        # Focus on error handling results
        error_handling_tests = [
            "invalid_uuid_clients",
            "nonexistent_uuid_clients", 
            "invalid_uuid_tickets",
            "teams_missing_name"
        ]
        
        error_handling_passed = sum(1 for test in error_handling_tests if results.get(test, False))
        error_handling_total = len(error_handling_tests)
        
        self.log(f"ERROR HANDLING ESPECÍFICO: {error_handling_passed}/{error_handling_total} testes passaram")
        
        if error_handling_passed == error_handling_total:
            self.log("🎉 TODOS OS TESTES DE ERROR HANDLING PASSARAM!")
        else:
            self.log(f"⚠️ {error_handling_total - error_handling_passed} teste(s) de error handling falharam.")
        
        self.log("=" * 60)
        
        return results

def main():
    """Main test execution"""
    tester = ErrorHandlingTester()
    results = tester.run_focused_tests()
    
    # Focus on error handling tests for exit code
    error_handling_tests = [
        "invalid_uuid_clients",
        "nonexistent_uuid_clients", 
        "invalid_uuid_tickets",
        "teams_missing_name"
    ]
    
    error_handling_passed = all(results.get(test, False) for test in error_handling_tests)
    
    if not error_handling_passed:
        exit(1)

if __name__ == "__main__":
    main()