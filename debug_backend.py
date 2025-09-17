#!/usr/bin/env python3
"""
Debug script to check backend issues
"""

import requests
import json
from datetime import datetime

def debug_supabase_connection():
    """Debug Supabase connection and tables"""
    print("=" * 60)
    print("DEBUGGING SUPABASE CONNECTION")
    print("=" * 60)
    
    try:
        from app.core.supa import supabase
        print("✅ Supabase client imported successfully")
        
        # Test basic connection
        try:
            # Try to list tables or get basic info
            result = supabase.table("clients").select("*").limit(1).execute()
            print(f"✅ Supabase connection working - clients table accessible")
            print(f"   Data: {result.data}")
        except Exception as e:
            print(f"❌ Supabase clients table error: {e}")
            
        try:
            result = supabase.table("tickets").select("*").limit(1).execute()
            print(f"✅ Supabase tickets table accessible")
            print(f"   Data: {result.data}")
        except Exception as e:
            print(f"❌ Supabase tickets table error: {e}")
            
        try:
            result = supabase.table("teams").select("*").limit(1).execute()
            print(f"✅ Supabase teams table accessible")
            print(f"   Data: {result.data}")
        except Exception as e:
            print(f"❌ Supabase teams table error: {e}")
            
    except Exception as e:
        print(f"❌ Failed to import Supabase client: {e}")

def debug_post_request():
    """Debug POST request to see detailed error"""
    print("\n" + "=" * 60)
    print("DEBUGGING POST REQUEST")
    print("=" * 60)
    
    # First get auth token
    try:
        login_data = {
            "email": "teste_12345678@cajatalks.com",
            "password": "MinhaSenh@123"
        }
        
        response = requests.post("http://0.0.0.0:8001/api/auth/register", json=login_data)
        print(f"Register response: {response.status_code} - {response.text}")
        
        response = requests.post("http://0.0.0.0:8001/api/auth/login", json=login_data)
        print(f"Login response: {response.status_code} - {response.text}")
        
        if response.status_code == 200:
            auth_data = response.json()
            token = auth_data.get("data", {}).get("access_token")
            
            if token:
                print(f"✅ Got auth token: {token[:20]}...")
                
                # Now try POST to clients
                headers = {"Authorization": f"Bearer {token}"}
                client_data = {
                    "name": "Test Client",
                    "document": "12345678901",
                    "email": "test@test.com",
                    "phone": "11999999999"
                }
                
                response = requests.post("http://0.0.0.0:8001/api/clients", json=client_data, headers=headers)
                print(f"Client creation response: {response.status_code}")
                print(f"Response headers: {dict(response.headers)}")
                print(f"Response text: {response.text}")
                
                # Try teams
                team_data = {
                    "name": "Test Team",
                    "description": "Test team description"
                }
                
                response = requests.post("http://0.0.0.0:8001/api/teams", json=team_data, headers=headers)
                print(f"Team creation response: {response.status_code}")
                print(f"Response text: {response.text}")
                
            else:
                print("❌ No auth token received")
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during POST debug: {e}")

if __name__ == "__main__":
    debug_supabase_connection()
    debug_post_request()