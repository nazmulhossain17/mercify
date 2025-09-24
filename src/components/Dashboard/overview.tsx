/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PiggyBank,
  Calendar,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
interface DashboardUser {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  hasAppliedForLoan?: boolean;
  lastApplicationDate?: string;
}

interface PaymentHistoryItem {
  id: number;
  date: string;
  amount: string;
  status: string;
  type: string;
}

interface OverviewTabProps {
  user: DashboardUser;
  paymentHistory: PaymentHistoryItem[];
  onTabChange: (tab: string) => void;
  itemVariants: any;
}

export default function OverviewTab({
  user,
  paymentHistory,
  onTabChange,
  itemVariants,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {user.fullName.split(" ")[0]}!
                </h1>
                <p className="text-emerald-100">Member since January 2023</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Total Savings</p>
                <p className="text-3xl font-bold">$0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <PiggyBank className="h-6 w-6 text-green-700" />
                </div>
                <Link to="/dashboard/savings" className="text-right">
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Monthly Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                  <Calendar className="h-6 w-6 text-blue-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Next Payment
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    May 15, 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3">
                  <CheckCircle className="h-6 w-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Loan Eligibility
                  </p>
                  <p className="text-lg font-bold text-gray-900">Eligible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.slice(0, 3).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Payment Received
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.amount} • {payment.date}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => onTabChange("payments")}
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                View All Payments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Apply for Loan */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Apply for Interest-Free Loan
                </h3>
                <p className="text-gray-600">
                  You are eligible to apply for an interest-free loan. Start
                  your application now.
                </p>
              </div>
              <Link to="/dashboard/apply-loan">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
