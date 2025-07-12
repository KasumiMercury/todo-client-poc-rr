import type { components } from "~/api/task";
import { getAuthHeaders } from "./auth";

type TaskCreate = components["schemas"]["taskCreate"];
type Task = components["schemas"]["task"];

export async function getAllTasks(): Promise<Task[]> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch("http://localhost:8080/tasks", {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function createTask(taskData: TaskCreate): Promise<Task> {
  const headers = await getAuthHeaders();
  
  const response = await fetch("http://localhost:8080/tasks", {
    method: "POST",
    headers,
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.status}`);
  }

  return response.json();
}