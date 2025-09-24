/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

// Updated interfaces to match your API responses
interface IDonation {
  _id: string;
  totalAmount: number;
  donorFirstName: string;
  donorLastName: string;
  email: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

interface IProject {
  _id: string;
  projectName: string;
  projectType: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive" | "Completed";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChartsSectionProps {
  donations: IDonation[];
  projects: IProject[];
}

export default function ChartsSection({
  donations,
  projects,
}: ChartsSectionProps) {
  // --- Total Donors by Payment Method (since status is not available in API)
  const donorPaymentMethodData = useMemo(() => {
    const counts = donations.reduce((acc, d) => {
      const method = d.paymentMethod || "Other";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [donations]);

  // --- Project Progress (current amount vs target)
  const projectData = useMemo(() => {
    return projects.map((project) => {
      return {
        name: project.projectName || "Unnamed Project",
        currentAmount: project.currentAmount || 0,
        target: project.targetAmount,
      };
    });
  }, [projects]);
  console.log(projectData);

  // --- Pie chart custom label
  const renderPieLabel = (entry: any) => `${entry.name}: ${entry.value}`;

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Total Donors by Payment Method Pie Chart */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Donors by Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          {donorPaymentMethodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donorPaymentMethodData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={renderPieLabel}
                >
                  {donorPaymentMethodData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} donors`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              No donor payment method data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Project Progress Bar Chart */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {projectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={projectData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value}`} />
                <Legend />
                <Bar
                  dataKey="currentAmount"
                  name="Current Amount"
                  fill="#8b5cf6"
                />
                <Bar dataKey="target" name="Target" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">
              No project data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
