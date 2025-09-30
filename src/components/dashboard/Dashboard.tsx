import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CourseSidebar from "./CourseSidebar";
import ChatInterface from "./ChatInterface";
import SubtopicView from "./SubtopicView";
import VideoPanel from "./VideoPanel";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  topics: Topic[];
}

interface Topic {
  id: number;
  title: string;
  subtopics: string[];
}

interface SubtopicData {
  name: string;
  ai_result: string;
  youtube_videos: any[];
}

export default function Dashboard() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
    navigate("/login");
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
    setMobileMenuOpen(false);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
  };

  const handleSubtopicSelect = (topic: Topic, subtopic: SubtopicData) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(subtopic);
    setMobileMenuOpen(false);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const handleCourseGenerate = () => {
    // Trigger refresh of courses
    setRefreshTrigger(prev => prev + 1);
  };

  // Close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="font-semibold text-foreground">Learning Platform</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:relative z-40 h-full
        ${sidebarCollapsed ? 'md:w-16' : 'md:w-80'} w-80
      `}>
        <CourseSidebar
          key={refreshTrigger} // Force re-render to refresh courses
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          selectedSubtopic={selectedSubtopic}
          onCourseSelect={handleCourseSelect}
          onTopicSelect={handleTopicSelect}
            onSubtopicSelect={handleSubtopicSelect}
            onBackToCourses={handleBackToCourses}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row pt-16 md:pt-0 min-w-0">
        {/* Chat Interface or Subtopic View */}
        <div className="flex-1 min-w-0">
          {selectedSubtopic ? (
            <SubtopicView subtopic={selectedSubtopic} />
          ) : (
            <ChatInterface
              onCourseGenerate={handleCourseGenerate}
            />
          )}
        </div>

        {/* Video Panel */}
        <div className={`
          ${selectedSubtopic?.youtube_videos?.length ? 'block' : 'hidden'} 
          w-full md:w-80 lg:w-96
        `}>
          <VideoPanel
            videos={selectedSubtopic?.youtube_videos || []}
            loading={false}
          />
        </div>
      </div>

      {/* Desktop Header (Top Right) */}
      <div className="hidden md:block absolute top-4 right-6 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}