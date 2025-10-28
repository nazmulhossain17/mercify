import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";
import ScheduledPaymentList from "@/components/SchedulePaymentList/SchedulePaymentList";
import { toast } from "sonner";



const PaymentForm: React.FC = () => {
  const member = useAppSelector(selectUser);
  const applicationID = member?.applicationId || "";

  const [isSchedulePayment, setIsSchedulePayment] = useState(false);
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

  const [scheduleForm, setScheduleForm] = useState({
    accountName: "",
    amount: "",
    scheduleDate: "",
    applicationId: "",
    paymentMethod: "",
    paymentType: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value });
  };

  const handleScheduleSelect = (field: string, value: string) => {
    setScheduleForm({ ...scheduleForm, [field]: value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // ✅ Schedule Payment First
    if (isSchedulePayment) {
      if (
        !scheduleForm.accountName ||
        !scheduleForm.amount ||
        !scheduleForm.scheduleDate ||
        !scheduleForm.paymentMethod ||
        !scheduleForm.paymentType
      ) {
        toast.error("Please fill all schedule payment fields");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/schedule-payment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: member?.id,
            applicationId: applicationID,
            accountName: scheduleForm.accountName,
            amount: scheduleForm.amount,
            scheduleDate: scheduleForm.scheduleDate,
            paymentMethod: scheduleForm.paymentMethod,
            paymentType: scheduleForm.paymentType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to schedule payment");
      }

      console.log("🗓 Schedule Payment Response:", data);
      toast.success("Payment scheduled successfully!");

      // Reset schedule form
      setScheduleForm({
        accountName: "",
        amount: "",
        scheduleDate: "",
        applicationId: "",
        paymentMethod: "",
        paymentType: "",
      });

      return;
    }

    // ✅ Donation Payment
    if (paymentType === "donation") {
      if (
        !formData.totalAmount ||
        !formData.donorFirstName ||
        !formData.donorLastName ||
        !formData.email ||
        !formData.payment_method ||
        !formData.transactionId
      ) {
        toast.error("Please fill all donation fields");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/donation/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalAmount: parseFloat(formData.totalAmount),
            donorFirstName: formData.donorFirstName,
            donorLastName: formData.donorLastName,
            email: formData.email,
            message: formData.message,
            paymentMethod: formData.payment_method,
            transactionId: formData.transactionId,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Donation failed");

      console.log("🎁 Donation Response:", data);
      toast.success("Donation successful!");

      // Reset donation form
      setFormData({
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

      return;
    }

    // ✅ Normal Payments (Loan, Savings, Admin Fee)
    if (!formData.payment_method || !formData.transactionId) {
      toast.error("Please fill all required fields");
      return;
    }

    let amount = 0;
    if (paymentType === "monthly_savings") {
      if (!formData.savings_amount) {
        toast.error("Please enter savings amount");
        return;
      }
      amount = parseFloat(formData.savings_amount);
    } else if (paymentType === "loan" || paymentType === "admin_fee") {
      if (!formData.amount) {
        toast.error("Please enter amount");
        return;
      }
      amount = parseFloat(formData.amount);
    }

    // 🔗 API for Loan, Savings, or Admin Fee
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payment/pay`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: member?.id,
          applicationId:applicationID,
          amount,
          paymentMethod: formData.payment_method,
          transactionId: formData.transactionId,
          paymentType: paymentType, // "loan" | "monthly_savings" | "admin_fee"
        }),
      }
    );

    const data = await res.json();
    console.log("💰 Payment Response:", data);

    if (!res.ok) {
      throw new Error(data.error || "Payment submission failed");
    }

    toast.success(data.message || "Payment submitted successfully!");

    // Reset normal payment form
    setFormData({
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

  } catch (error: any) {
    console.error("Payment submission error:", error);
    toast.error(error.message || "Something went wrong during payment");
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
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {isSchedulePayment ? "Schedule Payment" : "Manual Payment Page"}
              </h2>
              <div className="flex gap-2">
                {/* Show View Scheduled Payments button only in schedule payment mode */}
                {isSchedulePayment && <ScheduledPaymentList />}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSchedulePayment(!isSchedulePayment)}
                >
                  {isSchedulePayment ? "Manual Payment" : "Schedule Payment"}
                </Button>
              </div>
            </div>

            {!isSchedulePayment ? (
              // Once Payment Form
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
                      <Label>Savings Amount *</Label>
                      <Input
                        name="savings_amount"
                        value={formData.savings_amount}
                        onChange={handleChange}
                        placeholder="Enter savings amount"
                        required
                      />
                    </div>
                    <div>
                      <Label>Payment Method *</Label>
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
                      <Label>Note</Label>
                      <Input
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="Enter note"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Donation */}
                {paymentType === "donation" && (
                  <>
                    <div>
                      <Label>Total Amount *</Label>
                      <Input
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        placeholder="Enter donation amount"
                        required
                      />
                    </div>
                    <div>
                      <Label>First Name *</Label>
                      <Input
                        name="donorFirstName"
                        value={formData.donorFirstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input
                        name="donorLastName"
                        value={formData.donorLastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
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
                      <Label>Payment Method *</Label>
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
                      <Label>Note</Label>
                      <Input
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="Enter note"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Loan */}
                {paymentType === "loan" && (
                  <>
                    <div>
                      <Label>Amount *</Label>
                      <Input
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter loan amount"
                        required
                      />
                    </div>
                    <div>
                      <Label>Payment Method *</Label>
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
                      <Label>Note</Label>
                      <Input
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="Enter note"
                        required
                      />
                    </div>
                  </>
                )}

                {/* Admin Fee */}
                {paymentType === "admin_fee" && (
                  <>
                    <div>
                      <Label>Amount *</Label>
                      <Input
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter fee amount"
                        required
                      />
                    </div>
                    <div>
                      <Label>Payment Method *</Label>
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
                      <Label>Note</Label>
                      <Input
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="Enter note"
                        required
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full">
                  Submit Payment
                </Button>
              </form>
            ) : (
              // Schedule Payment Form
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Payment Type */}
                <div className="space-y-2">
                  <Label>Select Payment Type *</Label>
                  <Select
                    value={scheduleForm.paymentType}
                    onValueChange={(val) => handleScheduleSelect("paymentType", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan">Loan Payment</SelectItem>
                      <SelectItem value="monthly_savings">Monthly Savings</SelectItem>
                      <SelectItem value="admin_fee">Admin Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Name */}
                <div>
                  <Label>Account Name *</Label>
                  <Input
                    name="accountName"
                    value={scheduleForm.accountName}
                    onChange={handleScheduleChange}
                    placeholder="Enter account name"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label>Amount *</Label>
                  <Input
                    name="amount"
                    value={scheduleForm.amount}
                    onChange={handleScheduleChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                {/* Schedule Date */}
                <div>
                  <Label>Schedule Date *</Label>
                  <Input
                    type="date"
                    name="scheduleDate"
                    value={scheduleForm.scheduleDate}
                    onChange={handleScheduleChange}
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <Label>Payment Method *</Label>
                  <Select
                    value={scheduleForm.paymentMethod}
                    onValueChange={(val) => handleScheduleSelect("paymentMethod", val)}
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

                <Button type="submit" className="w-full">
                  Schedule Payment
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentForm;