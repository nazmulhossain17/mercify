import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MemberProfile } from "@/types/auth";

interface RunningLoan {
  _id: string;
  memberId: MemberProfile;
  amountRequested: number;
  status: string;
  applicationDate: string;
  purpose?: string;
}

interface LoanStatsResponse {
  message: string;
  stats: {
    totalLoans: number;
    activeLoans: number;
    pendingLoans: number;
    rejectedLoans: number;
    inactiveLoans: number;
    runningLoansCount: number;
  };
  runningLoans: RunningLoan[];
}

const TotalLoan: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LoanStatsResponse["stats"] | null>(null);
  const [runningLoans, setRunningLoans] = useState<RunningLoan[]>([]);

  useEffect(() => {
    const fetchLoanStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/loan/all-loan-stats`
        );
        const data: LoanStatsResponse = await res.json();
        setStats(data.stats);
        setRunningLoans(data.runningLoans);
      } catch (error) {
        console.error("Failed to fetch loan stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📊 Loan Dashboard
      </motion.h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              title: "Total Loans",
              value: stats.totalLoans,
              color: "bg-blue-500",
            },
            {
              title: "Active Loans",
              value: stats.activeLoans,
              color: "bg-green-500",
            },
            {
              title: "Pending Loans",
              value: stats.pendingLoans,
              color: "bg-yellow-500",
            },
            {
              title: "Rejected Loans",
              value: stats.rejectedLoans,
              color: "bg-red-500",
            },
            {
              title: "Inactive Loans",
              value: stats.inactiveLoans,
              color: "bg-gray-500",
            },
            {
              title: "Running Loans",
              value: stats.runningLoansCount,
              color: "bg-indigo-500",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className={`${card.color} text-white shadow-lg`}>
                <CardContent className="text-center">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Running Loans Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-xl">Running Loans</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {runningLoans.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                No running loans found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Driving License</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Application Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runningLoans.map((loan) => (
                    <TableRow
                      key={loan._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{loan.memberId.fullName}</TableCell>
                      <TableCell>{loan.memberId.email}</TableCell>
                      <TableCell>{loan.memberId.phoneNumber}</TableCell>
                      <TableCell>{loan.memberId.role}</TableCell>
                      <TableCell>
                        {loan.memberId.drivingLicense || "N/A"}
                      </TableCell>
                      <TableCell>
                        ${loan.amountRequested.toLocaleString()}
                      </TableCell>
                      <TableCell>{loan.purpose || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(loan.applicationDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TotalLoan;
