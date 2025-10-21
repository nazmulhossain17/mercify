import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';
import { useState, useEffect } from 'react';

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
  note?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  decisionDate?: string;
}

interface LoanApiResponse {
  success: boolean;
  applications?: LoanApplication[]; // when returning multiple
  application?: LoanApplication;    // when returning single
}

export const useLoanMemberData = () => {
  const user = useAppSelector(selectUser);
  const memberId = user?.id || '';
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;

    const fetchLoanData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/loan/${memberId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LoanApiResponse = await response.json();

        // handle both single or multiple results
        if (data.success) {
          if (data.applications && data.applications.length > 0) {
            setLoanData(data.applications[0]); // take latest
          } else if (data.application) {
            setLoanData(data.application);
          } else {
            setLoanData(null);
          }
        } else {
          setLoanData(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching loan data'
        );
        setLoanData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [memberId]);

  return { loanData, loading, error };
};