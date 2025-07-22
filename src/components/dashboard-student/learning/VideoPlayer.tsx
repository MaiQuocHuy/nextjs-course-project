"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Play, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-slate-100  overflow-hidden">
          {/* YouTube Embed */}
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full"
            loading="lazy" // 👈 tối ưu hơn khi có nhiều iframe
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Overlay controls (optional) */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      </CardContent>
    </Card>
  );
}
