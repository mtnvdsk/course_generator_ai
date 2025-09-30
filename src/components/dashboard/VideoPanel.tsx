import { useState } from "react";
import { Play, ExternalLink, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface YouTubeVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  channel?: string;
  url: string;
}

interface VideoPanelProps {
  videos: string[] | YouTubeVideo[];
  loading?: boolean;
}

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url: string): string => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

// Helper function to convert URL strings to video objects
const processVideos = (videos: string[] | YouTubeVideo[]): YouTubeVideo[] => {
  if (!videos || videos.length === 0) return [];
  
  // If already video objects, return as is
  if (typeof videos[0] === 'object' && 'url' in videos[0]) {
    return videos as YouTubeVideo[];
  }
  
  // Convert URL strings to video objects
  return (videos as string[]).map((url, index) => {
    const videoId = extractVideoId(url);
    return {
      id: videoId,
      title: `Video ${index + 1}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      url: url,
      description: 'Click to watch on YouTube'
    };
  });
};

export default function VideoPanel({ videos, loading }: VideoPanelProps) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  
  // Process videos to ensure consistent format
  const processedVideos = processVideos(videos);

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const openInYouTube = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-sidebar border-l border-sidebar-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-32"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!processedVideos || processedVideos.length === 0) {
    return (
      <div className="h-full bg-gradient-sidebar border-l border-sidebar-border flex items-center justify-center">
        <div className="text-center p-6">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Videos Available</h3>
          <p className="text-muted-foreground text-sm">
            Select a subtopic to see related videos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-sidebar border-l border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-semibold text-foreground mb-2">Related Videos</h2>
        <p className="text-muted-foreground text-sm">
          {processedVideos.length} video{processedVideos.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Video List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {processedVideos.map((video, index) => (
          <Card 
            key={video.id || index} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedVideo?.id === video.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => handleVideoSelect(video)}
          >
            <CardContent className="p-4">
              {/* Thumbnail */}
              <div className="relative mb-3 group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-32 object-cover rounded-lg bg-muted"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/320x180/1f2937/9ca3af?text=Video+Thumbnail';
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                
                {video.channel && (
                  <p className="text-muted-foreground text-xs">
                    {video.channel}
                  </p>
                )}

                {video.description && (
                  <p className="text-muted-foreground text-xs line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {video.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.views}
                      </div>
                    )}
                    {video.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInYouTube(video.url);
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Video Details */}
      {selectedVideo && (
        <div className="border-t border-sidebar-border p-6 bg-background/50">
          <h3 className="font-semibold text-foreground mb-2 text-sm">Selected Video</h3>
          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
            {selectedVideo.title}
          </p>
          <Button 
            onClick={() => openInYouTube(selectedVideo.url)}
            size="sm"
            className="w-full bg-gradient-primary hover:bg-primary-hover"
          >
            <Play className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
        </div>
      )}
    </div>
  );
}