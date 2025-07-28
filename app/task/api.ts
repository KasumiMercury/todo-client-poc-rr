import type {components, operations, paths} from "~/api/task";
import {getAuthHeaders} from "~/utils/auth";

type Task = components["schemas"]["task"];
type TaskCreate = components["schemas"]["taskCreate"];
type TaskUpdate = components["schemas"]["taskUpdate"];
type HealthStatus = components["schemas"]["healthStatus"];
type ApiError = components["schemas"]["error"];

const API_BASE_URL = "http://localhost:8080";

async function apiRequest<T extends keyof paths>(
  endpoint: T,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

async function handleErrorResponse(response: Response, operation: string): Promise<string> {
  try {
    const errorData: ApiError = await response.json();
    return errorData.message || `${operation} failed: ${response.status} ${response.statusText}`;
  } catch {
    return `${operation} failed: ${response.status} ${response.statusText}`;
  }
}

export async function getAllTasks(): Promise<Task[]> {
  const response = await apiRequest("/tasks");

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Fetch tasks");
    console.error("Error fetching tasks:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function createTask(taskData: TaskCreate): Promise<Task> {
  const response = await apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Create task");
    console.error("Error creating task:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getTask(taskId: string): Promise<Task> {
  const response = await apiRequest(`/tasks/${taskId}` as keyof paths);

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Get task");
    console.error("Error getting task:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateTask(taskId: string, taskData: TaskUpdate): Promise<Task> {
  const response = await apiRequest(`/tasks/${taskId}` as keyof paths, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Update task");
    console.error("Error updating task:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await apiRequest(`/tasks/${taskId}` as keyof paths, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Delete task");
    console.error("Error deleting task:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getHealth(): Promise<HealthStatus> {
  const response = await apiRequest("/health");

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Get health");
    console.error("Error getting health status:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}