"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageSquare } from "lucide-react";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    name: string | null;
    email: string;
  };
  recipient: {
    id: number;
    name: string | null;
    email: string;
  };
}

export default function MessagesTab({ userId }: { userId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch("/api/student/messages");
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });
      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-white/10 shadow-xl">
        <CardHeader className="border-b border-gray-200 dark:border-white/10">
          <CardTitle className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Messages with Your Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages List */}
          <div className="h-[500px] p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No messages yet. Start a conversation with your coach!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isFromMe = message.sender.id === userId;
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        isFromMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isFromMe && (
                        <Avatar className="h-10 w-10 border-2 border-green-600">
                          <AvatarFallback className="bg-gradient-to-br from-green-600 to-emerald-600 text-white text-sm">
                            {message.sender.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "C"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] ${
                          isFromMe ? "order-first" : ""
                        }`}
                      >
                        <div
                          className={`rounded-2xl p-4 ${
                            isFromMe
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {isFromMe && (
                        <Avatar className="h-10 w-10 border-2 border-blue-600">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                            ME
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200 dark:border-white/10">
            <div className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
