"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function NewTaskForm({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    setError("");
    setIsSubmitting(true);

    const response = await fetch(`/api/groups/${groupId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: trimmed }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "An error occurred");
      setIsSubmitting(false);
      return;
    }

    setTitle("");
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Task Name
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isSubmitting || !title.trim()}>
        Add Task
      </Button>
    </form>
  );
}