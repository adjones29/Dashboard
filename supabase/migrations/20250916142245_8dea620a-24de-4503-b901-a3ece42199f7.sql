-- Enable Row Level Security on all tables
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for routines table
CREATE POLICY "Users can view their own routines" 
ON public.routines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routines" 
ON public.routines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines" 
ON public.routines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines" 
ON public.routines 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for okr_goals table
CREATE POLICY "Users can view their own goals" 
ON public.okr_goals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
ON public.okr_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.okr_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.okr_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for quick_links table
CREATE POLICY "Users can view their own quick_links" 
ON public.quick_links 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quick_links" 
ON public.quick_links 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quick_links" 
ON public.quick_links 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quick_links" 
ON public.quick_links 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for todos table
CREATE POLICY "Users can view their own todos" 
ON public.todos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own todos" 
ON public.todos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON public.todos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON public.todos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for kanban_tasks table
CREATE POLICY "Users can view their own kanban_tasks" 
ON public.kanban_tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own kanban_tasks" 
ON public.kanban_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kanban_tasks" 
ON public.kanban_tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kanban_tasks" 
ON public.kanban_tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for okr_items table
CREATE POLICY "Users can view their own okr_items" 
ON public.okr_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own okr_items" 
ON public.okr_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own okr_items" 
ON public.okr_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own okr_items" 
ON public.okr_items 
FOR DELETE 
USING (auth.uid() = user_id);