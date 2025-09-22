"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Navigation, RefreshCw } from "lucide-react";

interface InteractiveMapProps {
  title?: string;
  address?: string;
  googleMapsUrl?: string;
  className?: string;
}

export function InteractiveMap({
  title = "Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn",
  address = "470 Trần Đại Nghĩa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng, Vietnam",
  googleMapsUrl = "https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+Th%C3%B4ng+tin+v%C3%A0+Truy%E1%BB%81n+th%C3%B4ng+Vi%E1%BB%87t+-+H%C3%A0n,+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+%C4%90%C3%A0+N%E1%BA%B5ng/@15.9752603,108.2506521,846m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3142108997dc971f:0x1295cb3d313469c9!8m2!3d15.9752603!4d108.253227!16s%2Fg%2F1yjg80dyy?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",
  className = "",
}: InteractiveMapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Force re-render key
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset states when component mounts or map key changes
  useEffect(() => {
    setIsMapLoaded(false);
    setMapError(false);

    // Set timeout to show error if map doesn't load within 15 seconds
    const timeout = setTimeout(() => {
      if (!isMapLoaded) {
        console.warn("Map loading timeout - showing error state");
        setMapError(true);
      }
    }, 15000);

    setLoadTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [mapKey]);

  // Cleanup timeout when map loads
  useEffect(() => {
    if (isMapLoaded && loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
  }, [isMapLoaded, loadTimeout]);

  // Create a more reliable embed URL with timestamp to prevent caching
  const getEmbedUrl = useCallback(() => {
    const timestamp = Date.now();
    // Simplified embed URL that works more reliably
    return `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15336.998795929442!2d108.253227!3d15.9752603!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142108997dc971f%3A0x1295cb3d313469c9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDdG5nIHRpbiB2w6AgVHJ1eeG7gW4gdGjDdG5nIFZp4buHdCAtIEjDoG4sIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e0!3m2!1sen!2s!4v${timestamp}`;
  }, [mapKey]);

  const handleMapLoad = useCallback(() => {
    console.log("Map loaded successfully");
    setIsMapLoaded(true);
    setMapError(false);
  }, []);

  const handleMapError = useCallback(() => {
    console.error("Map failed to load");
    setMapError(true);
    setIsMapLoaded(false);
  }, []);

  const reloadMap = useCallback(() => {
    console.log("Reloading map...");
    setMapKey((prev) => prev + 1);
  }, []);

  const openInGoogleMaps = useCallback(() => {
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  }, [googleMapsUrl]);

  const getDirections = useCallback(() => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=15.9752603,108.253227`;
    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {address}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={getDirections}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/50"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </Button>
          <Button
            onClick={openInGoogleMaps}
            size="sm"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            View Larger
          </Button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative rounded-lg overflow-hidden shadow-lg border bg-gray-100 dark:bg-gray-800">
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Loading map...
              </p>
            </div>
          </div>
        )}

        {mapError ? (
          <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Map temporarily unavailable
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Having trouble loading the map. You can try reloading or view it
                directly in Google Maps.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={reloadMap} size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={openInGoogleMaps} size="sm">
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={mapKey} // Force re-render on key change
            src={getEmbedUrl()}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleMapLoad}
            onError={handleMapError}
            className="w-full h-96"
            title={`Map showing location of ${title}`}
          />
        )}
      </div>

      {/* Map Footer */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Campus Hours:</strong> Monday - Friday, 7:00 AM - 6:00 PM
            </p>
            <p className="mt-1">
              <strong>Parking:</strong> Available on campus for visitors
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Coordinates: 15.9752603, 108.253227</p>
          </div>
        </div>
      </div>
    </div>
  );
}
