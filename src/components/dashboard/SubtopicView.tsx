import { Sparkles } from "lucide-react";

interface SubtopicViewProps {
  subtopic: {
    name: string;
    ai_result?: string;
  };
}

export default function SubtopicView({ subtopic }: SubtopicViewProps) {
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
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {subtopic.ai_result || "Loading content..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}