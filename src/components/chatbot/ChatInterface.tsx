import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { createActivity } from "@/lib/api";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition if supported
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");

        setInput(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: `Hello${user ? `, ${user.user_metadata?.name || ""}` : ""}! I'm your AI medical assistant. How can I help you today?`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a response with a timeout
      setTimeout(async () => {
        const aiResponse = await generateAIResponse(userMessage.content);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);

        // Log this chat in activities
        if (user) {
          try {
            await createActivity({
              user_id: user.id,
              title: "AI Chat Session",
              description:
                userMessage.content.substring(0, 100) +
                (userMessage.content.length > 100 ? "..." : ""),
              type: "chat",
              status: "completed",
            });
          } catch (error) {
            console.error("Error logging chat activity:", error);
          }
        }
      }, 1500);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setIsLoading(false);
    }

    // Focus the input field after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // This is a mock function - in a real app, you would call your backend API
    // which would then use OpenAI or another AI service

    const lowercasedInput = userInput.toLowerCase();

    if (
      lowercasedInput.includes("headache") ||
      lowercasedInput.includes("head pain")
    ) {
      return "Headaches can have many causes, from tension and stress to more serious conditions. How long have you been experiencing this headache? Is it accompanied by any other symptoms like nausea, sensitivity to light, or visual disturbances?";
    } else if (
      lowercasedInput.includes("fever") ||
      lowercasedInput.includes("temperature")
    ) {
      return "A fever is often a sign that your body is fighting an infection. What's your temperature reading? Are you experiencing any other symptoms like cough, sore throat, or body aches?";
    } else if (
      lowercasedInput.includes("cough") ||
      lowercasedInput.includes("cold")
    ) {
      return "Coughs can be caused by various conditions from common colds to bronchitis. Is your cough dry or productive (bringing up mucus)? How long have you had it? Any fever or difficulty breathing?";
    } else if (lowercasedInput.includes("pain")) {
      return "I understand you're experiencing pain. Could you describe where exactly you feel the pain, how severe it is on a scale of 1-10, and whether it's constant or comes and goes?";
    } else if (
      lowercasedInput.includes("hello") ||
      lowercasedInput.includes("hi") ||
      lowercasedInput.includes("hey")
    ) {
      return "Hello! I'm your AI medical assistant. I can help answer medical questions or discuss symptoms you might be experiencing. How can I assist you today?";
    } else if (lowercasedInput.includes("thank")) {
      return "You're welcome! If you have any other medical questions or concerns, feel free to ask. I'm here to help.";
    } else {
      return "Thank you for sharing that information. To provide better guidance, could you tell me more about your symptoms? When did they start, and have you noticed any patterns or triggers?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setInput("");
    }

    setIsRecording(!isRecording);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full h-[calc(100vh-12rem)] flex flex-col bg-white shadow-md">
      <CardHeader className="border-b bg-primary/5 px-6 py-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Medical Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar
                    className={`h-8 w-8 ${message.sender === "user" ? "bg-primary/10" : "bg-primary/20"}`}
                  >
                    {message.sender === "user" ? (
                      <>
                        <AvatarImage
                          src={
                            user?.user_metadata?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                          }
                        />
                        <AvatarFallback className="bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/vite.svg" />
                        <AvatarFallback className="bg-primary/20">
                          <Bot className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-primary/20">
                    <AvatarImage src="/vite.svg" />
                    <AvatarFallback className="bg-primary/20">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="rounded-lg p-3 bg-muted flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={isRecording ? "text-red-500" : ""}
              type="button"
              disabled={!recognition}
              title={recognition ? "Voice input" : "Voice input not supported"}
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              type="button"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
