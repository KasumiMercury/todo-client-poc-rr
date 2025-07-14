import type { components } from "~/api/task";
import { getAuthHeaders } from "./auth";

type TaskCreate = components["schemas"]["taskCreate"];
type Task = components["schemas"]["task"];

const API_BASE_URL = typeof window !== "undefined" 
  ? window.ENV?.API_BASE_URL || "http://localhost:8080"
  : process.env.API_BASE_URL || "http://localhost:8080";

export async function getAllTasks(): Promise<Task[]> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/tasks`, {
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
  
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.status}`);
  }

  return response.json();
}