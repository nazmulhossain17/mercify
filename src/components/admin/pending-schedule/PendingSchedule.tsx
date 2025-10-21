import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

type Schedule = {
  _id: string
  memberId: { fullName: string; email: string } | string
  applicationId: string
  accountName: string
  amount: number
  paymentMethod: string
  scheduleDate: string
  status: "processing" | "completed" | "failed"
  createdAt: string
  updatedAt: string
}

export default function ScheduleTable() {
  const [data, setData] = useState<Schedule[]>([])
  const [filteredData, setFilteredData] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // ✅ Fetch all scheduled payments
  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule-payment`)
      const result = await res.json()
      setData(result.scheduledPayments || [])
      setFilteredData(result.scheduledPayments || [])
    } catch (error) {
      console.error("Error fetching schedule data:", error)
      toast.error("Failed to load schedule data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ✅ Filter by ID
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredData(data.filter(item => item._id.toLowerCase().includes(term)))
    }
  }, [searchTerm, data])

  // ✅ Approve (completed) or Reject (failed)
  const handleAction = async (id: string, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "completed" : "failed"
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule-payment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Action failed")
      }

      const updated = await res.json()

      toast.success(`Payment ${action === "approve" ? "completed" : "failed"} successfully`)
      setData(prev =>
        prev.map(item =>
          item._id === id ? { ...item, status: updated.scheduledPayment.status } : item
        )
      )
    } catch (error) {
      console.error(error)
      toast.error(`Failed to ${action} payment`)
    }
  }

  return (
    <Card className="p-4 shadow-lg">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Scheduled Payments</h2>

          {/* 🔍 Search Input */}
          <Input
            placeholder="Search by ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Bank Account Name</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Schedule Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, i) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`border-b ${
                        new Date(item.scheduleDate).getTime() < new Date().setHours(0, 0, 0, 0)
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      <TableCell>{item._id.slice(0, 6)}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell>
                        {typeof item.memberId === "object"
                          ? `${item.memberId.fullName} (${item.memberId.email})`
                          : item.memberId}
                      </TableCell>
                      <TableCell>${item.amount}</TableCell>
                      <TableCell className="capitalize">{item.paymentMethod}</TableCell>
                      <TableCell>
                        {new Date(item.scheduleDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${
                            item.status === "completed"
                              ? "bg-green-600"
                              : item.status === "failed"
                              ? "bg-red-600"
                              : "bg-yellow-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(item._id, "approve")}
                          disabled={item.status === "completed" || item.status === "failed"}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(item._id, "reject")}
                          disabled={item.status === "completed" || item.status === "failed"}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                      No scheduled payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}