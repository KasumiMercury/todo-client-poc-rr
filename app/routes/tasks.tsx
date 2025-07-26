import type { Route } from "./+types/tasks";
import type { operations } from "~/api/task";
import { Tasks } from "~/tasks/tasks";
import { getAllTasks } from "~/utils/api";

type GetAllTasksResponse = operations["task.getAllTasks"]["responses"]["200"]["content"]["application/json"];

export async function clientLoader(): Promise<{ tasks: GetAllTasksResponse; error?: string }> {
  try {
    const tasks = await getAllTasks();
    return { tasks };
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return { 
      tasks: [], 
      error: error instanceof Error ? error.message : "Failed to load tasks" 
    };
  }
}

export default function TasksRoute({ loaderData }: Route.ComponentProps) {
  const { tasks, error } = loaderData;
  return <Tasks tasks={tasks} error={error} />;
}