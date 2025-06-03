import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, User, Clock } from "lucide-react";

interface Version {
  version: string;
  date: string;
  author: string;
  changes: string;
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  versions: Version[];
}

export function VersionHistory({ isOpen, onClose, documentTitle, versions }: VersionHistoryProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Version History - {documentTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.version}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Version {version.version}</span>
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{version.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{version.date}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm">{version.changes}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 