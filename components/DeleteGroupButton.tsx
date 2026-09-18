"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm("Are you sure you want to delete this group?");
        if (!confirmed) return;

        setIsDeleting(true);
        setError("");

        const response = await fetch(`/api/groups/${groupId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            setIsDeleting(false);
            setError(data?.error || "Failed to delete group");
            return;
        }

        router.push("/groups");
        router.refresh();
    }

    return (
        <div>
            <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="whitespace-nowrap rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                {isDeleting ? "Deleting..." : "Delete Group"}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}