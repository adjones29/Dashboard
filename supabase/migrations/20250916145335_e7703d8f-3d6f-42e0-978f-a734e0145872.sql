-- Disable Row Level Security on all tables
ALTER TABLE public.routines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.countdowns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can create their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can update their own routines" ON public.routines;
DROP POLICY IF EXISTS "Users can delete their own routines" ON public.routines;

DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.countdowns;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.countdowns;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.countdowns;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.countdowns;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.okr_goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.okr_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.okr_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.okr_goals;

DROP POLICY IF EXISTS "Users can view their own quick_links" ON public.quick_links;
DROP POLICY IF EXISTS "Users can create their own quick_links" ON public.quick_links;
DROP POLICY IF EXISTS "Users can update their own quick_links" ON public.quick_links;
DROP POLICY IF EXISTS "Users can delete their own quick_links" ON public.quick_links;

DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can create their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;

DROP POLICY IF EXISTS "Users can view their own kanban_tasks" ON public.kanban_tasks;
DROP POLICY IF EXISTS "Users can create their own kanban_tasks" ON public.kanban_tasks;
DROP POLICY IF EXISTS "Users can update their own kanban_tasks" ON public.kanban_tasks;
DROP POLICY IF EXISTS "Users can delete their own kanban_tasks" ON public.kanban_tasks;

DROP POLICY IF EXISTS "Users can view their own okr_items" ON public.okr_items;
DROP POLICY IF EXISTS "Users can create their own okr_items" ON public.okr_items;
DROP POLICY IF EXISTS "Users can update their own okr_items" ON public.okr_items;
DROP POLICY IF EXISTS "Users can delete their own okr_items" ON public.okr_items;