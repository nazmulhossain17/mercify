import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar } from "lucide-react";

type LoanPaymentResponse = {
  success: boolean;
  message: string;
  details?: {
    totalLoan: number;
    repaymentMonths: number;
    monthlyPayment: string;
    monthsPassed: number;
    monthsRemaining: number;
    nextDueDate: string;
  };
};

type LoanPaymentInfoProps = {
  memberId: string;
};

const LoanPaymentInfo: React.FC<LoanPaymentInfoProps> = ({ memberId }) => {
  const [data, setData] = useState<LoanPaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!memberId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/loan/monthly-payment/${memberId}`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching loan payment info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentInfo();
  }, [memberId]);

  if (loading) {
    return (
      <p className="text-sm text-emerald-100 animate-pulse">Checking loan payment...</p>
    );
  }

  if (!data?.success) {
    return (
      <p className="text-sm text-emerald-100">{data?.message || "No active loan"}</p>
    );
  }

  const { monthlyPayment, nextDueDate, monthsRemaining } = data.details || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between text-sm sm:text-base"
    >
      <div className="flex items-center gap-2 text-white">
        <DollarSign className="w-4 h-4" />
        <span>
          Monthly Payment:{" "}
          <span className="font-semibold text-red-500">${monthlyPayment}</span>
        </span>
      </div>

      <div className="flex items-center gap-1 text-emerald-100 text-xs sm:text-sm">
        <Calendar className="w-6 h-4" />
        <span>Due: {nextDueDate}</span>
        <span className="ml-2 text-emerald-50">
          ({monthsRemaining} months left)
        </span>
      </div>
    </motion.div>
  );
};

export default LoanPaymentInfo;
