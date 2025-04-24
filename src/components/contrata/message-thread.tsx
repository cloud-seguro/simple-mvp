"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderName: string;
  senderId: string;
  senderAvatar?: string;
};

export default function MessageThread({
  engagementId,
  profileId,
}: {
  engagementId: string;
  profileId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to load messages
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/contrata/engagements/${engagementId}/messages`
      );
      if (!response.ok) {
        throw new Error("Error al cargar mensajes");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los mensajes. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [engagementId, toast]);

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
    // Set up polling to refresh messages every 15 seconds
    const intervalId = setInterval(loadMessages, 15000);
    return () => clearInterval(intervalId);
  }, [loadMessages]);

  // Function to send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `/api/contrata/engagements/${engagementId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage,
            profileId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar mensaje");
      }

      // Clear the input and reload messages
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          "No se pudo enviar el mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Mensajes</h2>
        <p className="text-muted-foreground">
          Comunícate directamente con todos los involucrados en este proyecto.
        </p>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-background">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay mensajes aún.</p>
            <p>Inicia la conversación enviando un mensaje.</p>
          </div>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <div key={date} className="mb-6">
              <div className="relative flex items-center mb-4">
                <div className="flex-grow border-t border-muted"></div>
                <span className="mx-4 flex-shrink-0 text-xs text-muted-foreground">
                  {format(new Date(date), "PPP", { locale: es })}
                </span>
                <div className="flex-grow border-t border-muted"></div>
              </div>

              {groupedMessages[date].map((message) => {
                const isCurrentUser = user?.id === message.senderId;
                return (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full overflow-hidden flex-shrink-0 ${
                          isCurrentUser ? "ml-3" : "mr-3"
                        }`}
                      >
                        {message.senderAvatar ? (
                          <Image
                            src={message.senderAvatar}
                            alt={message.senderName}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {message.senderName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="mb-1 text-xs font-medium">
                            {message.senderName}{" "}
                            <span className="text-xs opacity-70">
                              {format(new Date(message.createdAt), "HH:mm")}
                            </span>
                          </div>
                          <p className="break-words whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="mt-auto">
        <div className="flex">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            className="ml-2 self-end"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
