"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Users,
  Shield,
  Gift,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function DonationPage() {
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const handleDonateClick = () => {
    const amount = donationAmount || customAmount;
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please select or enter a valid donation amount");
      return;
    }

    if (!donorFirstName.trim() || !donorLastName.trim() || !email.trim()) {
      alert("Please fill in all donor information fields");
      return;
    }

    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod.trim()) {
      alert("Please enter a payment method");
      return;
    }
    if (!transactionId.trim()) {
      alert("Please enter a transaction ID");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const donationData = {
        totalAmount: Number.parseFloat(donationAmount || customAmount),
        donorFirstName: donorFirstName.trim(),
        donorLastName: donorLastName.trim(),
        email: email.trim(),
        message: message.trim() || undefined,
        paymentMethod: paymentMethod.trim(),
        transactionId: transactionId.trim(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/donation/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donationData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit donation");
      }

      const result = await response.json();
      console.log("[v0] Donation submitted successfully:", result);

      // Show success state
      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowPaymentDialog(false);
        setShowSuccess(false);
        setPaymentMethod("");
        setTransactionId("");
        setDonationAmount("");
        setCustomAmount("");
        setDonorFirstName("");
        setDonorLastName("");
        setEmail("");
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("[v0] Donation submission error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit donation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-x-hidden">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs sm:text-sm">
                Support Our Mission • Make a Difference
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Support Our Community
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-2"
            >
              Your generous donations help us maintain this platform and support
              those in need within our community. Every contribution, no matter
              the size, makes a meaningful impact.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12"
          >
            {/* Donation Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Gift className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl sm:text-3xl text-gray-900">
                    Make a Donation
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Choose your donation amount and help us continue our mission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donation Type */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label className="text-base font-semibold mb-3 block">
                      Donation Type
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant={
                          donationType === "one-time" ? "default" : "outline"
                        }
                        onClick={() => setDonationType("one-time")}
                        className={`flex-1 ${
                          donationType === "one-time"
                            ? "bg-gradient-to-r from-orange-500 to-amber-600"
                            : "border-orange-300 text-orange-700 hover:bg-orange-50"
                        }`}
                      >
                        One-time Donation
                      </Button>
                      <Button
                        variant={
                          donationType === "monthly" ? "default" : "outline"
                        }
                        onClick={() => setDonationType("monthly")}
                        className={`flex-1 ${
                          donationType === "monthly"
                            ? "bg-gradient-to-r from-orange-500 to-amber-600"
                            : "border-orange-300 text-orange-700 hover:bg-orange-50"
                        }`}
                      >
                        Monthly Donation
                      </Button>
                    </div>
                  </motion.div>

                  {/* Predefined Amounts */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label className="text-base font-semibold mb-3 block">
                      Select Amount
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={
                            donationAmount === amount.toString()
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            setDonationAmount(amount.toString());
                            setCustomAmount("");
                          }}
                          disabled={!!customAmount}
                          className={`${
                            donationAmount === amount.toString()
                              ? "bg-gradient-to-r from-orange-500 to-amber-600"
                              : "border-orange-300 text-orange-700 hover:bg-orange-50"
                          } ${
                            customAmount ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Custom Amount */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label
                      htmlFor="custom-amount"
                      className="text-base font-semibold"
                    >
                      Or Enter Custom Amount
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                        $
                      </span>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setDonationAmount("");
                        }}
                        disabled={!!donationAmount}
                        className={`pl-8 h-12 text-lg ${
                          donationAmount ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Donor Information */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <Label className="text-base font-semibold">
                      Donor Information
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first-name" className="text-sm">
                          First Name *
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          className="mt-1 h-11"
                          value={donorFirstName}
                          onChange={(e) => setDonorFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last-name" className="text-sm">
                          Last Name *
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          className="mt-1 h-11"
                          value={donorLastName}
                          onChange={(e) => setDonorLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="mt-1 h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm">
                        Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Leave a message of support..."
                        className="mt-1 min-h-[100px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                  </motion.div>

                  {/* Donate Button */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleDonateClick}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 py-4 text-lg font-semibold h-auto"
                    >
                      Donate ${donationAmount || customAmount || "0"}{" "}
                      {donationType === "monthly" ? "Monthly" : "Now"}
                      <Heart className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Impact Information */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-orange-600" />
                    Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <span className="font-semibold text-orange-700">$25</span>{" "}
                      - Helps process 5 loan applications
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold text-orange-700">$50</span>{" "}
                      - Supports platform maintenance for 1 week
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold text-orange-700">
                        $100
                      </span>{" "}
                      - Covers verification costs for 20 users
                    </p>
                    <p>
                      <span className="font-semibold text-orange-700">
                        $250+
                      </span>{" "}
                      - Enables community outreach programs
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                    Secure Donation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    SSL Encrypted
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    PCI Compliant
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Tax Deductible
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    100% Transparent
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      1,247
                    </div>
                    <div className="text-sm text-gray-600">Active Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      $2.3M
                    </div>
                    <div className="text-sm text-gray-600">
                      Loans Facilitated
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-2">
              Why Your Donation Matters
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Every donation directly supports our mission to provide
              interest-free financial assistance to those in need
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                icon: Heart,
                title: "Platform Maintenance",
                description:
                  "Keep our secure platform running smoothly for all users",
                color: "from-red-500 to-pink-600",
              },
              {
                icon: Users,
                title: "Community Support",
                description:
                  "Fund outreach programs and community education initiatives",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: Shield,
                title: "Security & Verification",
                description:
                  "Maintain robust security measures and user verification processes",
                color: "from-green-500 to-emerald-600",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="pt-8">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              Complete Your Donation
            </DialogTitle>
            <DialogDescription>
              Enter your payment details to complete your $
              {donationAmount || customAmount} donation
            </DialogDescription>
          </DialogHeader>

          {showSuccess ? (
            <div className="space-y-4 py-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold text-green-700">
                Donation Submitted Successfully!
              </h3>
              <p className="text-gray-600">
                Thank you for your generous contribution of $
                {donationAmount || customAmount}.
              </p>
              <p className="text-sm text-gray-500">
                This dialog will close automatically...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method *</Label>
                  <Input
                    id="payment-method"
                    placeholder="e.g., Bank Transfer, Mobile Money, Credit Card"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the payment method you used
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Transaction ID *</Label>
                  <Input
                    id="transaction-id"
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the transaction ID from your payment confirmation
                  </p>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Donation"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
