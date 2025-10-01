import { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Play, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  ai_result?: string;
  youtube_videos?: string[];
}

interface CourseSidebarProps {
  selectedCourse: Course | null;
  selectedTopic: Topic | null;
  selectedSubtopic: SubtopicData | null;
  onCourseSelect: (course: Course) => void;
  onTopicSelect: (topic: Topic) => void;
  onSubtopicSelect: (topic: Topic, subtopic: SubtopicData) => void;
  onBackToCourses: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function CourseSidebar({
  selectedCourse,
  selectedTopic,
  selectedSubtopic,
  onCourseSelect,
  onTopicSelect,
  onSubtopicSelect,
  onBackToCourses,
  collapsed,
  onToggleCollapse,
  onLoadingChange,
}: CourseSidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState(new Set<number>());
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const toggleTopic = (topicId: number) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://localhost:3030/api/courses/getcourse/all/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch courses");
        }

        const data = await res.json();

        const formatted: Course[] = data.titles.map((title: string, index: number) => ({
          id: index + 1,
          title,
          topics: [],
        }));

        setCourses(formatted);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  // Fetch topics/subtopics for a course
  const handleCourseSelect = async (course: Course) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3030/api/courses/getcourse/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: course.title }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch course details");
      }

      const data = await res.json();

      const topics: Topic[] = data.main_topics.map((mainTopic: string, index: number) => ({
        id: index + 1,
        title: mainTopic,
        subtopics: data.sub_topics[index] || [],
      }));

      onCourseSelect({
        ...course,
        topics,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI result + YouTube videos for subtopic
  const handleSubtopicSelect = async (topic: Topic, subtopicName: string) => {
    try {
      setLoading(true);
      onLoadingChange?.(true);
      setError(null);

      const res = await fetch(
        "http://localhost:3030/api/courses/getcourse/airesult/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            main_topic: topic.title,
            sub_topic: subtopicName,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch AI result");
      }

      const data = await res.json();

      // Pass the full object with name, AI result, and YouTube videos
      onSubtopicSelect(topic, {
        name: subtopicName,
        ai_result: data.ai_result,
        youtube_videos: data.youtube_videos,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error("Failed to load subtopic content");
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div
      className={`bg-gradient-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between bg-card/30">
        {!collapsed && (
          <h2 className="text-foreground font-semibold text-lg">
            Learning Platform
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-background/50"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {!selectedCourse ? (
            // Course List
            <div className="space-y-3">
              {!collapsed && (
                <h3 className="text-foreground font-medium mb-4">
                  Available Courses
                </h3>
              )}

              {loading && <p className="text-muted-foreground text-sm">Loading courses...</p>}
              {error && <p className="text-destructive text-sm">{error}</p>}

              {!loading &&
                !error &&
                courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    className="p-3 rounded-lg border border-border bg-card hover:bg-card/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {!collapsed && (
                        <div>
                          <h4 className="text-foreground font-medium text-sm">
                            {course.title}
                          </h4>
                          <p className="text-muted-foreground text-xs mt-1">
                            Click to explore topics
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            // Course Topics
            <div className="space-y-3">
              {!collapsed && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBackToCourses}
                    className="flex items-center text-muted-foreground hover:bg-background/50 rounded-md px-2 py-1 mb-4 w-full justify-start"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Courses
                  </Button>
                  <h3 className="text-foreground font-medium mb-4">
                    {selectedCourse.title}
                  </h3>
                </>
              )}

              {selectedCourse.topics.map((topic) => (
                <div key={topic.id} className="space-y-2">
                  <div
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTopic?.id === topic.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-medium text-sm">
                        {!collapsed && topic.title}
                      </span>
                      {!collapsed && (
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedTopics.has(topic.id) ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Subtopics */}
                  {!collapsed && expandedTopics.has(topic.id) && (
                    <div className="ml-4 space-y-1">
                      {topic.subtopics.map((subtopic: any, index) => {
                        const subtopicName =
                          typeof subtopic === "string" ? subtopic : subtopic.name;

                        return (
                          <div
                            key={index}
                            onClick={() => handleSubtopicSelect(topic, subtopicName)}
                            className={`p-2 rounded-md cursor-pointer transition-colors text-sm ${
                              selectedSubtopic?.name === subtopicName
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Play className="h-3 w-3" />
                              {subtopicName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}