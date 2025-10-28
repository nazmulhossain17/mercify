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
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Payment {
  _id: string;
  memberId: string | { fullName: string; email: string };
  applicationId: string;
  amount: number;
  paymentDate: string;
  paymentMethod?: string;
  status: "pending" | "completed" | "failed";
  paymentType: "loan" | "monthly_savings" | "admin_fee";
  transactionId?: string;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "failed">("pending");
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

  // Update payment status
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

  // Filter by search and status
  useEffect(() => {
    let filtered = [...payments];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p) => {
        const memberString =
          typeof p.memberId === "string"
            ? p.memberId
            : p.memberId.fullName.toLowerCase();
        return (
          memberString.includes(term) ||
          p._id.toLowerCase().includes(term) ||
          (p.transactionId && p.transactionId.toLowerCase().includes(term))
        );
      });
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter]);

  if (loading) return <p>Loading payments...</p>;
  if (!payments.length) return <p>No payments found.</p>;

  return (
    <Card className="mt-4 shadow-lg">
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h3 className="text-lg font-semibold">Manual Payments</h3>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by Member"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "pending" | "completed" | "failed")
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p._id.slice(0, 6)}</TableCell>
                  <TableCell>
                    {typeof p.memberId === "string"
                      ? "N/A"
                      : p.memberId.fullName}
                  </TableCell>
                  <TableCell>
                    {typeof p.memberId === "string"
                      ? "N/A"
                      : p.memberId.email}
                  </TableCell>
                  <TableCell>${p.amount.toLocaleString()}</TableCell>
                  <TableCell>{p.transactionId || "N/A"}</TableCell>
                  <TableCell>{p.paymentMethod || "N/A"}</TableCell>
                  <TableCell>{p.paymentType.replace("_", " ")}</TableCell>
                  <TableCell>
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        p.status === "pending"
                          ? "bg-yellow-500"
                          : p.status === "completed"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {p.status}
                    </span>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentList;
