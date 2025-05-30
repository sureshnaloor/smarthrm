import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import EmployeeDashboard from "@/components/dashboard/employee-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.employee?.isAdmin || false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6">
          {isAdmin ? <AdminDashboard /> : <EmployeeDashboard />}
        </main>
      </div>
    </div>
  );
}
