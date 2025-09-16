-- The countdowns table already has policies but RLS is not enabled, so enable it
ALTER TABLE public.countdowns ENABLE ROW LEVEL SECURITY;