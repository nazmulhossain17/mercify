import { useState, useEffect } from "react";

interface LoanApplication {
  _id: string;
  memberId: {
    _id: string;
    fullName: string;
    email: string;
  };
  amountRequested: number;
  status: string;
  documentUrl: string;
  purpose: string;
  applicationDate: string;
  note: string;
  repaymentDeadline: string;
  createdAt: string;
  updatedAt: string;
}

interface LoanApiResponse {
  success: boolean;
  applications: LoanApplication[];
}

export const useLoanData = (memberId: string | undefined) => {
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;

    const fetchLoanData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/loan`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data: LoanApiResponse = await response.json();

        if (data.success) {
          // 🔍 Filter only loans belonging to the logged-in member
          const memberLoans = data.applications.filter(
            (app) => app.memberId?._id === memberId
          );

          // Pick the latest loan if multiple exist
          if (memberLoans.length > 0) {
            setLoanData(memberLoans[0]);
          } else {
            setLoanData(null);
          }
        } else {
          setLoanData(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching loan data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [memberId]);

  return { loanData, loading, error };
};
