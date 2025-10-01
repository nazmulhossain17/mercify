/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  DollarSign,
  Clock,
  Heart,
  Settings,
} from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PendingApplications } from "@/components/admin/pending-application";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminOverview = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard`
        );
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  if (!dashboardData) {
    return <p>Failed to load dashboard</p>;
  }

  // build chartData dynamically
  const chartData = [
    {
      name: "Total Users",
      value: 35.2,
      color: "#10b981",
      amount: dashboardData.totalUsers.toLocaleString(),
    },
    {
      name: "Total Mercyfi Balance",
      value: 35.2,
      color: "#8b5cf6",
      amount: `$${dashboardData.totalMercifyBalance.toLocaleString()}`,
    },
    {
      name: "Total Donations",
      value: 9.0,
      color: "#ef4444",
      amount: `$${dashboardData.totalDonations.toLocaleString()}`,
    },
    {
      name: "Active Loans",
      value: 6.0,
      color: "#f59e0b",
      amount: dashboardData.activeLoans.toLocaleString(),
    },
    {
      name: "Administration Fee",
      value: 14.6,
      color: "#6b7280",
      amount: `$${dashboardData.adminFee.toLocaleString()}`,
    },
  ];

  const totalValue =
    dashboardData.totalMercifyBalance +
    dashboardData.totalDonations +
    dashboardData.adminFee +
    dashboardData.totalLoan;

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
        <Link to="/admin/users" className="hover:opacity-90 transition">
          <StatsCard
            title="Total Users"
            value={dashboardData.totalUsers.toLocaleString()}
            change="+12.5% from previous month"
            changeType="positive"
            icon={Users}
          />
        </Link>
        <Link to="/admin/total-loans" className="hover:opacity-90 transition">
          <StatsCard
            title="Active Loans"
            value={dashboardData.activeLoans.toLocaleString()}
            change="+5.3% from previous month"
            changeType="positive"
            icon={FileText}
          />
        </Link>
        <a href="#">
          <StatsCard
            title="Total Mercyfi Balance"
            value={`$${dashboardData.totalMercifyBalance.toLocaleString()}`}
            change="+18.2% from previous month"
            changeType="positive"
            icon={DollarSign}
          />
        </a>
        <a href="#">
          <StatsCard
            title="Pending Applications"
            value={dashboardData.pendingApplications.toLocaleString()}
            change="-2.4% from previous month"
            changeType="negative"
            icon={Clock}
          />
        </a>
        <Link to="/admin/donations" className="hover:opacity-90 transition">
          <StatsCard
            title="Total Donations"
            value={`$${dashboardData.totalDonations.toLocaleString()}`}
            change="+25.8% from previous month"
            changeType="positive"
            icon={Heart}
          />
        </Link>
        <Link to="/admin/admin-fee" className="hover:opacity-90 transition">
          <StatsCard
            title="Administration Fee"
            value={`$${dashboardData.adminFee.toLocaleString()}`}
            change="+15.3% from previous month"
            changeType="positive"
            icon={Settings}
          />
        </Link>

        {/* Total Loan */}
      </div>

      {/* Financial Distribution */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-lg md:text-xl font-semibold">
              Financial Distribution
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Visual breakdown of key financial metrics
            </p>
          </div>
          <Select defaultValue="current">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="previous">Previous Period</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Chart */}
            <div className="flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-sm">
                <ResponsiveContainer width="100%" height={280} minWidth={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="45%"
                      outerRadius="70%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                      ${totalValue.toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Total Value
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Details */}
            <div className="order-1 lg:order-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
                Breakdown Details
              </h3>
              <div className="space-y-3 md:space-y-4">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                          {item.name}
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {item.amount}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        {item.value}%
                      </p>
                      <p className="text-xs md:text-sm text-green-600">
                        +{(item.value * 0.5).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PendingApplications />
    </div>
  );
};

export default AdminOverview;
