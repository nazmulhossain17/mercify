import type { MemberProfile } from "@/types/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface AdminFee {
  _id: string;
  amount: number;
  memberId: MemberProfile;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

const AdminFeePage: React.FC = () => {
  const [fees, setFees] = useState<AdminFee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/adminfee`);
        const data = await res.json();
        setFees(data.data || []);
      } catch (error) {
        console.error("Failed to fetch admin fees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <motion.h1
        className="text-3xl font-bold mb-6 text-gray-800 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        💰 Administrator Fees
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Mobile view - colorful cards */}
          <div className="grid gap-4 md:hidden">
            {fees.map((fee, index) => {
              const cardColors = [
                "bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500",
                "bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500",
                "bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500",
                "bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500",
                "bg-gradient-to-r from-teal-100 to-blue-100 border-l-4 border-teal-500",
              ];
              const colorIndex = index % cardColors.length;

              return (
                <motion.div
                  key={fee._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`shadow-lg ${cardColors[colorIndex]} hover:shadow-xl transition-all duration-300`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                          👤 {fee.memberId.fullName}
                        </CardTitle>
                        <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                          ${fee.amount}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          📧
                        </span>
                        <span>{fee.memberId.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          🎯
                        </span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                          {fee.memberId.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          🚗
                        </span>
                        <span>{fee.memberId.drivingLicense || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          📞
                        </span>
                        <span>{fee.memberId.phoneNumber}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop view - colorful table */}
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <Table>
                <TableHeader className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-white font-bold py-4 text-center">
                      👤 Full Name
                    </TableHead>
                    <TableHead className="text-white font-bold py-4 text-center">
                      📧 Email
                    </TableHead>
                    <TableHead className="text-white font-bold py-4 text-center">
                      🎯 Transaction Id
                    </TableHead>
                    <TableHead className="text-white font-bold py-4 text-center">
                      Date
                    </TableHead>
                    <TableHead className="text-white font-bold py-4 text-center">
                      📞 Phone Number
                    </TableHead>
                    <TableHead className="text-white font-bold py-4 text-center">
                      💰 Fee Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee, index) => {
                    const rowColor =
                      index % 2 === 0
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "bg-white hover:bg-gray-50";

                    return (
                      <motion.tr
                        key={fee._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{
                          scale: 1.01,
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                        }}
                        transition={{ duration: 0.2 }}
                        className={`${rowColor} transition-all duration-200 group`}
                      >
                        <TableCell className="font-semibold text-gray-800 text-center py-3 border-b border-gray-200">
                          {fee.memberId.fullName}
                        </TableCell>
                        <TableCell className="text-gray-600 text-center py-3 border-b border-gray-200">
                          {fee.memberId.email}
                        </TableCell>
                        <TableCell className="text-center py-3 border-b border-gray-200">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {fee.transactionId}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-3 border-b border-gray-200">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {fee.createdAt
                              ? new Date(fee.createdAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600 text-center py-3 border-b border-gray-200">
                          {fee.memberId.phoneNumber}
                        </TableCell>
                        <TableCell className="text-center py-3 border-b border-gray-200">
                          <span className="px-3 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-md">
                            ${fee.amount}
                          </span>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Summary Card */}
            {fees.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 text-white shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Total Fees</h3>
                    <p className="text-cyan-100">Across all members</p>
                  </div>
                  <div className="text-3xl font-bold">
                    ${fees.reduce((total, fee) => total + fee.amount, 0)}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFeePage;
