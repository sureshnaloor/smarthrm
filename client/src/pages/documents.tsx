import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  FileText,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  FolderOpen,
  FileCheck,
  FileClock,
  FileSearch,
  FilePlus,
  MessageSquare,
  Shield,
  Users,
  Building,
  Briefcase,
  BookOpen,
  File
} from "lucide-react";
import { DocumentPreview } from "@/components/documents/document-preview";
import { DocumentFilters } from "@/components/documents/document-filters";
import { VersionHistory } from "@/components/documents/version-history";
import { DocumentShare } from "@/components/documents/document-share";

interface Document {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  status: "active" | "draft" | "archived";
  version: string;
  content: string;
}

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data - replace with actual data fetching
  const documents: Document[] = [
    {
      id: "1",
      title: "Employee Handbook",
      category: "HR Policies",
      lastUpdated: "2 hours ago",
      status: "active",
      version: "2.1",
      content: "This is the employee handbook content...",
    },
    // Add more mock documents...
  ];

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleVersionHistory = (document: Document) => {
    setSelectedDocument(document);
    setIsVersionHistoryOpen(true);
  };

  const handleShare = (document: Document) => {
    setSelectedDocument(document);
    setIsShareOpen(true);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Company Documents</h1>
                <p className="text-muted-foreground">
                  Access important company policies and procedures
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <div className="flex items-center text-xs text-blue-200">
                    <span>Company-wide documents</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">HR Policies</CardTitle>
                  <File className="h-4 w-4 text-emerald-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <div className="flex items-center text-xs text-emerald-200">
                    <span>Active policies</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Procedures</CardTitle>
                  <FileCheck className="h-4 w-4 text-amber-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78</div>
                  <div className="flex items-center text-xs text-amber-200">
                    <span>Standard procedures</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                  <FileClock className="h-4 w-4 text-purple-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <div className="flex items-center text-xs text-purple-200">
                    <span>Last 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Documents List */}
              <Card className="col-span-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Documents</CardTitle>
                    <Button variant="outline" size="sm">
                      <FileSearch className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Employee Handbook 2024",
                        category: "HR Policies",
                        date: "Mar 15, 2024",
                        status: "Active",
                        icon: Users,
                        updated: "2 days ago"
                      },
                      { 
                        title: "Leave Policy Update",
                        category: "HR Policies",
                        date: "Mar 12, 2024",
                        status: "Active",
                        icon: Users,
                        updated: "5 days ago"
                      },
                      { 
                        title: "IT Security Guidelines",
                        category: "Procedures",
                        date: "Mar 10, 2024",
                        status: "Active",
                        icon: Shield,
                        updated: "1 week ago"
                      },
                      { 
                        title: "Office Safety Protocol",
                        category: "Procedures",
                        date: "Mar 5, 2024",
                        status: "Active",
                        icon: Building,
                        updated: "2 weeks ago"
                      },
                      { 
                        title: "Remote Work Policy",
                        category: "HR Policies",
                        date: "Mar 1, 2024",
                        status: "Active",
                        icon: Briefcase,
                        updated: "3 weeks ago"
                      }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <doc.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <p className="text-xs text-gray-500">{doc.category} • Updated {doc.updated}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="col-span-3 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <Button className="h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-5 w-5" />
                        <span>Upload Document</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <FilePlus className="h-5 w-5" />
                        <span>Create New Document</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="h-5 w-5" />
                        <span>Browse Categories</span>
                      </div>
                    </Button>
                    <Button className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Document Messages</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedDocument && (
        <>
          <DocumentPreview
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            document={selectedDocument}
          />
          <VersionHistory
            isOpen={isVersionHistoryOpen}
            onClose={() => setIsVersionHistoryOpen(false)}
            documentTitle={selectedDocument.title}
            versions={[
              {
                version: "2.1",
                date: "2 hours ago",
                author: "John Doe",
                changes: "Updated employee benefits section",
              },
              {
                version: "2.0",
                date: "1 week ago",
                author: "Jane Smith",
                changes: "Major revision of company policies",
              },
              {
                version: "1.0",
                date: "1 month ago",
                author: "Admin",
                changes: "Initial version",
              },
            ]}
          />
          <DocumentShare
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            documentTitle={selectedDocument.title}
          />
        </>
      )}
    </div>
  );
} 