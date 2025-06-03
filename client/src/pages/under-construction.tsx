import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Construction, Home, Clock } from "lucide-react";

export default function UnderConstruction() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
              <Construction className="h-12 w-12 text-amber-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Coming Soon</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Under Construction</h2>
          <p className="text-gray-500">
            We're working hard to bring you something amazing. Please check back soon!
          </p>
          <div className="flex items-center justify-center space-x-2 text-amber-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Estimated launch: Coming Soon</span>
          </div>
        </div>
        <div className="space-y-4">
          <Button
            className="w-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setLocation("/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <p className="text-sm text-gray-500">
            Want to be notified when we launch? Join our waitlist!
          </p>
        </div>
      </div>
    </div>
  );
} 