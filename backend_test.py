#!/usr/bin/env python3
"""
Backend API Testing Suite for Cajá Talks MVP
Tests all FastAPI endpoints with realistic data
"""

import requests
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class BackendTester:
    def __init__(self, base_url: str = "http://0.0.0.0:8001"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.test_user_id = None
        self.test_client_id = None
        self.test_ticket_id = None
        self.test_team_id = None
        
        # Test data
        self.test_email = f"teste_{uuid.uuid4().hex[:8]}@cajatalks.com"
        self.test_password = "MinhaSenh@123"
        
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
                "success": 200 <= response.status_code < 300
            }
        except requests.exceptions.RequestException as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False
            }
        except json.JSONDecodeError:
            return {
                "status_code": response.status_code,
                "data": {"error": "Invalid JSON response"},
                "success": False
            }
    
    def test_health_check(self) -> bool:
        """Test GET /api/health"""
        self.log("Testing health check endpoint...")
        
        result = self.make_request("GET", "/api/health")
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Health check passed")
            return True
        else:
            self.log(f"❌ Health check failed: {result}", "ERROR")
            return False
    
    def test_auth_register(self) -> bool:
        """Test POST /api/auth/register"""
        self.log("Testing user registration...")
        
        register_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        result = self.make_request("POST", "/api/auth/register", register_data)
        
        if result["success"] and result["data"].get("ok"):
            user_data = result["data"].get("data", {})
            if user_data.get("user"):
                self.test_user_id = user_data["user"]
                self.log(f"✅ User registration successful - User ID: {self.test_user_id}")
                return True
            else:
                self.log("❌ Registration returned success but no user ID", "ERROR")
                return False
        else:
            self.log(f"❌ User registration failed: {result}", "ERROR")
            return False
    
    def test_auth_login(self) -> bool:
        """Test POST /api/auth/login"""
        self.log("Testing user login...")
        
        login_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        result = self.make_request("POST", "/api/auth/login", login_data)
        
        if result["success"] and result["data"].get("ok"):
            auth_data = result["data"].get("data", {})
            if auth_data.get("access_token"):
                self.auth_token = auth_data["access_token"]
                self.log("✅ User login successful - Token acquired")
                return True
            else:
                self.log("❌ Login returned success but no access token", "ERROR")
                return False
        else:
            self.log(f"❌ User login failed: {result}", "ERROR")
            return False
    
    def test_auth_me(self) -> bool:
        """Test GET /api/auth/me"""
        self.log("Testing user info endpoint...")
        
        if not self.auth_token:
            self.log("❌ No auth token available for /me test", "ERROR")
            return False
            
        result = self.make_request("GET", "/api/auth/me")
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ User info endpoint working")
            return True
        else:
            self.log(f"❌ User info endpoint failed: {result}", "ERROR")
            return False
    
    def test_clients_create(self) -> bool:
        """Test POST /api/clients"""
        self.log("Testing client creation...")
        
        if not self.auth_token:
            self.log("❌ No auth token available for client creation", "ERROR")
            return False
            
        client_data = {
            "name": "Empresa Tech Solutions Ltda",
            "document": "12.345.678/0001-90",
            "email": "contato@techsolutions.com.br",
            "phone": "(11) 99999-8888"
        }
        
        result = self.make_request("POST", "/api/clients", client_data)
        
        if result["success"] and result["data"].get("ok"):
            client_info = result["data"].get("data", {})
            if client_info.get("id"):
                self.test_client_id = client_info["id"]
                self.log(f"✅ Client created successfully - ID: {self.test_client_id}")
                return True
            else:
                self.log("❌ Client creation returned success but no ID", "ERROR")
                return False
        else:
            self.log(f"❌ Client creation failed: {result}", "ERROR")
            return False
    
    def test_clients_list(self) -> bool:
        """Test GET /api/clients"""
        self.log("Testing client listing...")
        
        if not self.auth_token:
            self.log("❌ No auth token available for client listing", "ERROR")
            return False
            
        # Test without filters
        result = self.make_request("GET", "/api/clients")
        
        if result["success"] and result["data"].get("ok"):
            clients = result["data"].get("data", [])
            self.log(f"✅ Client listing successful - Found {len(clients)} clients")
            
            # Test with search filter
            if self.test_client_id:
                result_filtered = self.make_request("GET", "/api/clients?q=Tech&limit=10")
                if result_filtered["success"]:
                    self.log("✅ Client search filter working")
                else:
                    self.log("⚠️ Client search filter failed", "WARN")
            
            return True
        else:
            self.log(f"❌ Client listing failed: {result}", "ERROR")
            return False
    
    def test_clients_update(self) -> bool:
        """Test PATCH /api/clients/{id}"""
        self.log("Testing client update...")
        
        if not self.auth_token or not self.test_client_id:
            self.log("❌ No auth token or client ID available for update", "ERROR")
            return False
            
        update_data = {
            "name": "Empresa Tech Solutions Ltda - ATUALIZADA",
            "phone": "(11) 88888-7777"
        }
        
        result = self.make_request("PATCH", f"/api/clients/{self.test_client_id}", update_data)
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Client update successful")
            return True
        else:
            self.log(f"❌ Client update failed: {result}", "ERROR")
            return False
    
    def test_tickets_create(self) -> bool:
        """Test POST /api/tickets"""
        self.log("Testing ticket creation...")
        
        if not self.auth_token or not self.test_client_id:
            self.log("❌ No auth token or client ID available for ticket creation", "ERROR")
            return False
            
        ticket_data = {
            "title": "Problema crítico no sistema de autenticação",
            "description": "Cliente relatando impossibilidade de fazer login após atualização do sistema. Erro ocorre consistentemente em diferentes navegadores.",
            "status": "open",
            "priority": "high",
            "client_id": self.test_client_id
        }
        
        result = self.make_request("POST", "/api/tickets", ticket_data)
        
        if result["success"] and result["data"].get("ok"):
            ticket_info = result["data"].get("data", {})
            if ticket_info.get("id"):
                self.test_ticket_id = ticket_info["id"]
                self.log(f"✅ Ticket created successfully - ID: {self.test_ticket_id}")
                return True
            else:
                self.log("❌ Ticket creation returned success but no ID", "ERROR")
                return False
        else:
            self.log(f"❌ Ticket creation failed: {result}", "ERROR")
            return False
    
    def test_tickets_list(self) -> bool:
        """Test GET /api/tickets"""
        self.log("Testing ticket listing...")
        
        if not self.auth_token:
            self.log("❌ No auth token available for ticket listing", "ERROR")
            return False
            
        # Test without filters
        result = self.make_request("GET", "/api/tickets")
        
        if result["success"] and result["data"].get("ok"):
            tickets = result["data"].get("data", [])
            self.log(f"✅ Ticket listing successful - Found {len(tickets)} tickets")
            
            # Test with filters
            if self.test_ticket_id:
                result_filtered = self.make_request("GET", f"/api/tickets?status=open&priority=high&client_id={self.test_client_id}")
                if result_filtered["success"]:
                    self.log("✅ Ticket filtering working")
                else:
                    self.log("⚠️ Ticket filtering failed", "WARN")
            
            return True
        else:
            self.log(f"❌ Ticket listing failed: {result}", "ERROR")
            return False
    
    def test_tickets_update(self) -> bool:
        """Test PATCH /api/tickets/{id}"""
        self.log("Testing ticket update...")
        
        if not self.auth_token or not self.test_ticket_id:
            self.log("❌ No auth token or ticket ID available for update", "ERROR")
            return False
            
        update_data = {
            "status": "in_progress",
            "description": "Cliente relatando impossibilidade de fazer login após atualização do sistema. Erro ocorre consistentemente em diferentes navegadores. ATUALIZAÇÃO: Investigação iniciada pela equipe técnica."
        }
        
        result = self.make_request("PATCH", f"/api/tickets/{self.test_ticket_id}", update_data)
        
        if result["success"] and result["data"].get("ok"):
            self.log("✅ Ticket update successful")
            return True
        else:
            self.log(f"❌ Ticket update failed: {result}", "ERROR")
            return False
    
    def test_teams_create(self) -> bool:
        """Test POST /api/teams"""
        self.log("Testing team creation...")
        
        if not self.auth_token:
            self.log("❌ No auth token available for team creation", "ERROR")
            return False
            
        team_data = {
            "name": "Equipe de Suporte Técnico",
            "description": "Responsável pelo atendimento de tickets técnicos e resolução de problemas",
            "department": "Customer Success"
        }
        
        result = self.make_request("POST", "/api/teams", team_data)
        
        if result["success"] and result["data"].get("ok"):
            team_info = result["data"].get("data", {})
            if team_info.get("id"):
                self.test_team_id = team_info["id"]
                self.log(f"✅ Team created successfully - ID: {self.test_team_id}")
                return True
            else:
                self.log("❌ Team creation returned success but no ID", "ERROR")
                return False
        else:
            self.log(f"❌ Team creation failed: {result}", "ERROR")
            return False
    
    def test_teams_list(self) -> bool:
        """Test GET /api/teams"""
        self.log("Testing team listing...")
        
        if not self.auth_token:
            self.log("❌ No auth token available for team listing", "ERROR")
            return False
            
        result = self.make_request("GET", "/api/teams")
        
        if result["success"] and result["data"].get("ok"):
            teams = result["data"].get("data", [])
            self.log(f"✅ Team listing successful - Found {len(teams)} teams")
            return True
        else:
            self.log(f"❌ Team listing failed: {result}", "ERROR")
            return False
    
    def test_error_handling(self) -> bool:
        """Test error handling scenarios"""
        self.log("Testing error handling...")
        
        # Test unauthorized access
        old_token = self.auth_token
        self.auth_token = "invalid_token"
        
        result = self.make_request("GET", "/api/clients")
        if result["status_code"] == 401:
            self.log("✅ Unauthorized access properly handled")
            error_handling_ok = True
        else:
            self.log("❌ Unauthorized access not properly handled", "ERROR")
            error_handling_ok = False
            
        # Restore token
        self.auth_token = old_token
        
        # Test invalid client ID
        if self.auth_token:
            result = self.make_request("PATCH", "/api/clients/invalid-id", {"name": "Test"})
            if result["status_code"] == 404:
                self.log("✅ Invalid resource ID properly handled")
            else:
                self.log("⚠️ Invalid resource ID handling could be improved", "WARN")
        
        return error_handling_ok
    
    def cleanup_test_data(self):
        """Clean up test data"""
        self.log("Cleaning up test data...")
        
        if not self.auth_token:
            self.log("⚠️ No auth token for cleanup", "WARN")
            return
            
        # Delete test ticket
        if self.test_ticket_id:
            result = self.make_request("DELETE", f"/api/tickets/{self.test_ticket_id}")
            if result["success"]:
                self.log("✅ Test ticket deleted")
            else:
                self.log("⚠️ Failed to delete test ticket", "WARN")
        
        # Delete test client
        if self.test_client_id:
            result = self.make_request("DELETE", f"/api/clients/{self.test_client_id}")
            if result["success"]:
                self.log("✅ Test client deleted")
            else:
                self.log("⚠️ Failed to delete test client", "WARN")
    
    def run_all_tests(self) -> Dict[str, bool]:
        """Run all tests and return results"""
        self.log("=" * 60)
        self.log("INICIANDO TESTES DO BACKEND CAJÁ TALKS MVP")
        self.log("=" * 60)
        
        results = {}
        
        # Health check (no auth required)
        results["health_check"] = self.test_health_check()
        
        # Authentication flow
        results["auth_register"] = self.test_auth_register()
        results["auth_login"] = self.test_auth_login()
        results["auth_me"] = self.test_auth_me()
        
        # Clients CRUD
        results["clients_create"] = self.test_clients_create()
        results["clients_list"] = self.test_clients_list()
        results["clients_update"] = self.test_clients_update()
        
        # Tickets CRUD
        results["tickets_create"] = self.test_tickets_create()
        results["tickets_list"] = self.test_tickets_list()
        results["tickets_update"] = self.test_tickets_update()
        
        # Teams
        results["teams_create"] = self.test_teams_create()
        results["teams_list"] = self.test_teams_list()
        
        # Error handling
        results["error_handling"] = self.test_error_handling()
        
        # Cleanup
        self.cleanup_test_data()
        
        # Summary
        self.log("=" * 60)
        self.log("RESUMO DOS TESTES")
        self.log("=" * 60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASSOU" if result else "❌ FALHOU"
            self.log(f"{test_name.replace('_', ' ').title()}: {status}")
        
        self.log("=" * 60)
        self.log(f"RESULTADO FINAL: {passed}/{total} testes passaram")
        
        if passed == total:
            self.log("🎉 TODOS OS TESTES PASSARAM! Backend está funcionando corretamente.")
        else:
            self.log(f"⚠️ {total - passed} teste(s) falharam. Verifique os logs acima.")
        
        self.log("=" * 60)
        
        return results

def main():
    """Main test execution"""
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with error code if any tests failed
    if not all(results.values()):
        exit(1)

if __name__ == "__main__":
    main()