import type { Route } from "./+types/tasks";
import type { components } from "~/api/task";
import { Tasks } from "~/tasks/tasks";
import { getAllTasks } from "~/utils/api";

type Task = components["schemas"]["task"];

export async function clientLoader(): Promise<{ tasks: Task[] }> {
  const tasks = await getAllTasks();
  return { tasks };
}

export default function TasksRoute({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;
  return <Tasks tasks={tasks} />;
}