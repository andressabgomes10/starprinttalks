from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase.lib.client_options import ClientOptions
from supabase import create_client
from app.core.config import settings

bearer = HTTPBearer(auto_error=True)

def get_current_user(token: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        # valida token consultando o auth do Supabase
        supa = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
            options=ClientOptions(auto_refresh_token=False),
        )
        user = supa.auth.get_user(token.credentials)
        if not user or not user.user:
            raise Exception("invalid")
        return user.user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")