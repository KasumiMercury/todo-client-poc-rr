import type { Route } from "./+types/tasks";
import type { components } from "~/api/task";
import { Tasks } from "~/tasks/tasks";

type Task = components["schemas"]["task"];

export async function clientLoader(): Promise<{ tasks: Task[] }> {
  try {
    const response = await fetch("http://localhost:8080/tasks", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const tasks: Task[] = await response.json();
    return { tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { tasks: [] };
  }
}

export default function TasksRoute({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;
  return <Tasks tasks={tasks} />;
}