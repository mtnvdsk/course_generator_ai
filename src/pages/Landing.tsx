import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Video, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary rounded-lg p-2">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Learning Platform</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-primary hover:opacity-90 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Learn Anything with
            <span className="bg-gradient-primary bg-clip-text text-transparent"> AI-Powered </span>
            Courses
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Create personalized learning experiences in seconds. Our AI generates comprehensive courses with interactive content, video resources, and intelligent tutoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-card/30 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Everything You Need to Learn
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all">
              <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-6">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">AI-Generated Courses</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simply describe what you want to learn, and our AI creates a structured course with topics and subtopics tailored to your needs.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all">
              <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-6">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Video Resources</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each topic comes with curated video content to reinforce your learning and provide multiple perspectives on complex subjects.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all">
              <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-6">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Interactive AI Tutor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ask questions, get explanations, and receive guidance from your personal AI assistant throughout your learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Why Choose Our Platform?
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2 mt-1">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Personalized Learning Paths</h3>
                <p className="text-muted-foreground">Every course is generated based on your specific interests and learning goals.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2 mt-1">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Instant Course Creation</h3>
                <p className="text-muted-foreground">No waiting - courses are generated in seconds, ready for you to start learning immediately.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2 mt-1">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Always Available</h3>
                <p className="text-muted-foreground">Learn at your own pace, on your own schedule, with 24/7 access to your courses and AI tutor.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2 mt-1">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Rich Multimedia Content</h3>
                <p className="text-muted-foreground">Combine AI-generated text content with curated videos for a comprehensive learning experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-primary rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of learners already using AI to master new skills
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2025 AI Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}