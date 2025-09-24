/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormData } from "@/pages/membership/MemberShipForm";
import { submitMembershipForm } from "@/lib/membership-api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PaymentStepProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onPrev: () => void;
}

export function PaymentStep({ data, updateData, onPrev }: PaymentStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", data);

      const result = await submitMembershipForm(data);

      toast.success("Membership form submitted successfully!");
      console.log("Form submission result:", result);

      // You could redirect to a success page or show a success modal here
      alert(
        "Membership form submitted successfully! please wait for admin approval."
      );
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="paymentAmount" className="text-sm font-medium">
                Application Amount <span className="text-red-500">*</span>
              </Label>
              <Input
                id="paymentAmount"
                type="number"
                placeholder="50.00"
                value={data.paymentAmount}
                onChange={(e) => updateData({ paymentAmount: e.target.value })}
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum payment: $50.00
              </p>
            </div>

            <div>
              <Label
                htmlFor="paypalTransactionNumber"
                className="text-sm font-medium"
              >
                PayPal Transaction Number{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="paypalTransactionNumber"
                placeholder="Enter PayPal transaction ID"
                value={data.paypalTransactionNumber}
                onChange={(e) =>
                  updateData({ paypalTransactionNumber: e.target.value })
                }
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please complete your PayPal payment first, then enter the
                transaction ID here
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Payment Instructions
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>
                  Send your payment via PayPal to: mercyfinancials@gmail.com
                </li>
                <li>Include "Membership Fee" in the payment note</li>
                <li>Copy the transaction ID from PayPal</li>
                <li>Paste the transaction ID in the field above</li>
                <li>Submit this form to complete your membership</li>
              </ol>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onPrev}>
                Previous
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={
                  isSubmitting ||
                  !data.paymentAmount ||
                  !data.paypalTransactionNumber
                }
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Submitting..." : "Complete Membership"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
