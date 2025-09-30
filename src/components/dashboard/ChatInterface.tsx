import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCourseGenerate?: () => void;
}

export default function ChatInterface({ onCourseGenerate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Handle course generation
    if (onCourseGenerate) {
      try {
        // Call backend to generate course
        const response = await fetch("http://localhost:3030/api/courses/generatecourse/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ title: inputValue }), // send course title
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error generating course");
        }

        // Show AI message about generated course
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: `Course "${inputValue}" created successfully. Here are the topics:`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);

        // Display topics & subtopics from backend
        data.courseres.main_topics.forEach((topic: string, idx: number) => {
          const topicMsg: Message = {
            id: Date.now() + Math.random(),
            text: `• ${topic}\n  Subtopics: ${data.courseres.sub_topics[idx].join(", ")}`,
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, topicMsg]);
        });

        // Notify parent to refresh courses
        if (onCourseGenerate) {
          onCourseGenerate();
        }

        toast.success(`Course "${inputValue}" created successfully!`);

      } catch (err: any) {
        const errorMsg: Message = {
          id: Date.now() + 2,
          text: `Failed to generate course: ${err.message}`,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        toast.error("Failed to generate course");
      } finally {
        setIsLoading(false);
      }

      setInputValue("");
      return;
    }

    // Simulate AI response for regular chat
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `I understand you're asking about "${inputValue}". Let me help you with that topic.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Ask me anything about courses
        </h3>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/50"
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
              <div className="bg-gradient-primary rounded-full p-6 mb-6">
                <Bot className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                How can I help you today?
              </h3>
              <p className="text-muted-foreground max-w-lg text-center text-lg leading-relaxed mb-8">
                I'm your AI learning assistant. You can ask me to create courses, explain topics, or help with your studies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <h4 className="font-semibold text-foreground mb-2">Create a Course</h4>
                  <p className="text-muted-foreground text-sm">"Create a course about React development"</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <h4 className="font-semibold text-foreground mb-2">Explain a Topic</h4>
                  <p className="text-muted-foreground text-sm">"Explain machine learning basics"</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <h4 className="font-semibold text-foreground mb-2">Study Help</h4>
                  <p className="text-muted-foreground text-sm">"Help me understand calculus"</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <h4 className="font-semibold text-foreground mb-2">Practice Questions</h4>
                  <p className="text-muted-foreground text-sm">"Give me practice problems"</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 ${message.sender === "user" ? "bg-background/30" : "bg-card/30"}`}
            >
              <div className={`flex items-start gap-4 max-w-4xl mx-auto ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`rounded-full p-3 flex-shrink-0 ${message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-gradient-primary text-white"
                  }`}>
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`flex-1 min-w-0 ${message.sender === "user" ? "text-right" : "text-left"
                  }`}>
                  <div className={`inline-block max-w-[80%] p-4 rounded-2xl text-sm ${message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                    }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe the course you want to create..."
                className="w-full resize-none border border-border rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background shadow-sm min-h-[52px] max-h-[120px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:bg-primary-hover text-white p-3 rounded-xl flex items-center justify-center shadow-sm h-10 w-10"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}