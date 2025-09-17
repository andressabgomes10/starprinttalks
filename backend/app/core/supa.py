from supabase import create_client
from app.core.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
admin = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE or settings.SUPABASE_ANON_KEY)