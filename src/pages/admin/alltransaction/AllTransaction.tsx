import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Download, Filter, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {motion} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


interface Transaction {
  type: string;
  amount: number;
  paymentMethod?: string; // Made optional
  status?: string;
  transactionId: string;
  member?: {
    _id: string;
    email: string;
  };
  donor?: string;
  date: string;
}

interface ApiResponse {
  success: boolean;
  total: number;
  data: Transaction[];
}

const AllTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/all-transactions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setTransactions(data.data || []); // Ensure data is an array
      } else {
        throw new Error("Failed to fetch transactions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTransactions([]); // Reset transactions on error
    } finally {
      setLoading(false);
    }
  };

  // Safe string conversion with null checks
  const safeToString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value).toLowerCase();
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      safeToString(transaction.transactionId).includes(searchLower) ||
      safeToString(transaction.member?.email).includes(searchLower) ||
      safeToString(transaction.donor).includes(searchLower) ||
      safeToString(transaction.type).includes(searchLower) ||
      safeToString(transaction.paymentMethod).includes(searchLower);

    const matchesStatus = 
      statusFilter === "all" || 
      transaction.status === statusFilter ||
      (statusFilter === "none" && !transaction.status);

    const matchesType = 
      typeFilter === "all" || 
      transaction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status?: string) => {
    if (!status) return <AlertCircle className="h-4 w-4 text-gray-500" />;
    
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status?: string) => {
    if (!status) return "outline";
    
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentMethodDisplay = (paymentMethod?: string) => {
    if (!paymentMethod) return "-";
    return paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Transactions</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl font-bold">All Transactions</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Total: {transactions.length} transactions</span>
                <button className="flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-accent">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, email, donor, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="none">Guest Payment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Saving">Saving</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Admin Fee">Admin Fee</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Scheduled Payment">Scheduled Payment</SelectItem>
                    <SelectItem value="Mercify Balance">Mercify Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Payment Method</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Transaction ID</TableHead>
                    <TableHead className="hidden xl:table-cell">User/Donor</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {transactions.length === 0 ? "No transactions available" : "No transactions match your filters"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={`${transaction.transactionId}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {transaction.type || "Unknown Type"}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(transaction.amount || 0)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {getPaymentMethodDisplay(transaction.paymentMethod)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.status ? (
                            <Badge variant={getStatusVariant(transaction.status)} className="flex items-center gap-1 w-fit">
                              {getStatusIcon(transaction.status)}
                              {transaction.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              {getStatusIcon()}
                              Guest Payment
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs">
                          {transaction.transactionId || "No ID"}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {transaction.member ? (
                            <div>
                              <div className="font-medium">{transaction.member.email || "No email"}</div>
                              <div className="text-xs text-muted-foreground">
                                {transaction.member._id ? transaction.member._id.slice(-8) : "No ID"}
                              </div>
                            </div>
                          ) : transaction.donor ? (
                            <div className="font-medium">{transaction.donor}</div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(transaction.date)}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards for small screens */}
            <div className="sm:hidden space-y-4 mt-4">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={`${transaction.transactionId}-mobile-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{transaction.type || "Unknown Type"}</h3>
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(transaction.amount || 0)}
                          </p>
                        </div>
                        {transaction.status && (
                          <Badge variant={getStatusVariant(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Payment:</span>
                          <p>{getPaymentMethodDisplay(transaction.paymentMethod)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <p className="font-mono text-xs truncate">
                            {transaction.transactionId || "No ID"}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">User:</span>
                        <p>
                          {transaction.member 
                            ? (transaction.member.email || "No email")
                            : transaction.donor 
                            ? transaction.donor
                            : "-"
                          }
                        </p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AllTransaction;