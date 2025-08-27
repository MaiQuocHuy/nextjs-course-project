"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download, FileText, X, ExternalLink, Github, Linkedin, Globe } from "lucide-react";
import Image from "next/image";

interface FileObject {
  name?: string;
  type?: string;
  url?: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
}

interface FileDisplayProps {
  file: FileObject | string;
  label: string;
}

export const FileDisplay: React.FC<FileDisplayProps> = ({ file, label }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [docxError, setDocxError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to get display name for portfolio
  const getDisplayNameForPortfolio = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace(/^www\./, ""); // Remove www if present

      // Check for specific platforms
      if (domain.includes("github.com") || domain.includes("github.io")) {
        return "GitHub Repository/Portfolio";
      }
      if (domain.includes("behance.net")) {
        return "Behance Portfolio";
      }
      if (domain.includes("dribbble.com")) {
        return "Dribbble Portfolio";
      }
      if (domain.includes("linkedin.com")) {
        return "LinkedIn Profile";
      }
      if (domain.includes("notion.so")) {
        return "Notion Portfolio";
      }

      // For other domains, return the domain name
      return domain;
    } catch (e) {
      // If URL parsing fails, fallback to simple extraction
      return url.split("/")[2] || "Portfolio Website";
    }
  };

  // Enhanced file type detection for Vietnamese requirements
  const getFileInfo = () => {
    if (typeof file === "string") {
      const url = file;

      // PRIORITY: If label is "Portfolio", always treat as external link
      if (label.toLowerCase() === "portfolio") {
        return {
          name: getDisplayNameForPortfolio(url),
          type: "external-portfolio",
          url: url,
        };
      }

      let fileName = "Unknown File";
      let fileExtension = "";

      // Special handling for Cloudinary raw uploads
      if (url.includes("cloudinary.com") && url.includes("/raw/upload/")) {
        const pathParts = url.split("/");
        const lastPart = pathParts[pathParts.length - 1].split("?")[0]; // Remove query params

        // Check if the last part has an extension
        const extensionMatch = lastPart.match(/\.([a-z0-9]+)$/i);
        if (extensionMatch) {
          fileName = lastPart;
          fileExtension = extensionMatch[1].toLowerCase();
        } else {
          // If no extension in the last part, try to find it anywhere in the path
          for (let i = pathParts.length - 1; i >= 0; i--) {
            const part = pathParts[i];
            const match = part.match(/([^/]+\.[a-z0-9]+)$/i);
            if (match) {
              fileName = match[1];
              fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
              break;
            }
          }

          // If still no extension found, use the last part as filename
          if (!fileExtension) {
            fileName = lastPart;
          }
        }
      } else {
        // For non-Cloudinary URLs, use the original logic
        fileName = url.split("/").pop()?.split("?")[0] || "Unknown File";
        fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
      }

      // Check for external sites first
      const domain = url.toLowerCase();
      if (domain.includes("github.com") || domain.includes("github.io")) {
        return {
          name: "GitHub Repository/Portfolio",
          type: "external-github",
          url: url,
        };
      }
      if (domain.includes("linkedin.com")) {
        return {
          name: "LinkedIn Profile",
          type: "external-linkedin",
          url: url,
        };
      }
      if (
        domain.includes("facebook.com") ||
        domain.includes("twitter.com") ||
        domain.includes("instagram.com")
      ) {
        return {
          name: "Social Media Profile",
          type: "external-social",
          url: url,
        };
      }

      // Detect other external sites (not file uploads)
      if (
        !domain.includes("cloudinary.com") &&
        !domain.includes("drive.google.com") &&
        !domain.includes("dropbox.com") &&
        !fileExtension &&
        (url.startsWith("http://") || url.startsWith("https://"))
      ) {
        return {
          name: "External Website",
          type: "external-website",
          url: url,
        };
      }

      // File type detection by extension
      const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
      const documentExts = ["pdf", "doc", "txt", "rtf"];
      const spreadsheetExts = ["xls", "xlsx", "csv"];
      const presentationExts = ["ppt", "pptx"];
      const videoExts = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
      const audioExts = ["mp3", "wav", "flac", "aac", "ogg"];

      let fileType = "document";

      if (fileExtension) {
        // Use extension-based detection
        if (imageExts.includes(fileExtension)) {
          fileType = "image";
        } else if (fileExtension === "pdf") {
          fileType = "pdf";
        } else if (fileExtension === "docx") {
          fileType = "docx";
        } else if (documentExts.includes(fileExtension)) {
          fileType = "document";
        } else if (spreadsheetExts.includes(fileExtension)) {
          fileType = "spreadsheet";
        } else if (presentationExts.includes(fileExtension)) {
          fileType = "presentation";
        } else if (videoExts.includes(fileExtension)) {
          fileType = "video";
        } else if (audioExts.includes(fileExtension)) {
          fileType = "audio";
        }
      }

      return {
        name: fileName,
        type: fileType,
        url: url,
      };
    }

    // Handle object with different possible property names
    return {
      name: file.name || file.fileName || "Unknown File",
      type: file.type || file.fileType || "document",
      url: file.url || file.fileUrl || "",
    };
  };

  const fileInfo = getFileInfo();
  const isImage = fileInfo.type === "image";
  const isPDF = fileInfo.type === "pdf";
  const isDocx = fileInfo.type === "docx";
  const isDocument = ["document", "spreadsheet", "presentation"].includes(fileInfo.type);
  const isExternal = fileInfo.type.startsWith("external-");
  const isVideo = fileInfo.type === "video";
  const isAudio = fileInfo.type === "audio";

  // Check if file can be previewed
  const canPreview = isImage || isPDF || isVideo || isAudio || isDocx;

  // Helper function to handle file opening/downloading
  const handleFileDownload = () => {
    if (fileInfo.url) {
      // For Cloudinary files, add fl_attachment to force download
      if (fileInfo.url.includes("cloudinary.com") && !isExternal) {
        const downloadUrl = fileInfo.url.includes("?")
          ? `${fileInfo.url}&fl_attachment`
          : `${fileInfo.url}?fl_attachment`;
        window.open(downloadUrl, "_blank");
      } else {
        window.open(fileInfo.url, "_blank");
      }
    }
  };

  // Helper function to handle preview opening
  const handlePreviewOpen = () => {
    setImageError(false);
    setPdfError(false);
    setDocxError(false);
    setLoading(true);
    setPreviewOpen(true);
  };

  // Helper function to get Google Docs Viewer URL for DOCX files
  const getDocxPreviewUrl = (originalUrl: string): string => {
    return `https://docs.google.com/gview?url=${originalUrl}&embedded=true`;
  };

  // Don't render if no URL is available
  if (!fileInfo.url) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{fileInfo.name}</p>
            <p className="text-xs text-red-500">File not available</p>
          </div>
        </div>
      </div>
    );
  }

  // Special handling for external links
  if (isExternal) {
    const getExternalIcon = () => {
      if (fileInfo.type === "external-github") return <Github className="h-5 w-5 text-blue-600" />;
      if (fileInfo.type === "external-linkedin")
        return <Linkedin className="h-5 w-5 text-blue-600" />;
      if (fileInfo.type === "external-portfolio")
        return <Globe className="h-5 w-5 text-purple-600" />;
      return <ExternalLink className="h-5 w-5 text-blue-600" />;
    };

    const getBackgroundColor = () => {
      if (fileInfo.type === "external-portfolio") return "bg-purple-50 border-purple-200";
      return "bg-blue-50 border-blue-200";
    };

    const getTextColor = () => {
      if (fileInfo.type === "external-portfolio") return "text-purple-600";
      return "text-blue-600";
    };

    const getButtonColor = () => {
      if (fileInfo.type === "external-portfolio")
        return "border-purple-300 text-purple-700 hover:bg-purple-100";
      return "border-blue-300 text-blue-700 hover:bg-blue-100";
    };

    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg border ${getBackgroundColor()}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 ${
              fileInfo.type === "external-portfolio" ? "bg-purple-100" : "bg-blue-100"
            } rounded flex items-center justify-center`}
          >
            {getExternalIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{fileInfo.name}</p>
            <p className={`text-xs ${getTextColor()}`}>{label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <Button
            onClick={() => window.open(fileInfo.url, "_blank")}
            variant="outline"
            size="sm"
            className={`hidden sm:flex items-center gap-2 ${getButtonColor()}`}
          >
            <ExternalLink className="h-4 w-4" />
            Open Link
          </Button>
          <Button
            onClick={() => window.open(fileInfo.url, "_blank")}
            variant="outline"
            size="sm"
            className={`sm:hidden p-2 ${getButtonColor()}`}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const previewUrl = fileInfo.url;
  const docxPreviewUrl = isDocx ? getDocxPreviewUrl(fileInfo.url) : null;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isImage && !imageError ? (
          <div className="w-10 h-10 relative rounded overflow-hidden">
            <Image
              src={previewUrl}
              alt={fileInfo.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="40px"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{fileInfo.name}</p>
          <p className="text-xs text-gray-500">
            {label} • {fileInfo.type.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-3">
        <Button
          onClick={
            isDocx
              ? () => window.open(getDocxPreviewUrl(fileInfo.url), "_blank")
              : handlePreviewOpen
          }
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2"
          disabled={!canPreview}
        >
          <Eye className="h-4 w-4" />
          {canPreview ? "Preview" : "No Preview"}
        </Button>
        <Button
          onClick={
            isDocx
              ? () => window.open(getDocxPreviewUrl(fileInfo.url), "_blank")
              : handlePreviewOpen
          }
          variant="outline"
          size="sm"
          className="sm:hidden p-2"
          disabled={!canPreview}
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleFileDownload}
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button onClick={handleFileDownload} variant="outline" size="sm" className="sm:hidden p-2">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          className="max-w-[95vw] w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-auto p-2 sm:p-4 md:p-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4 text-sm sm:text-base md:text-lg">{fileInfo.name}</span>
              <Button
                onClick={() => setPreviewOpen(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 sm:mt-4">
            {isImage && !imageError ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: "85vh" }}>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                      <div className="text-gray-500 text-sm sm:text-base">Loading image...</div>
                    </div>
                  )}
                  <Image
                    src={previewUrl}
                    alt={fileInfo.name}
                    fill
                    className="object-contain rounded-lg shadow-lg"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setLoading(false);
                    }}
                    sizes="(max-width: 768px) 95vw, (max-width: 1024px) 80vw, 75vw"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 w-full sm:w-auto">
                  <Button
                    onClick={handleFileDownload}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : isPDF && !pdfError ? (
              <div className="flex flex-col">
                <div className="w-full h-64 sm:h-80 md:h-[28rem] lg:h-[36rem] xl:h-[42rem] border rounded-lg overflow-hidden relative">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="text-gray-500 text-sm sm:text-base">Loading PDF...</div>
                    </div>
                  )}
                  <iframe
                    src={`${fileInfo.url}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-full"
                    title={fileInfo.name}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setPdfError(true);
                      setLoading(false);
                    }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center">
                  <Button
                    onClick={handleFileDownload}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : isDocx && !docxError && docxPreviewUrl ? (
              <div className="flex flex-col">
                <div className="w-full h-64 sm:h-80 md:h-[28rem] lg:h-[36rem] xl:h-[42rem] border rounded-lg overflow-hidden relative bg-white">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="text-gray-500 text-sm sm:text-base">
                        Loading DOCX preview...
                      </div>
                    </div>
                  )}
                  <iframe
                    src={docxPreviewUrl}
                    className="w-full h-full border-0"
                    title={`Preview of ${fileInfo.name}`}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setDocxError(true);
                      setLoading(false);
                    }}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center">
                  <Button
                    onClick={handleFileDownload}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </Button>
                  <Button
                    onClick={() => window.open(docxPreviewUrl, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open Preview in New Tab
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Original
                  </Button>
                </div>
              </div>
            ) : isVideo ? (
              <div className="flex flex-col items-center">
                <video
                  controls
                  className="w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[82vh] xl:max-h-[85vh] rounded-lg shadow-lg"
                  preload="metadata"
                >
                  <source src={fileInfo.url} />
                  Your browser does not support the video tag.
                </video>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 w-full sm:w-auto">
                  <Button
                    onClick={handleFileDownload}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : isAudio ? (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg">
                  <audio controls className="w-full">
                    <source src={fileInfo.url} />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 w-full sm:w-auto">
                  <Button
                    onClick={handleFileDownload}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : isDocument ? (
              <div className="text-center py-6 sm:py-8 md:py-12">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <p className="text-gray-500 mb-2 text-sm sm:text-base">Document Preview</p>
                <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                  {fileInfo.type.toUpperCase()} • {fileInfo.name}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center max-w-md mx-auto">
                  <Button
                    onClick={handleFileDownload}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 md:py-12">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <p className="text-gray-500 mb-2 text-sm sm:text-base">
                  {imageError || pdfError || docxError
                    ? "Failed to load preview"
                    : "Preview not available for this file type"}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                  File type: {fileInfo.type} • {fileInfo.name}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center max-w-md mx-auto">
                  <Button
                    onClick={handleFileDownload}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download to View
                  </Button>
                  <Button
                    onClick={() => window.open(fileInfo.url, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
