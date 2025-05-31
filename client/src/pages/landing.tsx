import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Shield, Briefcase, Bell } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center hr-gradient p-4">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Users className="text-primary-foreground text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">HRConnect</h1>
            <p className="text-muted-foreground">Employee Management System</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Briefcase className="text-accent text-lg" />
              </div>
              <div>
                <p className="font-medium text-foreground">Employee Self-Service</p>
                <p className="text-sm text-muted-foreground">Access pay, records, and benefits</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="text-primary text-lg" />
              </div>
              <div>
                <p className="font-medium text-foreground">Real-time Notifications</p>
                <p className="text-sm text-muted-foreground">Stay updated with company news</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Shield className="text-secondary text-lg" />
              </div>
              <div>
                <p className="font-medium text-foreground">Secure & Reliable</p>
                <p className="text-sm text-muted-foreground">Your data is protected</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full" variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                IT Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
