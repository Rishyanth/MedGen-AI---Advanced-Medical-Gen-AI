import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, User, Bot, Loader2, AlertCircle, Info } from "lucide-react";
import { generateMedicalResponse } from "@/lib/openai";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isError?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm your medical assistant powered by AI. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const ChatbotFeature = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    setApiKeyError(null);

    try {
      // Call OpenAI API
      const response = await generateMedicalResponse(input);

      if (response.error) {
        // Handle API key error
        if (response.error.includes("API key")) {
          setApiKeyError(
            "No OpenAI API key found. Please add your API key in the settings.",
          );
        }

        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.error,
          sender: "bot",
          timestamp: new Date(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else if (response.content) {
        // Add bot response
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I encountered an error processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    // This would integrate with Web Speech API in a real implementation
    setIsRecording(!isRecording);

    if (!isRecording) {
      // Simulate voice recording and transcription
      setTimeout(() => {
        const simulatedTranscript =
          "I've been having headaches for the past few days.";
        setInput(simulatedTranscript);
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white shadow-sm border-gray-200">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Medical AI Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        {apiKeyError && (
          <Alert variant="destructive" className="m-4 mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiKeyError}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : message.isError
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-blue-100"
                        : message.isError
                          ? "bg-red-100"
                          : "bg-gray-200"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-blue-500" />
                    ) : message.isError ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-700" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <p className="text-sm text-gray-500">AI is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <CardFooter className="p-4 border-t flex gap-2 bg-gray-50">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "bg-red-100 text-red-500" : ""}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your medical question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ChatbotFeature;
