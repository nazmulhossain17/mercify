/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Plus } from "lucide-react";
import { toast } from "sonner";

interface DashboardUser {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  hasAppliedForLoan?: boolean;
  lastApplicationDate?: string;
}

interface PaymentHistoryItem {
  id: number;
  date: string;
  amount: string;
  status: string;
  type: string;
}

interface PaymentsTabProps {
  user: DashboardUser;
  paymentHistory: PaymentHistoryItem[];
  itemVariants: any;
}

export default function PaymentsTab({
  user,
  paymentHistory,
  itemVariants,
}: PaymentsTabProps) {
  const generatePDFReceipt = (payment: PaymentHistoryItem) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            color: #10b981;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .receipt-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #1f2937; }
          .amount {
            font-size: 24px;
            font-weight: bold;
            color: #10b981;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 14px;
          }
          .status-badge {
            background: #dcfce7;
            color: #166534;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🤲 Mercy Financials</div>
          <h2>Payment Receipt</h2>
          <p>Receipt #QH-${payment.id.toString().padStart(6, "0")}</p>
        </div>
        
        <div class="receipt-info">
          <div class="info-row">
            <span class="label">Member Name:</span>
            <span class="value">${user?.fullName || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${user?.email || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Date:</span>
            <span class="value">${payment.date}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Type:</span>
            <span class="value">${payment.type}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value"><span class="status-badge">${
              payment.status
            }</span></span>
          </div>
        </div>
        
        <div class="amount">
          Amount Paid: ${payment.amount}
        </div>
        
        <div class="receipt-info">
          <h3 style="margin-top: 0; color: #374151;">Transaction Details</h3>
          <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span class="value">TXN-${Date.now().toString().slice(-8)}</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span class="value">Bank Transfer</span>
          </div>
          <div class="info-row">
            <span class="label">Processing Fee:</span>
            <span class="value">$0.00</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your contribution to Mercy Financials!</strong></p>
          <p>This is an automatically generated receipt. Please keep it for your records.</p>
          <p>For any queries, contact us at support@mercyfinancials.org</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
    }

    toast.success(
      `Payment receipt for ${payment.amount} has been generated and will download shortly.`
    );
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generatePDFReceipt(payment)}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link to="/payment">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Make a Payment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
