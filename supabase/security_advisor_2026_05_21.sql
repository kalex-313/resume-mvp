-- Fix Supabase Security Advisor warnings:
-- - Public Can Execute SECURITY DEFINER Function
-- - Signed-In Users Can Execute SECURITY DEFINER Function
--
-- The function is used by the auth.users trigger only. It should not be
-- directly executable through the Data API by anon or authenticated users.

revoke execute on function public.handle_new_user_profile() from public;
revoke execute on function public.handle_new_user_profile() from anon;
revoke execute on function public.handle_new_user_profile() from authenticated;

