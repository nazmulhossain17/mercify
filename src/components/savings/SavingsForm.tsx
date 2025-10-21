/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { MemberProfile } from "@/types/auth";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Transaction {
  _id: string;
  savings_amount: number;
  transactionId: string;
  payment_method: string;
  entryDate: string;
  memberId: MemberProfile;
}

export default function SavingsForm() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const member = useAppSelector(selectUser);

  // ✅ Replace with dynamic memberId (from auth/session/route params)
  const memberId = member?.id;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/savings/member/${memberId}`
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch transactions");

        setTransactions(data.transactions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [memberId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto p-9 sm:p-12 md:p-16 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4">My All Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No transactions found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, idx) => (
                <motion.tr
                  key={tx._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b last:border-0"
                >
                  <TableCell className="font-mono text-sm">
                    {tx.transactionId || "N/A"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${tx.savings_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {tx.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(tx.entryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {tx.memberId?.fullName} <br />
                    <span className="text-xs text-muted-foreground">
                      {tx.memberId?.email}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
}
