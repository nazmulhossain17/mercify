/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

type PaymentFormValues = {
  customerName: string;
  customerEmail: string;
  applicationId: string;
  amount: string;
  paymentMethod: string;
  transactionId: string;
};

export default function PaymentForm() {
  const user = useAppSelector(selectUser);
  const memberId = user?.id || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentFormValues>({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      applicationId: "",
      amount: "",
      paymentMethod: "",
      transactionId: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: PaymentFormValues) => {
    if (!memberId) {
      setApiError("User not found. Please log in again.");
      return;
    }

    setApiError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, memberId }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setApiError(result.error || "Payment failed. Please try again.");
        return;
      }

      setSuccessMessage(result.message || "Payment successful!");
      reset();
    } catch (error: any) {
      setApiError(error.message || "Something went wrong.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6 sm:p-8 space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-6 mt-20"
      >
        <div className="bg-blue-600 text-white p-2 rounded-full">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-800">Payment Details</h2>
          <p className="text-sm text-blue-500">
            Enter your payment information below
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <motion.div variants={itemVariants}>
          <Label htmlFor="customerName">Full Name</Label>
          <Input
            id="customerName"
            {...register("customerName", { required: "Full name is required" })}
            placeholder="John Doe"
          />
          {errors.customerName && (
            <p className="text-sm text-red-600">
              {errors.customerName.message}
            </p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants}>
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            {...register("customerEmail", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })}
            placeholder="john@example.com"
          />
          {errors.customerEmail && (
            <p className="text-sm text-red-600">
              {errors.customerEmail.message}
            </p>
          )}
        </motion.div>

        {/* Application ID */}
        <motion.div variants={itemVariants}>
          <Label htmlFor="applicationId">Application ID</Label>
          <Input
            id="applicationId"
            {...register("applicationId", {
              required: "Application ID is required",
            })}
            placeholder="APP-12345"
          />
          {errors.applicationId && (
            <p className="text-sm text-red-600">
              {errors.applicationId.message}
            </p>
          )}
        </motion.div>

        {/* Amount */}
        <motion.div variants={itemVariants}>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            {...register("amount", {
              required: "Amount is required",
              validate: (val) =>
                Number(val) > 0 || "Please enter a valid amount",
            })}
            placeholder="100.00"
          />
          {errors.amount && (
            <p className="text-sm text-red-600">{errors.amount.message}</p>
          )}
        </motion.div>

        {/* Transaction ID */}
        <motion.div variants={itemVariants}>
          <Label htmlFor="transactionId">Transaction ID</Label>
          <Input
            id="transactionId"
            {...register("transactionId", {
              required: "Transaction ID is required",
            })}
            placeholder="TXN-98765"
          />
          {errors.transactionId && (
            <p className="text-sm text-red-600">
              {errors.transactionId.message}
            </p>
          )}
        </motion.div>

        {/* Payment Method (simple input field) */}
        <motion.div variants={itemVariants}>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Input
            id="paymentMethod"
            {...register("paymentMethod", {
              required: "Payment method is required",
            })}
            placeholder="e.g. card, paypal, bank"
          />
          {errors.paymentMethod && (
            <p className="text-sm text-red-600">
              {errors.paymentMethod.message}
            </p>
          )}
        </motion.div>

        {/* Secure Payment Info */}
        <motion.div
          variants={itemVariants}
          className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Secure Payment</h4>
            <p className="text-sm text-green-700">
              Your payment is processed securely. No data is stored on our
              servers.
            </p>
          </div>
        </motion.div>

        {/* Success/Error messages */}
        {apiError && (
          <p className="text-red-600 bg-red-100 p-2 rounded">{apiError}</p>
        )}
        {successMessage && (
          <p className="text-green-600 bg-green-100 p-2 rounded">
            {successMessage}
          </p>
        )}

        {/* Submit */}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Submit Payment
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
