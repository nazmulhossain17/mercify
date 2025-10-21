import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Member {
  _id: string;
  fullName: string;
  email: string;
}

interface Saving {
  _id: string;
  memberId: Member;
  savings_amount: number;
  transactionId: string;
  status: "pending" | "completed" | "failed";
  payment_method: string;
  entryDate: string;
}

const PendingSavings: React.FC = () => {
  const [savings, setSavings] = useState<Saving[]>([])
  const [filteredSavings, setFilteredSavings] = useState<Saving[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // ✅ Fetch savings
  const fetchSavings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/savings`)
      const list = res.data.savings || res.data.scheduledPayments || []
      setSavings(list)
      setFilteredSavings(list)
    } catch (err) {
      console.error("Error fetching savings:", err)
      toast.error("Failed to fetch savings data")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Handle approve/reject
  const handleUpdateStatus = async (id: string, newStatus: "completed" | "failed") => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/savings/${id}`, { status: newStatus })
      toast.success(`Saving marked as ${newStatus}`)
      fetchSavings()
    } catch (err) {
      console.error("Error updating saving:", err)
      toast.error("Failed to update status")
    }
  }

  // ✅ Fetch on mount
  useEffect(() => {
    fetchSavings()
  }, [])

  // ✅ Filter when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSavings(savings)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredSavings(
        savings.filter((s) => s.transactionId?.toLowerCase().includes(term))
      )
    }
  }, [searchTerm, savings])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Savings Overview
          </CardTitle>

          {/* 🔍 Search Input */}
          <Input
            placeholder="Search by Transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading savings...</p>
          ) : filteredSavings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No savings found</p>
          ) : (
            <Table>
              <TableCaption>List of all member savings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSavings.map((saving) => (
                  <motion.tr
                    key={saving._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{saving.memberId?._id || "Unknown"}</TableCell>
                    <TableCell>{saving.memberId?.fullName || "Unknown"}</TableCell>
                    <TableCell>${saving.savings_amount}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {saving.transactionId}
                      </span>
                    </TableCell>
                    <TableCell>{saving.payment_method}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          saving.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : saving.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {saving.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(saving.entryDate).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        disabled={saving.status !== "pending"}
                        onClick={() => handleUpdateStatus(saving._id, "completed")}
                      >
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        disabled={saving.status !== "pending"}
                        onClick={() => handleUpdateStatus(saving._id, "failed")}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default PendingSavings