import { useEffect, useState } from "react";


type LoanBalanceResponse = {
  memberId: string;
  approvedBalance: number;
  rejectedBalance: number;
  latestTransaction?: {
    payment?: { amount?: number; status?: string } | null;
    scheduled?: { amount?: number; status?: string } | null;
  };
};

interface Props {
  memberId: string;
}

const LoanBalanceInfo: React.FC<Props> = ({ memberId }) => {
  const [loanBalance, setLoanBalance] = useState<LoanBalanceResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanBalance = async () => {
      if (!memberId) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/loan/updated-balance/${memberId}`
        );
        const data = await res.json();
        setLoanBalance(data);
      } catch (err) {
        console.error("Failed to fetch loan balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanBalance();
  }, [memberId]);

  if (loading) {
    return <p className="text-sm text-gray-500 mt-2">Loading loan balance...</p>;
  }

  if (!loanBalance) {
    return (
      <p className="text-sm text-gray-500 mt-2">
        No loan balance data available.
      </p>
    );
  }

  const { latestTransaction } = loanBalance;
  const payment = latestTransaction?.payment;
  const scheduled = latestTransaction?.scheduled;

  const getSign = (status?: string) => (status === "failed" ? "-" : "+");
  const getLineColor = (status?: string) =>
    status === "failed" ? "text-red-600" : "text-emerald-100";

  const paymentSign = getSign(payment?.status);
  const scheduledSign = getSign(scheduled?.status);

  const paymentColor = getLineColor(payment?.status);
  const scheduledColor = getLineColor(scheduled?.status);

  const paymentAmount = payment?.amount || 0;
  const scheduledAmount = scheduled?.amount || 0;

  return (
    <div className="mt-3 text-sm text-white">
      <div className="flex flex-col gap-1">
        {/* Payment line */}
        <p className={`font-semibold ${paymentColor}`}>
          {paymentSign}${paymentAmount.toLocaleString()}
        </p>

        {/* Scheduled line */}
        <p className={`font-semibold ${scheduledColor}`}>
          {scheduledSign}${scheduledAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default LoanBalanceInfo;