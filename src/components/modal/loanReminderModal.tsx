import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface LoanApplication {
  _id: string;
  memberId: {
    _id: string;
    fullName: string;
    email: string;
  };
  amountRequested: number;
  status: "pending" | "approved" | "rejected";
  documentUrl: string;
  purpose: string;
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  decisionDate?: string;
}

export default function LoanReminderModal({ memberId }: { memberId: string }) {
  const [showReminder, setShowReminder] = useState(false);
  const [loan, setLoan] = useState<LoanApplication | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/loan`);

        const myLoans = res.data.applications.filter(
          (app: LoanApplication) =>
            app.status === "approved" && app.memberId._id === memberId
        );

        if (myLoans.length > 0) {
          setLoan(myLoans[0]); // take latest active loan
          setShowReminder(true);
        }
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    if (memberId) {
      fetchLoans();
    }
  }, [memberId]);

  if (!loan) return null;

  return (
    <Dialog open={showReminder} onOpenChange={setShowReminder}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Loan Repayment Reminder</DialogTitle>
          <DialogDescription>
            You have an active loan of <strong>${loan.amountRequested}</strong>.
            Please make sure to pay it on time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowReminder(false)}>
            Dismiss
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard/payment")}
            className="cursor-pointer"
          >
            Pay Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
