import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, History, MessageSquare } from "lucide-react";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    title: string;
    category: string;
    content: string;
    lastUpdated: string;
    version: string;
  };
}

export function DocumentPreview({ isOpen, onClose, document }: DocumentPreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{document.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{document.category}</span>
            <span>•</span>
            <span>Version {document.version}</span>
            <span>•</span>
            <span>Last updated {document.lastUpdated}</span>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-4 bg-gray-50 rounded-lg">
          <div className="prose max-w-none">
            {document.content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 