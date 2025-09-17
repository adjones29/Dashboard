import { supabase } from "@/integrations/supabase/client";

// QUICK LINKS
export async function listQuickLinks() {
  return supabase.from("quick_links")
    .select("*").order("position", { ascending: true })
    .order("updated_at", { ascending: false });
}
export async function createQuickLink(row: any) { 
  return supabase.from("quick_links").insert(row).select(); 
}
export async function updateQuickLink(id: string, patch: any) { 
  return supabase.from("quick_links").update(patch).eq("id", id).select(); 
}
export async function deleteQuickLink(id: string) { 
  return supabase.from("quick_links").delete().eq("id", id); 
}

// GOALS (OKR)
export async function listGoals() { 
  return supabase.from("okr_goals").select("*").order("position", { ascending: true }); 
}
export async function listGoalItems(goal_id: string) { 
  return supabase.from("okr_items").select("*").eq("goal_id", goal_id).order("position", { ascending: true }); 
}
export async function createGoal(goal: any) { 
  return supabase.from("okr_goals").insert(goal).select(); 
}
export async function updateGoal(id: string, patch: any) { 
  return supabase.from("okr_goals").update(patch).eq("id", id).select(); 
}
export async function createGoalItem(item: any) { 
  return supabase.from("okr_items").insert(item).select(); 
}
export async function updateGoalItem(id: string, patch: any) { 
  return supabase.from("okr_items").update(patch).eq("id", id).select(); 
}
export async function deleteGoal(id: string) { 
  return supabase.from("okr_goals").delete().eq("id", id); 
}
export async function deleteGoalItem(id: string) { 
  return supabase.from("okr_items").delete().eq("id", id); 
}

// TO-DO
export async function listTodos() { 
  return supabase.from("todos").select("*").order("position", { ascending: true }); 
}
export async function createTodo(todo: any) { 
  return supabase.from("todos").insert(todo).select(); 
}
export async function updateTodo(id: string, patch: any) { 
  return supabase.from("todos").update(patch).eq("id", id).select(); 
}
export async function deleteTodo(id: string) { 
  return supabase.from("todos").delete().eq("id", id); 
}

// KANBAN
export const KANBAN_STATUSES = ['Backlog', 'Open', 'Working', 'With Team', 'Done'] as const;
export type KanbanStatus = typeof KANBAN_STATUSES[number];

export const STATUS_INDEX: Record<KanbanStatus, number> = {
  'Backlog': 0, 'Open': 1, 'Working': 2, 'With Team': 3, 'Done': 4
};

export async function listKanbanTasks() {
  const { data, error } = await supabase
    .from('kanban_tasks')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;

  // Bucket by status with fixed order, and sort each bucket by position asc
  const buckets: Record<KanbanStatus, any[]> = {
    'Backlog': [], 'Open': [], 'Working': [], 'With Team': [], 'Done': []
  };
  
  for (const row of (data || [])) {
    const originalStatus = row.column ?? 'Backlog';
    let status: KanbanStatus;
    
    // Handle exact matches first
    if (KANBAN_STATUSES.includes(originalStatus as KanbanStatus)) {
      status = originalStatus as KanbanStatus;
    } else {
      // Back-compat mapping for old status values
      if (originalStatus === 'backlog' || originalStatus === 'todo') {
        status = 'Backlog';
      } else if (originalStatus === 'doing' || originalStatus === 'working') {
        status = 'Working';
      } else if (originalStatus === 'done') {
        status = 'Done';
      } else {
        status = 'Backlog'; // fallback
      }
    }
    
    buckets[status].push({...row, column: status});
  }
  
  // Sort each bucket by position
  for (const k of KANBAN_STATUSES) {
    buckets[k].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }
  
  return { data: buckets, error: null };
}

export async function createKanbanTask(task: any) {
  const row = { column: 'Backlog', position: 0, ...task };
  return supabase.from("kanban_tasks").insert(row).select(); 
}

export async function updateKanbanTask(id: string, patch: any) { 
  return supabase.from("kanban_tasks").update(patch).eq("id", id).select(); 
}

export async function deleteKanbanTask(id: string) { 
  return supabase.from("kanban_tasks").delete().eq("id", id); 
}

export async function moveKanbanTask({
  id,
  toStatus,
  idsInTarget
}: {
  id: string;
  toStatus: KanbanStatus;
  idsInTarget: string[];
}) {
  // 1) Move the card to the new status
  const { error: moveErr } = await supabase
    .from('kanban_tasks')
    .update({ column: toStatus, position: 0 })
    .eq('id', id);
  if (moveErr) throw moveErr;

  // 2) Reindex every card in the target column according to idsInTarget
  const updates = idsInTarget.map((cardId, idx) =>
    supabase.from('kanban_tasks').update({ position: idx }).eq('id', cardId)
  );
  const results = await Promise.all(updates);
  const failed = results.find(r => (r as any)?.error);
  if (failed) throw (failed as any).error;

  return { ok: true };
}

// ROUTINES (Dashboard Daily Routine)
export async function listRoutines() { 
  return supabase.from("routines").select("*").order("position", { ascending: true }); 
}
export async function createRoutine(routine: any) { 
  return supabase.from("routines").insert(routine).select(); 
}
export async function updateRoutine(id: string, patch: any) { 
  return supabase.from("routines").update(patch).eq("id", id).select(); 
}
export async function deleteRoutine(id: string) { 
  return supabase.from("routines").delete().eq("id", id); 
}

// COUNTDOWNS
export async function listCountdowns() { 
  return supabase.from("countdowns").select("*").order("date", { ascending: true }); 
}
export async function createCountdown(countdown: any) { 
  return supabase.from("countdowns").insert(countdown).select(); 
}
export async function updateCountdown(id: string, patch: any) { 
  return supabase.from("countdowns").update(patch).eq("id", id).select(); 
}
export async function deleteCountdown(id: string) { 
  return supabase.from("countdowns").delete().eq("id", id); 
}

// NOTES (local only)
export const getNotes = () => localStorage.getItem("scratchpad_notes") || "";
export const saveNotes = (v: string) => localStorage.setItem("scratchpad_notes", v);