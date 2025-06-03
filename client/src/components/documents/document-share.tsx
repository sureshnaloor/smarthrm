import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPlus, Bell, Mail, Link } from "lucide-react";

interface DocumentShareProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export function DocumentShare({ isOpen, onClose, documentTitle }: DocumentShareProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document - {documentTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Share with</Label>
            <div className="flex space-x-2">
              <Input placeholder="Enter email addresses" />
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permission</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="view" defaultChecked />
              <Label htmlFor="view">Can view</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="edit" />
              <Label htmlFor="edit">Can edit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="comment" />
              <Label htmlFor="comment">Can comment</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notification Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="email" defaultChecked />
              <Label htmlFor="email">Send email notification</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="in-app" defaultChecked />
              <Label htmlFor="in-app">Send in-app notification</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex space-x-2">
              <Input value="https://yourdomain.com/documents/123" readOnly />
              <Button variant="outline">
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Share & Notify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 