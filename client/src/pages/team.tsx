import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import {
  Users,
  UserPlus,
  UserCog,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Star,
  Award,
  Trophy,
  ChevronDown,
  Search,
  Filter,
  Plus
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: "active" | "away" | "offline";
  joinDate: string;
  performance: number;
  achievements: string[];
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  // Mock data - replace with actual data fetching
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "John Doe",
      role: "Senior Developer",
      department: "Engineering",
      email: "john.doe@company.com",
      phone: "+1 234 567 890",
      avatar: "/avatars/john-doe.jpg",
      status: "active",
      joinDate: "Jan 2023",
      performance: 95,
      achievements: ["Employee of the Month", "Best Team Player"]
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Product Manager",
      department: "Product",
      email: "jane.smith@company.com",
      phone: "+1 234 567 891",
      avatar: "/avatars/jane-smith.jpg",
      status: "active",
      joinDate: "Mar 2023",
      performance: 92,
      achievements: ["Innovation Award"]
    },
    // Add more team members...
  ];

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                <p className="text-muted-foreground">
                  Manage your team members and their roles
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
                <Button className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <UserCog className="h-4 w-4 mr-2" />
                  Manage Roles
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
                  <Users className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <span>Across all departments</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                  <UserCheck className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>Currently working</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <Building className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <span>Active departments</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Hires</CardTitle>
                  <UserPlus className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>This month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search team members..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Team Members Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        {member.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building className="h-4 w-4 mr-2" />
                        {member.department}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Joined {member.joinDate}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Performance</span>
                        <span className="font-medium">{member.performance}%</span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${member.performance}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {member.achievements.map((achievement, index) => (
                          <Badge key={index} variant="secondary">
                            <Trophy className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 