import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

type Todo = Tables<'todos'>;
type TodoInsert = TablesInsert<'todos'>;
type TodoUpdate = TablesUpdate<'todos'>;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        description: 'Failed to load todos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData: { text: string }) => {
    try {
      const maxPosition = Math.max(...todos.map(t => t.position || 0), -1);

      const { data, error } = await supabase
        .from('todos')
        .insert({
          text: todoData.text,
          user_id: null, // No authentication required
          position: maxPosition + 1,
          done: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      setTodos(prev => [...prev, data]);
      toast({
        description: 'Todo added successfully',
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        description: 'Failed to add todo',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateTodo = async (id: string, updates: TodoUpdate) => {
    try {
      // Optimistic update
      setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, ...updates } : todo));

      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update with actual data from server
      setTodos(prev => prev.map(todo => todo.id === id ? data : todo));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating todo:', error);
      // Revert optimistic update on error
      await fetchTodos();
      toast({
        description: 'Failed to update todo',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // Optimistic update
      setTodos(prev => prev.filter(todo => todo.id !== id));

      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        description: 'Todo removed',
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Revert optimistic update on error
      await fetchTodos();
      toast({
        description: 'Failed to delete todo',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    return updateTodo(id, { done: !todo.done });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos,
  };
};