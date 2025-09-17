#!/usr/bin/env python3
"""
Script para verificar se o Supabase está configurado corretamente
Execute: python3 verify_supabase_setup.py
"""

import requests
import json

# Configuração do Supabase
SUPABASE_URL = "https://pzxqinijxqmiyvgkmohf.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eHFpbmlqeHFtaXl2Z2ttb2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAzMzksImV4cCI6MjA3MzY5NjMzOX0.OHRDtdreeMJAzs3MD8smQ3hbmtnOcBPSJWfngDnjmx4"

def verify_supabase_setup():
    print("🔍 Verificando configuração do Supabase...")
    print(f"📡 URL: {SUPABASE_URL}")
    print(f"🔑 Anon Key: {SUPABASE_ANON_KEY[:30]}...")
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    # Lista de tabelas para verificar
    tables = [
        {'name': 'users', 'description': 'Usuários do sistema'},
        {'name': 'clients', 'description': 'Clientes'},
        {'name': 'tickets', 'description': 'Tickets de suporte'},
        {'name': 'conversations', 'description': 'Conversas/Mensagens'},
        {'name': 'notifications', 'description': 'Notificações'}
    ]
    
    all_tables_ok = True
    
    print("\n📊 Verificando tabelas...")
    for table in tables:
        try:
            response = requests.get(f"{SUPABASE_URL}/rest/v1/{table['name']}?select=count", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                print(f"✅ {table['name']}: OK ({count} registros) - {table['description']}")
            else:
                print(f"❌ {table['name']}: Erro {response.status_code} - {table['description']}")
                all_tables_ok = False
                
        except Exception as e:
            print(f"❌ {table['name']}: Erro - {e} - {table['description']}")
            all_tables_ok = False
    
    # Testar inserção de dados
    print("\n🧪 Testando inserção de dados...")
    try:
        test_client = {
            "name": "Teste Verificação",
            "email": "teste-verificacao@exemplo.com",
            "company": "Empresa Teste",
            "status": "active"
        }
        
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/clients",
            headers=headers,
            data=json.dumps(test_client)
        )
        
        if response.status_code == 201:
            print("✅ Inserção de dados funcionando!")
            data = response.json()
            print(f"📊 Cliente de teste inserido: {data[0]['name'] if data else 'N/A'}")
            
            # Limpar dados de teste
            if data and len(data) > 0:
                client_id = data[0]['id']
                delete_response = requests.delete(
                    f"{SUPABASE_URL}/rest/v1/clients?id=eq.{client_id}",
                    headers=headers
                )
                if delete_response.status_code == 204:
                    print("🧹 Dados de teste removidos")
        else:
            print(f"❌ Erro na inserção: {response.status_code}")
            print(f"Resposta: {response.text}")
            all_tables_ok = False
            
    except Exception as e:
        print(f"❌ Erro ao testar inserção: {e}")
        all_tables_ok = False
    
    # Resumo final
    print("\n" + "="*50)
    if all_tables_ok:
        print("🎉 SUCESSO! Supabase configurado corretamente!")
        print("✅ Todas as tabelas estão funcionando")
        print("✅ Inserção de dados funcionando")
        print("✅ Sistema pronto para uso!")
    else:
        print("❌ FALHA! Supabase não está configurado corretamente")
        print("⚠️ Execute o SQL no dashboard do Supabase primeiro")
        print("📋 Abra o arquivo: EXECUTAR_SCHEMA_SUPABASE.html")
    
    print("="*50)

if __name__ == "__main__":
    verify_supabase_setup()
