import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";
import { Loader2 } from "lucide-react";

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
}

export interface TransactionFormData {
  amount: number;
  description: string;
  type: "deposit" | "withdrawal";
}

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

const SavingWithdrawPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", name: "Savings Account", balance: 1000, currency: "USD" },
  ]);
  console.log(setAccounts);

  const [selectedAccount, setSelectedAccount] = useState<Account>(accounts[0]);
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    description: "",
    type: "withdrawal",
  });
  console.log(setSelectedAccount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const user = useAppSelector(selectUser);
  console.log(user);
  const memberid = user?.id || "";
  const [memberSavings, setMemberSavings] = useState<number | null>(null);

  // ✅ Fetch current savings
  useEffect(() => {
    const fetchMemberSavings = async () => {
      if (user?.id) {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/savings/total-savings/${memberid}`
          );
          const data = await response.json();
          setMemberSavings(data?.totalSavings);
        } catch (error) {
          console.error("Failed to fetch member savings:", error);
        }
      }
    };
    fetchMemberSavings();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  // const handleAccountChange = (value: string) => {
  //   const account = accounts.find((acc) => acc.id === value);
  //   if (account) setSelectedAccount(account);
  // };

  // ✅ Withdraw API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/savings/savings-withdraw/${memberid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: formData.amount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to withdraw savings");
      }

      const data = await response.json();

      // Add new transaction record
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "withdrawal",
        amount: formData.amount,
        date: new Date(),
        description: formData.description,
        status: "completed",
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      // Update savings balance from API response if provided
      if (data?.updatedSavings !== undefined) {
        setMemberSavings(data.updatedSavings);
      } else {
        setMemberSavings((prev) =>
          prev !== null ? prev - formData.amount : null
        );
      }

      // Reset form
      setFormData({
        amount: 0,
        description: "",
        type: "withdrawal",
      });
    } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Withdraw failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex justify-center"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Savings Withdraw
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your savings account transactions
          </p>
        </motion.div>

        {/* Withdraw Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>New Withdrawal</CardTitle>
              <CardDescription>
                Current Savings:{" "}
                <span className="font-semibold text-gray-900">
                  {memberSavings !== null ? `$${memberSavings}` : "Loading..."}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="amount">
                    Amount ({selectedAccount.currency})
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount || ""}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Enter transaction description"
                    className="mt-1 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || formData.amount <= 0}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Confirm Withdraw"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions History */}
        {transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <li
                      key={tx.id}
                      className="py-3 flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {tx.description}
                        </p>
                        <p className="text-gray-500">
                          {tx.date.toLocaleDateString()} – {tx.status}
                        </p>
                      </div>
                      <p
                        className={`font-semibold ${
                          tx.type === "deposit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SavingWithdrawPage;
