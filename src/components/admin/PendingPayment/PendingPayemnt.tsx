import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface Payment {
  _id: string;
  memberId: string;
  applicationId: string;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      } else {
        toast.error("Failed to fetch payments.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Update payment status using payment ID
  const updateStatus = async (
    paymentId: string,
    status: "completed" | "failed"
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/status/${paymentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(
          `Payment ${status === "completed" ? "approved" : "rejected"}!`
        );
        fetchPayments();
      } else {
        toast.error(data.message || "Failed to update payment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment.");
    }
  };

  if (loading) return <p>Loading payments...</p>;
  if (!payments.length) return <p>No payments found.</p>;

  return (
    <Card className="mt-4 shadow-lg">
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Payments</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p._id}</TableCell>
                <TableCell>{p.memberId}</TableCell>
                <TableCell>${p.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    {p.transactionId || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(p.paymentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{p.paymentMethod || "Manual"}</TableCell>
                <TableCell
                  className={`font-semibold ${
                    p.status === "completed"
                      ? "text-green-600"
                      : p.status === "failed"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    disabled={p.status === "completed"}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => updateStatus(p._id, "completed")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    disabled={p.status === "failed"}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => updateStatus(p._id, "failed")}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentList;