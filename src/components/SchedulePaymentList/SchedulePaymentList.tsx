import { deleteScheduledPayment, getScheduledPaymentsByMemberId } from "@/api/schedulePayments";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

const ScheduledPaymentList = () => {
  const member = useAppSelector(selectUser);
  const memberId = member?.id;
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!memberId || !isOpen) return;

    const fetchPayments = async () => {
      try {
        const data = await getScheduledPaymentsByMemberId(memberId);
        setPayments(data);
      } catch (error) {
        toast.error("Failed to fetch scheduled payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [memberId, isOpen]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheduled payment?")) return;

    try {
      await deleteScheduledPayment(id);
      setPayments((prev) => prev.filter((p) => p._id !== id));
      toast.success("Scheduled payment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete scheduled payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          MY Scheduled Payments
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scheduled Payments</DialogTitle>
          <DialogDescription>
            Manage your scheduled payments. You can view and delete scheduled payments here.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading ? (
            <p className="text-center py-4">Loading scheduled payments...</p>
          ) : payments.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No scheduled payments found.</p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment._id}
                className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm"
              >
                <div className="flex-1">
                  <p><strong>Account:</strong> {payment.accountName}</p>
                  <p><strong>Amount:</strong> ${payment.amount}</p>
                  <p><strong>Status:</strong> {payment.status}</p>
                  <p><strong>Payment Type:</strong> {payment.paymentType}</p>
                  <p><strong>Scheduled Date:</strong> {new Date(payment.scheduleDate).toLocaleDateString()}</p>
                </div>

                <Button
                  onClick={() => handleDelete(payment._id)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledPaymentList;