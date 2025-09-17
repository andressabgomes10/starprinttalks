#!/usr/bin/env python3
"""
Debug ticket creation specifically
"""

import requests
import json
import uuid

def test_ticket_creation():
    print("Testing ticket creation specifically...")
    
    # Register and login
    test_email = f"ticket_test_{uuid.uuid4().hex[:8]}@cajatalks.com"
    test_password = "MinhaSenh@123"
    
    # Register
    register_data = {"email": test_email, "password": test_password}
    response = requests.post("http://0.0.0.0:8001/api/auth/register", json=register_data)
    print(f"Register: {response.status_code} - {response.text}")
    
    # Login
    response = requests.post("http://0.0.0.0:8001/api/auth/login", json=register_data)
    print(f"Login: {response.status_code} - {response.text}")
    
    if response.status_code != 200:
        print("❌ Login failed")
        return
        
    auth_data = response.json()
    token = auth_data.get("data", {}).get("access_token")
    
    if not token:
        print("❌ No token received")
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a client first
    client_data = {
        "name": "Test Client for Ticket",
        "email": "client@test.com",
        "phone": "11999999999",
        "company": "Test Company"
    }
    
    response = requests.post("http://0.0.0.0:8001/api/clients", json=client_data, headers=headers)
    print(f"Client creation: {response.status_code} - {response.text}")
    
    if response.status_code != 200:
        print("❌ Client creation failed")
        return
        
    client_info = response.json()
    client_id = client_info.get("data", {}).get("id")
    
    if not client_id:
        print("❌ No client ID received")
        return
        
    print(f"✅ Client created with ID: {client_id}")
    
    # Now create ticket
    ticket_data = {
        "title": "Test Ticket",
        "description": "This is a test ticket",
        "status": "open",
        "priority": "medium",
        "client_id": client_id
    }
    
    print(f"Sending ticket data: {json.dumps(ticket_data, indent=2)}")
    
    response = requests.post("http://0.0.0.0:8001/api/tickets", json=ticket_data, headers=headers)
    print(f"Ticket creation: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print(f"Response text: {response.text}")
    
    if response.status_code == 200:
        print("✅ Ticket creation successful!")
    else:
        print("❌ Ticket creation failed")

if __name__ == "__main__":
    test_ticket_creation()