import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-muted-foreground">
                Communicate with your team members
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
              {/* Conversations List */}
              <Card className="lg:col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search conversations..."
                      className="w-full pl-8 bg-gray-50"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {[
                      { name: "John Doe", lastMessage: "Can we schedule a meeting?", time: "10:30 AM", unread: 2, online: true },
                      { name: "Jane Smith", lastMessage: "Thanks for the update!", time: "Yesterday", unread: 0, online: false },
                      { name: "HR Team", lastMessage: "New policy update", time: "Yesterday", unread: 1, online: true },
                      { name: "Tech Support", lastMessage: "Your ticket has been resolved", time: "2 days ago", unread: 0, online: false },
                    ].map((chat, i) => (
                      <div
                        key={i}
                        className={`flex items-center space-x-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          i === 0 ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={`/avatars/${i + 1}.png`} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                              {chat.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{chat.name}</p>
                            <p className="text-xs text-gray-500">{chat.time}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                            {chat.unread > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/avatars/1.png" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">John Doe</CardTitle>
                        <p className="text-xs text-emerald-500">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="space-y-4">
                      {/* Received Message */}
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/1.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                          <p className="text-sm">Hi! Can we schedule a meeting to discuss the project timeline?</p>
                          <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                        </div>
                      </div>

                      {/* Sent Message */}
                      <div className="flex items-start justify-end space-x-2">
                        <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                          <p className="text-sm">Sure! I'm available tomorrow afternoon. How about 2 PM?</p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <p className="text-xs text-blue-200">10:32 AM</p>
                            <CheckCheck className="h-3 w-3 text-blue-200" />
                          </div>
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/2.png" />
                          <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Received Message */}
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/1.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                          <p className="text-sm">That works for me! I'll send you a calendar invite.</p>
                          <p className="text-xs text-gray-500 mt-1">10:33 AM</p>
                        </div>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
