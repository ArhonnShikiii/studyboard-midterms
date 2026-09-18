"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/lib/data";

export default function TaskItem({
  task,
  groupId,
  isOwner,
}: {
  task: Task;
  groupId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [done, setDone] = useState(task.done);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    if (!isOwner) return;

    const previousDone = done;
    const nextDone = !done;
    setDone(nextDone);
    setError("");

    const response = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: nextDone }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setDone(previousDone);
      setError(data?.error || "Failed to update task");
    }
  }

  async function handleDelete() {
    if (!isOwner) return;

    setIsDeleting(true);
    setError("");

    const response = await fetch(`/api/groups/${groupId}/tasks/${task.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setIsDeleting(false);
      setError(data?.error || "Failed to delete task");
      return;
    }

    router.refresh();
  }

  return (
    <li className="flex items-center gap-3 rounded-md border px-3 py-2">
      <input
        type="checkbox"
        checked={done}
        onChange={handleToggle}
        disabled={!isOwner || isDeleting}
        className="h-4 w-4"
      />
      <span className={done ? "line-through text-gray-400" : ""}>
        {task.title}
      </span>
      {isOwner && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-auto text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </li>
  );
}