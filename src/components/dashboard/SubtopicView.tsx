import { Sparkles } from "lucide-react";
import loadingGif from "@/assets/loading.gif";

interface SubtopicViewProps {
  subtopic: {
    name: string;
    ai_result?: string;
  };
  isLoading?: boolean;
}

export default function SubtopicView({ subtopic, isLoading = false }: SubtopicViewProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h2 className="font-semibold text-foreground mb-4 text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {subtopic.name}
            </h2>
            <div className="prose prose-sm max-w-none">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <img src={loadingGif} alt="Loading..." className="w-24 h-24 mb-4" />
                  <p className="text-muted-foreground text-center">Loading content...</p>
                </div>
              ) : (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {subtopic.ai_result || "Loading content..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}