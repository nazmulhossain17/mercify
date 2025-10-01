/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

// type PaymentFormValues = {
//   customerName: string;
//   customerEmail: string;
//   applicationId: string;
//   amount: string;
//   paymentMethod: string;
//   transactionId: string;
// };

// export default function PaymentForm() {
//   const user = useAppSelector(selectUser);
//   const memberId = user?.id || "";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<PaymentFormValues>({
//     defaultValues: {
//       customerName: "",
//       customerEmail: "",
//       applicationId: "",
//       amount: "",
//       paymentMethod: "",
//       transactionId: "",
//     },
//   });

//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [apiError, setApiError] = useState<string | null>(null);

//   const onSubmit = async (data: PaymentFormValues) => {
//     if (!memberId) {
//       setApiError("User not found. Please log in again.");
//       return;
//     }

//     setApiError(null);
//     setSuccessMessage(null);

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/payment/pay`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...data, memberId }),
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         setApiError(result.error || "Payment failed. Please try again.");
//         return;
//       }

//       setSuccessMessage(result.message || "Payment successful!");
//       reset();
//     } catch (error: any) {
//       setApiError(error.message || "Something went wrong.");
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring" as const, stiffness: 300, damping: 24 },
//     },
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6 sm:p-8 space-y-6"
//     >
//       <motion.div
//         variants={itemVariants}
//         className="flex items-center gap-3 mb-6 mt-20"
//       >
//         <div className="bg-blue-600 text-white p-2 rounded-full">
//           <CreditCard className="h-6 w-6" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-blue-800">Payment Details</h2>
//           <p className="text-sm text-blue-500">
//             Enter your payment information below
//           </p>
//         </div>
//       </motion.div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Full Name */}
//         <motion.div variants={itemVariants}>
//           <Label htmlFor="customerName">Full Name</Label>
//           <Input
//             id="customerName"
//             {...register("customerName", { required: "Full name is required" })}
//             placeholder="John Doe"
//           />
//           {errors.customerName && (
//             <p className="text-sm text-red-600">
//               {errors.customerName.message}
//             </p>
//           )}
//         </motion.div>

//         {/* Email */}
//         <motion.div variants={itemVariants}>
//           <Label htmlFor="customerEmail">Email</Label>
//           <Input
//             id="customerEmail"
//             type="email"
//             {...register("customerEmail", {
//               required: "Email is required",
//               pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
//             })}
//             placeholder="john@example.com"
//           />
//           {errors.customerEmail && (
//             <p className="text-sm text-red-600">
//               {errors.customerEmail.message}
//             </p>
//           )}
//         </motion.div>

//         {/* Application ID */}
//         <motion.div variants={itemVariants}>
//           <Label htmlFor="applicationId">Application ID</Label>
//           <Input
//             id="applicationId"
//             {...register("applicationId", {
//               required: "Application ID is required",
//             })}
//             placeholder="APP-12345"
//           />
//           {errors.applicationId && (
//             <p className="text-sm text-red-600">
//               {errors.applicationId.message}
//             </p>
//           )}
//         </motion.div>

//         {/* Amount */}
//         <motion.div variants={itemVariants}>
//           <Label htmlFor="amount">Amount</Label>
//           <Input
//             id="amount"
//             type="number"
//             {...register("amount", {
//               required: "Amount is required",
//               validate: (val) =>
//                 Number(val) > 0 || "Please enter a valid amount",
//             })}
//             placeholder="100.00"
//           />
//           {errors.amount && (
//             <p className="text-sm text-red-600">{errors.amount.message}</p>
//           )}
//         </motion.div>

//         {/* Transaction ID */}
//         <motion.div variants={itemVariants}>
//           <Label htmlFor="transactionId">Transaction ID</Label>
//           <Input
//             id="transactionId"
//             {...register("transactionId", {
//               required: "Transaction ID is required",
//             })}
//             placeholder="TXN-98765"
//           />
//           {errors.transactionId && (
//             <p className="text-sm text-red-600">
//               {errors.transactionId.message}
//             </p>
//           )}
//         </motion.div>

//         {/* Payment Method (simple input field) */}
//         <motion.div variants={itemVariants}>
//           <Label htmlFor="paymentMethod">Payment Method</Label>
//           <Input
//             id="paymentMethod"
//             {...register("paymentMethod", {
//               required: "Payment method is required",
//             })}
//             placeholder="e.g. card, paypal, bank"
//           />
//           {errors.paymentMethod && (
//             <p className="text-sm text-red-600">
//               {errors.paymentMethod.message}
//             </p>
//           )}
//         </motion.div>

//         {/* Secure Payment Info */}
//         <motion.div
//           variants={itemVariants}
//           className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
//         >
//           <Shield className="h-5 w-5 text-green-600 mt-0.5" />
//           <div>
//             <h4 className="font-semibold text-green-800">Secure Payment</h4>
//             <p className="text-sm text-green-700">
//               Your payment is processed securely. No data is stored on our
//               servers.
//             </p>
//           </div>
//         </motion.div>

//         {/* Success/Error messages */}
//         {apiError && (
//           <p className="text-red-600 bg-red-100 p-2 rounded">{apiError}</p>
//         )}
//         {successMessage && (
//           <p className="text-green-600 bg-green-100 p-2 rounded">
//             {successMessage}
//           </p>
//         )}

//         {/* Submit */}
//         <motion.div variants={itemVariants}>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-3"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="h-5 w-5 mr-2" />
//                 Submit Payment
//               </>
//             )}
//           </Button>
//         </motion.div>
//       </form>
//     </motion.div>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaymentForm: React.FC = () => {
  const member = useAppSelector(selectUser);
  // console.log(member?.id);
  const applicationID = member?.applicationId || "";
  const [paymentType, setPaymentType] = useState("monthly_savings");
  const [formData, setFormData] = useState<any>({
    savings_amount: "",
    transactionId: "",
    payment_method: "",
    totalAmount: "",
    donorFirstName: "",
    donorLastName: "",
    email: "",
    message: "",
    applicationId: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (paymentType === "monthly_savings") {
        const requestBody = {
          memberId: member?.id,
          savings_amount: formData.savings_amount,
          transactionId: formData.transactionId,
          payment_method: formData.payment_method,
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
        console.log("Savings Response:", data);
      } else if (paymentType === "donation") {
        const requestBody = {
          totalAmount: parseFloat(formData.totalAmount),
          donorFirstName: formData.donorFirstName,
          donorLastName: formData.donorLastName,
          email: formData.email,
          message: formData.message,
          paymentMethod: formData.payment_method,
          transactionId: formData.transactionId,
        };

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/donation/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await res.json();
        console.log("✅ Donation Response:", data);
      } else if (paymentType === "admin_fee") {
        // ✅ Admin Fee API
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/adminfee`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: formData.amount,
              memberId: member?.id, // make sure you collect memberId
              paymentMethod: formData.payment_method,
              transactionId: formData.transactionId,
            }),
          }
        );
        const data = await res.json();
        console.log("Admin Fee response:", data);
        alert("Admin fee submitted!");
      } else if (paymentType === "loan") {
        // later: integrate application fee API
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payment/pay`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: formData.amount,
              memberId: member?.id, // make sure you collect memberId
              applicationId: applicationID,
              paymentMethod: formData.payment_method,
              transactionId: formData.transactionId,
            }),
          }
        );
        const data = await res.json();
        console.log("Loan Response:", data);
        alert("Loan payment submitted!");
      } else {
        console.log("Other payment type selected:", paymentType, formData);
        // later: integrate other APIs
      }
    } catch (error) {
      console.error("❌ Payment submission failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Payment Page
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Payment Type Select */}
              <div>
                <Label>Select Payment Type</Label>
                <Select
                  value={paymentType}
                  onValueChange={(val) => setPaymentType(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly_savings">
                      Monthly Savings
                    </SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="loan">Loan Payment</SelectItem>
                    <SelectItem value="admin_fee">Admin Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monthly Savings */}
              {paymentType === "monthly_savings" && (
                <>
                  <div>
                    <Label>Savings Amount</Label>
                    <Input
                      name="savings_amount"
                      value={formData.savings_amount}
                      onChange={handleChange}
                      placeholder="Enter savings amount"
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(val) =>
                        handleSelectChange("payment_method", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </>
              )}

              {/* Donation */}
              {paymentType === "donation" && (
                <>
                  <div>
                    <Label>Total Amount</Label>
                    <Input
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      placeholder="Enter donation amount"
                    />
                  </div>
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="donorFirstName"
                      value={formData.donorFirstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="donorLastName"
                      value={formData.donorLastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Input
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Optional message"
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(val) =>
                        handleSelectChange("payment_method", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </>
              )}

              {/* Loan Payment */}
              {paymentType === "loan" && (
                <>
                  {/* <div>
                    <Label>Application ID</Label>
                    <Input
                      name="applicationId"
                      value={formData.applicationId}
                      onChange={handleChange}
                      placeholder="Enter application ID"
                    />
                  </div> */}
                  <div>
                    <Label>Amount</Label>
                    <Input
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter loan amount"
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(val) =>
                        handleSelectChange("payment_method", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </>
              )}

              {/* Admin Fee */}
              {paymentType === "admin_fee" && (
                <>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter fee amount"
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(val) =>
                        handleSelectChange("payment_method", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                    />
                  </div>
                </>
              )}

              {/* ✅ Always show submit button */}
              <Button type="submit" className="w-full">
                Submit Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentForm;
