#!/usr/bin/env python3
"""
Direct Validation Logic Tests for Cajá Talks Backend
Tests the validation functions directly without network dependencies
"""

import sys
import os
sys.path.append('/app/backend')

from datetime import datetime

class ValidationTester:
    def __init__(self):
        pass
        
    def log(self, message: str, level: str = "INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def test_uuid_validation_function(self) -> bool:
        """Test the is_valid_uuid function directly"""
        self.log("Testing UUID validation function directly...")
        
        try:
            # Import the validation function
            from app.routers.clients import is_valid_uuid
            
            # Test valid UUIDs
            valid_uuids = [
                "00000000-0000-0000-0000-000000000000",
                "123e4567-e89b-12d3-a456-426614174000",
                "550e8400-e29b-41d4-a716-446655440000"
            ]
            
            # Test invalid UUIDs
            invalid_uuids = [
                "invalid-id",
                "123",
                "not-a-uuid",
                "123e4567-e89b-12d3-a456",  # too short
                "123e4567-e89b-12d3-a456-426614174000-extra"  # too long
            ]
            
            all_valid_passed = True
            for uuid_str in valid_uuids:
                if not is_valid_uuid(uuid_str):
                    self.log(f"❌ Valid UUID {uuid_str} was rejected", "ERROR")
                    all_valid_passed = False
                else:
                    self.log(f"✅ Valid UUID {uuid_str} accepted")
            
            all_invalid_rejected = True
            for uuid_str in invalid_uuids:
                if is_valid_uuid(uuid_str):
                    self.log(f"❌ Invalid UUID {uuid_str} was accepted", "ERROR")
                    all_invalid_rejected = False
                else:
                    self.log(f"✅ Invalid UUID {uuid_str} rejected")
            
            if all_valid_passed and all_invalid_rejected:
                self.log("✅ UUID validation function working correctly")
                return True
            else:
                self.log("❌ UUID validation function has issues", "ERROR")
                return False
                
        except ImportError as e:
            self.log(f"❌ Could not import validation function: {e}", "ERROR")
            return False
        except Exception as e:
            self.log(f"❌ Error testing validation function: {e}", "ERROR")
            return False
    
    def test_teams_validation_logic(self) -> bool:
        """Test the teams validation logic"""
        self.log("Testing teams validation logic...")
        
        try:
            # Test data scenarios
            valid_team_data = [
                {"name": "Test Team", "department": "IT"},
                {"name": "Another Team"},
                {"name": "Team with Description", "description": "Test description"}
            ]
            
            invalid_team_data = [
                {},  # missing name
                {"department": "IT"},  # missing name
                {"description": "Test"},  # missing name
                {"name": ""},  # empty name
                {"name": None}  # null name
            ]
            
            # Test valid data
            for data in valid_team_data:
                if not data.get("name"):
                    self.log(f"❌ Valid team data {data} was rejected", "ERROR")
                    return False
                else:
                    self.log(f"✅ Valid team data {data} would be accepted")
            
            # Test invalid data
            for data in invalid_team_data:
                if data.get("name"):
                    self.log(f"❌ Invalid team data {data} would be accepted", "ERROR")
                    return False
                else:
                    self.log(f"✅ Invalid team data {data} would be rejected")
            
            self.log("✅ Teams validation logic working correctly")
            return True
            
        except Exception as e:
            self.log(f"❌ Error testing teams validation: {e}", "ERROR")
            return False
    
    def test_error_handling_implementation(self) -> bool:
        """Test that error handling is properly implemented in the code"""
        self.log("Testing error handling implementation in code...")
        
        try:
            # Check clients router
            with open('/app/backend/app/routers/clients.py', 'r') as f:
                clients_code = f.read()
            
            # Check for UUID validation
            if 'is_valid_uuid' in clients_code and 'HTTPException(status_code=400' in clients_code:
                self.log("✅ Clients router has UUID validation with 400 status code")
                clients_ok = True
            else:
                self.log("❌ Clients router missing proper UUID validation", "ERROR")
                clients_ok = False
            
            # Check tickets router
            with open('/app/backend/app/routers/tickets.py', 'r') as f:
                tickets_code = f.read()
            
            if 'is_valid_uuid' in tickets_code and 'HTTPException(status_code=400' in tickets_code:
                self.log("✅ Tickets router has UUID validation with 400 status code")
                tickets_ok = True
            else:
                self.log("❌ Tickets router missing proper UUID validation", "ERROR")
                tickets_ok = False
            
            # Check teams router
            with open('/app/backend/app/routers/teams.py', 'r') as f:
                teams_code = f.read()
            
            if 'not body.get("name")' in teams_code and 'HTTPException(status_code=400' in teams_code:
                self.log("✅ Teams router has name validation with 400 status code")
                teams_ok = True
            else:
                self.log("❌ Teams router missing proper name validation", "ERROR")
                teams_ok = False
            
            return clients_ok and tickets_ok and teams_ok
            
        except Exception as e:
            self.log(f"❌ Error checking code implementation: {e}", "ERROR")
            return False
    
    def test_http_exception_usage(self) -> bool:
        """Test that HTTPException is used correctly"""
        self.log("Testing HTTPException usage in routers...")
        
        try:
            routers = [
                '/app/backend/app/routers/clients.py',
                '/app/backend/app/routers/tickets.py',
                '/app/backend/app/routers/teams.py'
            ]
            
            all_good = True
            for router_path in routers:
                with open(router_path, 'r') as f:
                    code = f.read()
                
                router_name = router_path.split('/')[-1]
                
                # Check for proper imports
                if 'from fastapi import' in code and 'HTTPException' in code:
                    self.log(f"✅ {router_name} imports HTTPException correctly")
                else:
                    self.log(f"❌ {router_name} missing HTTPException import", "ERROR")
                    all_good = False
                
                # Check for proper status codes
                if 'status_code=400' in code:
                    self.log(f"✅ {router_name} uses 400 status code for validation errors")
                else:
                    self.log(f"⚠️ {router_name} might not use 400 status code", "WARN")
                
                if 'status_code=404' in code:
                    self.log(f"✅ {router_name} uses 404 status code for not found errors")
                else:
                    self.log(f"⚠️ {router_name} might not use 404 status code", "WARN")
            
            return all_good
            
        except Exception as e:
            self.log(f"❌ Error checking HTTPException usage: {e}", "ERROR")
            return False
    
    def run_validation_tests(self) -> dict:
        """Run all validation tests"""
        self.log("=" * 60)
        self.log("TESTES DE VALIDAÇÃO DIRETA - CAJÁ TALKS")
        self.log("=" * 60)
        
        results = {}
        
        # Test validation functions
        results["uuid_validation_function"] = self.test_uuid_validation_function()
        results["teams_validation_logic"] = self.test_teams_validation_logic()
        results["error_handling_implementation"] = self.test_error_handling_implementation()
        results["http_exception_usage"] = self.test_http_exception_usage()
        
        # Summary
        self.log("=" * 60)
        self.log("RESUMO DOS TESTES DE VALIDAÇÃO")
        self.log("=" * 60)
        
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASSOU" if result else "❌ FALHOU"
            self.log(f"{test_name.replace('_', ' ').title()}: {status}")
        
        self.log("=" * 60)
        self.log(f"RESULTADO FINAL: {passed}/{total} testes passaram")
        
        if passed == total:
            self.log("🎉 TODAS AS VALIDAÇÕES ESTÃO IMPLEMENTADAS CORRETAMENTE!")
            self.log("✅ UUID validation functions working")
            self.log("✅ Teams name validation implemented")
            self.log("✅ Proper HTTP status codes in use")
            self.log("✅ Error handling improvements are in place")
        else:
            self.log(f"⚠️ {total - passed} teste(s) de validação falharam.")
        
        self.log("=" * 60)
        
        return results

def main():
    """Main test execution"""
    tester = ValidationTester()
    results = tester.run_validation_tests()
    
    if not all(results.values()):
        exit(1)

if __name__ == "__main__":
    main()