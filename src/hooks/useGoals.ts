import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

type Goal = Tables<'okr_goals'>;
type GoalItem = Tables<'okr_items'>;
type GoalInsert = TablesInsert<'okr_goals'>;
type GoalItemInsert = TablesInsert<'okr_items'>;

export interface GoalWithItems extends Goal {
  items: GoalItem[];
  progress: number;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<GoalWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      const { data: goalsData, error: goalsError } = await supabase
        .from('okr_goals')
        .select('*')
        .order('position', { ascending: true });

      if (goalsError) throw goalsError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('okr_items')
        .select('*')
        .order('position', { ascending: true });

      if (itemsError) throw itemsError;

      // Combine goals with their items and calculate progress
      const goalsWithItems = (goalsData || []).map(goal => {
        const items = (itemsData || []).filter(item => item.goal_id === goal.id);
        // Note: 'done' field doesn't exist in okr_items schema, so using text completion as indicator
        const completedItems = items.filter(item => item.text?.includes('✓') || item.text?.includes('[x]'));
        const progress = items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0;
        
        return {
          ...goal,
          items,
          progress,
        };
      });

      setGoals(goalsWithItems);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        description: 'Failed to load goals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData: { title: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const maxPosition = Math.max(...goals.map(g => g.position || 0), -1);

      const { data, error } = await supabase
        .from('okr_goals')
        .insert({
          title: goalData.title,
          user_id: user.id,
          position: maxPosition + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newGoal: GoalWithItems = {
        ...data,
        items: [],
        progress: 0,
      };
      
      setGoals(prev => [...prev, newGoal]);
      toast({
        description: 'Goal added successfully',
      });
      return { data: newGoal, error: null };
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        description: 'Failed to add goal',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const addGoalItem = async (goalId: string, text: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const maxPosition = Math.max(...goal.items.map(i => i.position || 0), -1);

      const { data, error } = await supabase
        .from('okr_items')
        .insert({
          goal_id: goalId,
          text,
          user_id: user.id,
          position: maxPosition + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update the goal with the new item
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          const newItems = [...g.items, data];
          const completedItems = newItems.filter(item => item.text?.includes('✓') || item.text?.includes('[x]'));
          const progress = newItems.length > 0 ? Math.round((completedItems.length / newItems.length) * 100) : 0;
          
          return {
            ...g,
            items: newItems,
            progress,
          };
        }
        return g;
      }));
      
      toast({
        description: 'Goal item added successfully',
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding goal item:', error);
      toast({
        description: 'Failed to add goal item',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const toggleGoalItem = async (itemId: string) => {
    try {
      const goalWithItem = goals.find(g => g.items.some(i => i.id === itemId));
      if (!goalWithItem) throw new Error('Goal item not found');

      const item = goalWithItem.items.find(i => i.id === itemId);
      if (!item) throw new Error('Item not found');

      // Toggle completion by adding/removing checkmark
      const isCompleted = item.text?.includes('✓') || item.text?.includes('[x]');
      const newText = isCompleted 
        ? item.text?.replace(/\s*[✓\[x\]]\s*/, '') || ''
        : `✓ ${item.text || ''}`;

      const { data, error } = await supabase
        .from('okr_items')
        .update({ text: newText })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      
      // Update the goal with the updated item and recalculate progress
      setGoals(prev => prev.map(g => {
        if (g.id === goalWithItem.id) {
          const newItems = g.items.map(i => i.id === itemId ? data : i);
          const completedItems = newItems.filter(item => item.text?.includes('✓') || item.text?.includes('[x]'));
          const progress = newItems.length > 0 ? Math.round((completedItems.length / newItems.length) * 100) : 0;
          
          return {
            ...g,
            items: newItems,
            progress,
          };
        }
        return g;
      }));
      
      return { data, error: null };
    } catch (error) {
      console.error('Error toggling goal item:', error);
      toast({
        description: 'Failed to update goal item',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    addGoal,
    addGoalItem,
    toggleGoalItem,
    refetch: fetchGoals,
  };
};