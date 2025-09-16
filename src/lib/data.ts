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
export async function listKanbanTasks() {
  return supabase.from("kanban_tasks")
    .select("*")
    .order("position", { ascending: true });
}
export async function createKanbanTask(task: any) { 
  return supabase.from("kanban_tasks").insert(task).select(); 
}
export async function updateKanbanTask(id: string, patch: any) { 
  return supabase.from("kanban_tasks").update(patch).eq("id", id).select(); 
}
export async function deleteKanbanTask(id: string) { 
  return supabase.from("kanban_tasks").delete().eq("id", id); 
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