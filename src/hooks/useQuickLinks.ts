import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

type QuickLink = Tables<'quick_links'>;
type QuickLinkInsert = TablesInsert<'quick_links'>;
type QuickLinkUpdate = TablesUpdate<'quick_links'>;

export const useQuickLinks = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching quick links:', error);
      toast({
        description: 'Failed to load quick links',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (linkData: Omit<QuickLinkInsert, 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const maxPosition = Math.max(...links.map(l => l.position || 0), -1);

      const { data, error } = await supabase
        .from('quick_links')
        .insert({
          ...linkData,
          user_id: user.id,
          position: maxPosition + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      setLinks(prev => [...prev, data]);
      toast({
        description: 'Quick link added successfully',
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding quick link:', error);
      toast({
        description: 'Failed to add quick link',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateLink = async (id: string, updates: QuickLinkUpdate) => {
    try {
      const { data, error } = await supabase
        .from('quick_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setLinks(prev => prev.map(link => link.id === id ? data : link));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating quick link:', error);
      toast({
        description: 'Failed to update quick link',
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLinks(prev => prev.filter(link => link.id !== id));
      toast({
        description: 'Quick link removed',
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting quick link:', error);
      toast({
        description: 'Failed to delete quick link',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const togglePin = async (id: string) => {
    const link = links.find(l => l.id === id);
    if (!link) return;

    // Toggle pinned status - note: no 'pinned' column in schema, using position for ordering
    return updateLink(id, { position: link.position === 0 ? 999 : 0 });
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    togglePin,
    refetch: fetchLinks,
  };
};