import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-500">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setLocation("/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <p className="text-sm text-gray-500">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
