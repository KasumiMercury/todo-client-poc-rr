import type {components, operations, paths} from "~/api/task";
import {getAuthHeaders} from "./auth";

type Task = components["schemas"]["task"];
type TaskCreate = components["schemas"]["taskCreate"];
type ApiError = components["schemas"]["error"];

type GetAllTasksResponse = operations["task.getAllTasks"]["responses"]["200"]["content"]["application/json"];
type CreateTaskRequest = operations["task.createTask"]["requestBody"]["content"]["application/json"];
type CreateTaskResponse = operations["task.createTask"]["responses"]["201"]["content"]["application/json"];

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

export async function getAllTasks(): Promise<GetAllTasksResponse> {
  const response = await apiRequest("/tasks");

  if (!response.ok) {
    const errorMessage = await handleErrorResponse(response, "Fetch tasks");
    console.error("Error fetching tasks:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function createTask(taskData: CreateTaskRequest): Promise<CreateTaskResponse> {
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