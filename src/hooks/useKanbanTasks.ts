import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

type KanbanTask = Tables<'kanban_tasks'>;
type KanbanTaskInsert = TablesInsert<'kanban_tasks'>;
type KanbanTaskUpdate = TablesUpdate<'kanban_tasks'>;

export const useKanbanTasks = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching kanban tasks:', error);
      toast({
        description: 'Failed to load kanban tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: { text: string; column?: string }) => {
    try {
      const column = taskData.column || 'backlog';
      const maxPosition = Math.max(
        ...tasks.filter(t => t.column === column).map(t => t.position || 0), 
        -1
      );

      const { data, error } = await supabase
        .from('kanban_tasks')
        .insert({
          text: taskData.text,
          column,
          user_id: null, // No authentication required
          position: maxPosition + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [...prev, data]);
      toast({
        description: 'Task added successfully',
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding kanban task:', error);
      toast({
        description: 'Failed to add task',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateTask = async (id: string, updates: KanbanTaskUpdate) => {
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating kanban task:', error);
      toast({
        description: 'Failed to update task',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        description: 'Task removed',
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting kanban task:', error);
      toast({
        description: 'Failed to delete task',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const moveTask = async (id: string, newColumn: string, newPosition: number) => {
    try {
      // Update the task's column and position
      await updateTask(id, { column: newColumn, position: newPosition });
      
      // Reorder other tasks in the affected columns
      await reorderTasks();
      
      return { error: null };
    } catch (error) {
      console.error('Error moving kanban task:', error);
      return { error };
    }
  };

  const reorderTasks = async () => {
    // This would typically be handled by the drag-and-drop logic
    // For now, we'll refetch to ensure consistency
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    refetch: fetchTasks,
  };
};