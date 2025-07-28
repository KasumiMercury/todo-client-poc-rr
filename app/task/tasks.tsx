import {useState} from "react";
import type {components, operations} from "../api/task";
import {createTask} from "~/task/api";

type Task = components["schemas"]["task"];
type CreateTaskRequest = operations["task.createTask"]["requestBody"]["content"]["application/json"];
type GetAllTasksResponse = operations["task.getAllTasks"]["responses"]["200"]["content"]["application/json"];

interface TasksProps {
  tasks: GetAllTasksResponse;
  error?: string;
}

export function Tasks({tasks: initialTasks, error}: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [taskName, setTaskName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const taskData: CreateTaskRequest = { title: taskName.trim() };
      const newTask = await createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setTaskName("");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Task List</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-red-700">
                  <h3 className="font-medium">Error loading tasks</h3>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex gap-4">
              <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Input task name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isSubmitting}
              />
              <button
                  type="submit"
                  disabled={!taskName.trim() || isSubmitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>

          {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tasks found</p>
              </div>
          ) : (
              <>
                <div className="space-y-4">
                  {tasks.map((task) => (
                      <div
                          key={task.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {task.title || 'Unnamed Task'}
                          </h2>
                          <span className="text-sm text-gray-500 font-mono">
                      ID: {task.id || 'N/A'}
                    </span>
                        </div>
                      </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-gray-500">
                    Total tasks: {tasks.length}
                  </p>
                </div>
              </>
          )}
        </div>
      </div>
  );
}