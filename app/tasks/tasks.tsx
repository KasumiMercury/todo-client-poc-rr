import type { components } from "../api/task";

type Task = components["schemas"]["task"];

interface TasksProps {
  tasks: Task[];
}

export function Tasks({ tasks }: TasksProps) {
  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Task List</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tasks found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task List</h1>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {task.name || 'Unnamed Task'}
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
      </div>
    </div>
  );
}