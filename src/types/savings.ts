export interface SavingFormData {
  savings_amount: number | string; // Allow string input from form, convert to number before API call
  transactionId: string;
  payment_method: string;
}

export interface Saving {
  _id: string;
  member: string;
  savings_amount: number;
  transactionId: string;
  payment_method: string;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsState {
  savings: Saving[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}
