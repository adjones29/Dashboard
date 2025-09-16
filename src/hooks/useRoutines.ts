import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

type Routine = Tables<'routines'>;
type RoutineInsert = TablesInsert<'routines'>;
type RoutineUpdate = TablesUpdate<'routines'>;

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoutines = async () => {
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setRoutines(data || []);
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast({
        description: 'Failed to load routines',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addRoutine = async (routineData: { text: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const maxPosition = Math.max(...routines.map(r => r.position || 0), -1);

      const { data, error } = await supabase
        .from('routines')
        .insert({
          text: routineData.text,
          user_id: user.id,
          position: maxPosition + 1,
          done: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      setRoutines(prev => [...prev, data]);
      toast({
        description: 'Routine added successfully',
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding routine:', error);
      toast({
        description: 'Failed to add routine',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateRoutine = async (id: string, updates: RoutineUpdate) => {
    try {
      // Optimistic update
      setRoutines(prev => prev.map(routine => routine.id === id ? { ...routine, ...updates } : routine));

      const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update with actual data from server
      setRoutines(prev => prev.map(routine => routine.id === id ? data : routine));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating routine:', error);
      // Revert optimistic update on error
      await fetchRoutines();
      toast({
        description: 'Failed to update routine',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRoutines(prev => prev.filter(routine => routine.id !== id));
      toast({
        description: 'Routine removed',
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast({
        description: 'Failed to delete routine',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const toggleRoutine = async (id: string) => {
    const routine = routines.find(r => r.id === id);
    if (!routine) return;

    return updateRoutine(id, { done: !routine.done });
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  return {
    routines,
    loading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutine,
    refetch: fetchRoutines,
  };
};