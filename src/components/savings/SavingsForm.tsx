/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "../ui/label";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  Hash,
} from "lucide-react";

interface SavingFormData {
  savings_amount: string;
  payment_method: string;
  transaction_id: string;
}

export default function SavingsForm() {
  const [formData, setFormData] = useState<SavingFormData>({
    savings_amount: "",
    payment_method: "",
    transaction_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<SavingFormData>>({});
  const user = useAppSelector(selectUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof SavingFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<SavingFormData> = {};

    if (
      !formData.savings_amount ||
      Number.parseFloat(formData.savings_amount) <= 0
    ) {
      newErrors.savings_amount = "Please enter a valid amount";
    }

    if (!formData.payment_method.trim()) {
      newErrors.payment_method = "Payment method is required";
    }

    if (!formData.transaction_id.trim()) {
      newErrors.transaction_id = "Transaction ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if user is logged in
    if (!user?.id) {
      alert("You must be logged in to create savings");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const requestBody = {
        savings_amount: formData.savings_amount,
        payment_method: formData.payment_method,
        transactionId: formData.transaction_id,
        memberId: user.id, // Add the memberId from the logged-in user
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/savings/create-savings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.message || "Failed to create savings"}`);
      } else {
        setSuccess(true);
        setFormData({
          savings_amount: "",
          payment_method: "",
          transaction_id: "",
        });

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-4 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-5 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-3 sm:mb-4 md:mb-6"
          >
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
          </motion.div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-2">
            Savings Contribution
          </h1>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-4 sm:mb-6 mx-3 sm:mx-0 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 font-medium text-sm sm:text-base">
                Savings created successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <motion.div variants={cardVariants as any} className="mx-3 sm:mx-0">
          <Card className="shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl border-0 overflow-hidden backdrop-blur-sm bg-white/95">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 sm:p-6 md:p-8">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </motion.div>
                Create Savings
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 sm:space-y-6 md:space-y-8"
              >
                {/* Savings Amount */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 sm:space-y-3"
                >
                  <Label
                    htmlFor="savings_amount"
                    className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base"
                  >
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    Savings Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="savings_amount"
                      name="savings_amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.savings_amount}
                      onChange={handleChange}
                      required
                      className={`w-full py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 text-sm sm:text-base md:text-lg border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:scale-[1.01] sm:focus:scale-[1.02] bg-white/80 backdrop-blur-sm ${
                        errors.savings_amount
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300"
                      } placeholder:text-gray-400 text-gray-800`}
                    />
                    {errors.savings_amount && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-5 sm:-bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs sm:text-sm"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {errors.savings_amount}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 sm:space-y-3"
                >
                  <Label
                    htmlFor="payment_method"
                    className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base"
                  >
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
                    Payment Method
                  </Label>
                  <div className="relative">
                    <Input
                      id="payment_method"
                      name="payment_method"
                      type="text"
                      placeholder="e.g. Bkash, Nagad, Bank"
                      value={formData.payment_method}
                      onChange={handleChange}
                      required
                      className={`w-full py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 text-sm sm:text-base md:text-lg border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:scale-[1.01] sm:focus:scale-[1.02] bg-white/80 backdrop-blur-sm ${
                        errors.payment_method
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-teal-200 focus:border-teal-500 focus:ring-teal-500/20 hover:border-teal-300"
                      } placeholder:text-gray-400 text-gray-800`}
                    />
                    {errors.payment_method && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-5 sm:-bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs sm:text-sm"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {errors.payment_method}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Transaction ID */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 sm:space-y-3"
                >
                  <Label
                    htmlFor="transaction_id"
                    className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600" />
                    Transaction ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="transaction_id"
                      name="transaction_id"
                      type="text"
                      placeholder="Enter transaction ID"
                      value={formData.transaction_id}
                      onChange={handleChange}
                      required
                      className={`w-full py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 text-sm sm:text-base md:text-lg border-2 rounded-lg sm:rounded-xl transition-all duration-300 focus:scale-[1.01] sm:focus:scale-[1.02] bg-white/80 backdrop-blur-sm ${
                        errors.transaction_id
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-emerald-300"
                      } placeholder:text-gray-400 text-gray-800`}
                    />
                    {errors.transaction_id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-5 sm:-bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs sm:text-sm"
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {errors.transaction_id}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={itemVariants}
                  className="pt-3 sm:pt-4 md:pt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 text-white font-semibold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2 sm:gap-3"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                              className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="submit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            Submit Savings
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 sm:mt-8 md:mt-12 text-xs sm:text-sm text-gray-500 px-4"
        >
          <p>Your savings are secure and processed instantly</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
