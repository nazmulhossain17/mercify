/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users,
  CreditCard,
  DollarSign,
  Clock,
  Heart,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

// 3rd party packages
// import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

const ReportsPage = () => {
  // const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  // const [selectedReportType, setSelectedReportType] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  console.log(isLoading);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const data = await res.json();

      const metricsData = [
        {
          id: "total-users",
          name: "Total Users",
          value: data.totalUsers,
          displayValue: data.totalUsers.toLocaleString(),
          icon: Users,
          trend: "+0%",
          color: "#3B82F6",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          id: "active-loans",
          name: "Active Loans",
          value: data.activeLoans,
          displayValue: data.activeLoans.toLocaleString(),
          icon: CreditCard,
          trend: "+0%",
          color: "#10B981",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
        {
          id: "total-disbursed",
          name: "Total Disbursed",
          value: data.totalLoan,
          displayValue: `$${data.totalLoan.toLocaleString()}`,
          icon: DollarSign,
          trend: "+0%",
          color: "#8B5CF6",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
        },
        {
          id: "pending-applications",
          name: "Pending Applications",
          value: data.pendingApplications,
          displayValue: data.pendingApplications.toLocaleString(),
          icon: Clock,
          trend: "+0%",
          color: "#F59E0B",
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
        },
        {
          id: "total-donations",
          name: "Total Donations",
          value: data.totalDonations,
          displayValue: `$${data.totalDonations.toLocaleString()}`,
          icon: Heart,
          trend: "+0%",
          color: "#EF4444",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
        },
        {
          id: "admin-fee",
          name: "Administration Fee",
          value: data.adminFee,
          displayValue: `$${data.adminFee.toLocaleString()}`,
          icon: Settings,
          trend: "+0%",
          color: "#6B7280",
          bgColor: "bg-gray-50",
          iconColor: "text-gray-600",
        },
      ];

      const chartDataArr = [
        { name: "Total Users", value: data.totalUsers, color: "#3B82F6" },
        { name: "Active Loans", value: data.activeLoans, color: "#10B981" },
        {
          name: "Pending Applications",
          value: data.pendingApplications,
          color: "#F59E0B",
        },
        {
          name: "Total Donations",
          value: data.totalDonations,
          color: "#EF4444",
        },
        { name: "Admin Fee", value: data.adminFee, color: "#6B7280" },
        { name: "Total Loan", value: data.totalLoan, color: "#8B5CF6" },
      ];

      setMetrics(metricsData);
      setChartData(chartDataArr);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5,
      },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5,
      },
    },
  };
  const cardHoverVariants = {
    animate: { scale: 1 },
    hover: {
      y: 0,
      scale: 1.05,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  // const generateReport = () => toast.success("Report generated successfully!");

  // // =================== DOWNLOAD FUNCTIONS ===================
  // const downloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Dashboard Report", 14, 16);
  //   doc.autoTable({
  //     startY: 20,
  //     head: [["Metric", "Value"]],
  //     body: metrics.map((m) => [m.name, m.displayValue]),
  //   });
  //   doc.save("dashboard_report.pdf");
  // };

  const downloadCSV = () => {
    const csv = Papa.unparse(
      metrics.map((m) => ({ Metric: m.name, Value: m.displayValue }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "dashboard_report.csv");
    link.click();
  };
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Reports Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive analytics and performance insights
            </p>
          </div>
          <div className="flex gap-3">
            {/* <motion.button
              onClick={downloadPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Download PDF
            </motion.button> */}
            <motion.button
              onClick={downloadCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Download CSV
            </motion.button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          <AnimatePresence>
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.id}
                  variants={cardHoverVariants as Variants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${metric.bgColor}`}>
                        <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                      </div>
                      <div className="text-right text-2xl sm:text-3xl font-bold text-gray-900">
                        {metric.displayValue}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-600 truncate">
                        {metric.name}
                      </h3>
                      <span
                        className={`text-sm font-semibold ${
                          metric.trend.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Performance Overview
          </h2>
          <div className="space-y-6">
            {chartData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
