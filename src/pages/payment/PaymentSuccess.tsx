import { motion } from "framer-motion";
import {
  Check,
  Download,
  RefreshCw,
  CreditCard,
  Calendar,
  Hash,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaymentResponse {
  id: string;
  applicationId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

interface PaymentSuccessProps {
  payment: PaymentResponse;
  onReset: () => void;
}

export default function PaymentSuccess({
  payment,
  onReset,
}: PaymentSuccessProps) {
  const handleDownloadReceipt = () => {
    const receiptData = {
      paymentId: payment.id,
      applicationId: payment.applicationId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      customerName: payment.customerName,
      customerEmail: payment.customerEmail,
      status: payment.status,
      date: new Date(payment.date).toLocaleString(),
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `payment-receipt-${payment.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const checkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 10,
        delay: 0.2,
      },
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "paypal":
        return "PayPal";
      case "bank":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
        <motion.div
          variants={checkVariants}
          className="inline-flex items-center justify-center mb-4"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <Check className="h-12 w-12 text-white" />
          </div>
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-bold text-white mb-2"
        >
          Payment Successful!
        </motion.h2>
        <motion.p variants={itemVariants} className="text-green-100">
          Your payment has been processed successfully
        </motion.p>
      </div>

      {/* Payment Details */}
      <div className="p-6">
        <motion.div variants={containerVariants} className="space-y-6">
          {/* Transaction Summary */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transaction Summary
              </h3>
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                ${payment.amount.toLocaleString()}
              </div>
              <Badge
                className={`${
                  payment.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {payment.status.charAt(0).toUpperCase() +
                  payment.status.slice(1)}
              </Badge>
            </div>
          </motion.div>

          {/* Payment Details Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Payment ID</span>
              </div>
              <p className="text-gray-900 font-mono text-sm">{payment.id}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Application ID
                </span>
              </div>
              <p className="text-gray-900 font-mono text-sm">
                {payment.applicationId}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Payment Method
                </span>
              </div>
              <p className="text-gray-900">
                {getPaymentMethodDisplay(payment.paymentMethod)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Transaction ID
                </span>
              </div>
              <p className="text-gray-900 font-mono text-sm">
                {payment.transactionId}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Customer Name</span>
              </div>
              <p className="text-gray-900">{payment.customerName}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Email</span>
              </div>
              <p className="text-gray-900">{payment.customerEmail}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Transaction Date
                </span>
              </div>
              <p className="text-gray-900">{formatDate(payment.date)}</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            variants={itemVariants}
            className="bg-blue-50 rounded-lg p-4"
          >
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • A confirmation email has been sent to {payment.customerEmail}
              </li>
              <li>• Your payment will be processed within 1-2 business days</li>
              <li>• You can track your application status in your dashboard</li>
              <li>• Keep your payment ID for future reference</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
