"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
}

interface MessageThreadProps {
  rfqId: string;
  messages: Message[];
  currentUserId: string;
}

export function MessageThread({
  rfqId,
  messages,
  currentUserId,
}: MessageThreadProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    const res = await fetch("/api/rfq/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rfqId, content }),
    });

    if (res.ok) {
      setContent("");
      router.refresh();
    }
    setSending(false);
  }

  return (
    <div className="mt-4">
      {messages.length === 0 ? (
        <p className="text-sm text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-3 ${
                msg.sender.id === currentUserId
                  ? "ml-8 bg-primary-light"
                  : "mr-8 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {msg.sender.name}
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    ({msg.sender.role})
                  </span>
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(msg.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{msg.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button type="submit" disabled={sending || !content.trim()}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
