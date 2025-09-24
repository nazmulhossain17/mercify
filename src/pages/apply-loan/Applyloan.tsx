/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Upload,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  Clock,
  Users,
  Target,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

const loanFormSchema = {
  loanAmount: {
    required: "Loan amount is required",
    validate: (value: any) => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) return "Please enter a valid amount";
      if (num > 10000) return "Maximum loan amount is $10,000";
      return true;
    },
  },
  loanPurpose: {
    required: "Loan purpose is required",
    minLength: {
      value: 10,
      message: "Please provide more details about the loan purpose",
    },
  },
  repaymentPeriod: {
    required: "Repayment period is required",
  },
  documentUrl: {
    required: "Please upload required documents",
  },
  agreeTerms: {
    required: "You must agree to the terms and conditions",
    validate: (value: any) =>
      value === true || "You must agree to the terms and conditions",
  },
};

export default function ApplyLoanPage() {
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      loanAmount: "",
      loanPurpose: "",
      repaymentPeriod: "6",
      additionalInfo: "",
      documentUrl: "",
      agreeTerms: false,
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  // Get user ID from localStorage
  useEffect(() => {
    console.log("🔍 Checking for user data in localStorage...");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser._id || parsedUser.id;
        setUserId(id);
        console.log("✅ User ID found:", id);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        toast.error("Invalid user session. Please log in again.");
      }
    } else {
      console.log("❌ No user data found in localStorage");
      toast.error("Please log in to apply for a loan");
      navigate("/login");
    }
  }, [navigate]);

  // Google Drive upload function
  const uploadToDriveApi = async (file: any) => {
    console.log("📤 Starting file upload to Google Drive...");
    console.log("📁 File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      console.log("❌ File too large:", file.size);
      throw new Error("File size must be less than 5MB");
    }

    // Validate file type
    const allowedTypes = ["jpg", "jpeg", "png", "pdf"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      console.log("❌ Invalid file type:", fileExtension);
      throw new Error(
        "File type not allowed. Please upload JPG, PNG, or PDF files."
      );
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("🌐 Making API request to upload endpoint...");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "API URL used for upload:",
        `${import.meta.env.VITE_API_URL}/api/upload`
      );

      if (!response.ok) {
        console.log(
          "❌ Upload API response not ok:",
          response.status,
          response.statusText
        );
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Upload successful! Response:", result);
      console.log("🔗 Google Drive link:", result.link);

      return result.link;
    } catch (error) {
      console.error("💥 Drive upload error:", error);
      throw new Error("Failed to upload file");
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: any) => {
    console.log("🎯 File upload initiated:", file.name);

    if (file.size > 5 * 1024 * 1024) {
      console.log("❌ File size validation failed");
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);
    console.log("⏳ Upload state set to loading...");

    try {
      const fileUrl = await uploadToDriveApi(file);
      console.log(
        "✅ File uploaded successfully! Storing link in documentUrl field..."
      );

      setValue("documentUrl", fileUrl);
      await trigger("documentUrl");

      toast.success("File uploaded successfully!");
      console.log("🎉 Upload process completed successfully");
    } catch (error) {
      console.error("💥 File upload failed:", error);
      toast.error("Failed to upload file. Please try again.");
      setValue("documentUrl", "");
      setUploadedFileName(null);
    } finally {
      setIsUploading(false);
      console.log("🏁 Upload process finished (loading state cleared)");
    }
  };

  // Step validation
  const validateStep1 = async () => {
    console.log("🔍 Validating step 1...");
    const fieldsToValidate = ["loanAmount", "loanPurpose", "repaymentPeriod"];
    const results = await Promise.all(
      fieldsToValidate.map((field) =>
        trigger(
          field as
            | "loanAmount"
            | "loanPurpose"
            | "repaymentPeriod"
            | "additionalInfo"
            | "documentUrl"
            | "agreeTerms"
        )
      )
    );
    const isValid = results.every(Boolean);
    console.log("✅ Step 1 validation result:", isValid);
    return isValid;
  };

  const validateStep2 = async () => {
    console.log("🔍 Validating step 2...");
    const fieldsToValidate = ["documentUrl", "agreeTerms"];
    const results = await Promise.all(
      fieldsToValidate.map((field) =>
        trigger(
          field as
            | "loanAmount"
            | "loanPurpose"
            | "repaymentPeriod"
            | "additionalInfo"
            | "documentUrl"
            | "agreeTerms"
        )
      )
    );
    const isValid = results.every(Boolean);
    console.log("✅ Step 2 validation result:", isValid);
    return isValid;
  };

  // Navigation handlers
  const handleNext = async () => {
    console.log("➡️ Moving to next step...");
    const isValid = await validateStep1();
    if (isValid) {
      setStep(2);
      console.log("✅ Moved to step 2");
    } else {
      console.log("❌ Step 1 validation failed");
    }
  };

  const handleBack = () => {
    console.log("⬅️ Moving back to step 1...");
    setStep(1);
  };

  // Submit loan application
  const onSubmit = async (formData: any) => {
    console.log("🚀 Starting loan application submission...");
    console.log("📋 Form data:", formData);

    if (!userId) {
      console.log("❌ No user ID found");
      toast.error("You must be logged in to apply for a loan");
      return;
    }

    if (step !== 2) {
      console.log("❌ Not on final step");
      return;
    }

    const isStep2Valid = await validateStep2();
    if (!isStep2Valid) {
      console.log("❌ Step 2 validation failed");
      return;
    }

    setIsSubmitting(true);
    console.log("⏳ Setting submission state to loading...");

    try {
      // Prepare API payload
      const apiPayload = {
        memberId: userId,
        amountRequested: parseFloat(formData.loanAmount),
        purpose: formData.loanPurpose,
        documentUrl: formData.documentUrl,
      };

      console.log("📤 API Payload:", apiPayload);
      console.log(
        "🌐 Making API request to:",
        `${import.meta.env.VITE_API_URL}/api/loan`
      );

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/loan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error response:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ API Success response:", result);

      // Show success message
      toast.success(
        result.message ||
          "Your loan application has been submitted successfully!"
      );

      // Update user data in localStorage if needed
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.hasAppliedForLoan = true;
        user.lastApplicationDate = new Date().toISOString();
        localStorage.setItem("user", JSON.stringify(user));
        console.log("✅ Updated user data in localStorage");
      }

      // Reset form and redirect
      reset();
      setStep(1);
      setUploadedFileName(null);

      console.log("🔄 Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("💥 Loan application submission failed:", error);
      toast.error(
        "An error occurred while submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Submission process finished");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  const loanPurposes = [
    "Education & Training",
    "Medical Emergency",
    "Business Investment",
    "Home Improvement",
    "Wedding Expenses",
    "Emergency Expenses",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants as any} className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Apply for Interest-Free Loan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get financial support based on Islamic principles. No interest, no
              hidden fees - just community support when you need it most.
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            variants={itemVariants as any}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  0% Interest
                </h3>
                <p className="text-sm text-gray-600">
                  Completely interest-free loans following Islamic principles
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quick Process
                </h3>
                <p className="text-sm text-gray-600">
                  Get approval within 2-3 business days
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Community Support
                </h3>
                <p className="text-sm text-gray-600">
                  Backed by our caring community members
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div variants={itemVariants as any}>
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= 1
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
                    </motion.div>
                    <div
                      className={`h-1 w-20 sm:w-32 ${
                        step >= 2 ? "bg-emerald-500" : "bg-gray-200"
                      } rounded-full`}
                    />
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= 2
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      2
                    </motion.div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span
                    className={
                      step >= 1
                        ? "text-emerald-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    Loan Details
                  </span>
                  <span
                    className={
                      step >= 2
                        ? "text-emerald-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    Documents & Review
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants as any}>
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Loan Amount */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="loanAmount"
                              className="flex items-center"
                            >
                              <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                              Loan Amount (USD)
                            </Label>
                            <Controller
                              name="loanAmount"
                              control={control}
                              rules={loanFormSchema.loanAmount}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="loanAmount"
                                  type="number"
                                  placeholder="Enter amount (max $10,000)"
                                />
                              )}
                            />
                            {errors.loanAmount && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center"
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.loanAmount.message}
                              </motion.p>
                            )}
                          </div>

                          {/* Repayment Period */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="repaymentPeriod"
                              className="flex items-center"
                            >
                              <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                              Repayment Period
                            </Label>
                            <Controller
                              name="repaymentPeriod"
                              control={control}
                              rules={loanFormSchema.repaymentPeriod}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                    errors.repaymentPeriod
                                      ? "border-red-300"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <option value="3">3 months</option>
                                  <option value="6">6 months</option>
                                  <option value="9">9 months</option>
                                  <option value="12">12 months</option>
                                  <option value="18">18 months</option>
                                  <option value="24">24 months</option>
                                </select>
                              )}
                            />
                            {errors.repaymentPeriod && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-600 flex items-center"
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.repaymentPeriod.message}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Loan Purpose */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="loanPurpose"
                            className="flex items-center"
                          >
                            <Target className="w-4 h-4 mr-2 text-emerald-600" />
                            Loan Purpose
                          </Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                            {loanPurposes.map((purpose) => (
                              <Button
                                key={purpose}
                                type="button"
                                variant={
                                  watchedValues.loanPurpose === purpose
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setValue("loanPurpose", purpose)}
                                className={`text-xs ${
                                  watchedValues.loanPurpose === purpose
                                    ? "bg-emerald-500 hover:bg-emerald-600"
                                    : "hover:bg-emerald-50 hover:border-emerald-300"
                                }`}
                              >
                                {purpose}
                              </Button>
                            ))}
                          </div>
                          <Controller
                            name="loanPurpose"
                            control={control}
                            rules={loanFormSchema.loanPurpose}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Or specify your own purpose"
                              />
                            )}
                          />
                          {errors.loanPurpose && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600 flex items-center"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.loanPurpose.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-2">
                          <Label htmlFor="additionalInfo">
                            Additional Information (Optional)
                          </Label>
                          <Controller
                            name="additionalInfo"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Any additional details about your loan request..."
                                rows={4}
                              />
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="button" onClick={handleNext}>
                            Next Step
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Document Upload */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                            Required Documents
                          </h3>
                          <p className="text-gray-600">
                            Please upload proof of income or financial documents
                            to support your application.
                          </p>

                          <motion.div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              watchedValues.documentUrl
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-gray-300 hover:border-emerald-400"
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file);
                                }
                              }}
                              accept=".pdf,.jpg,.jpeg,.png"
                              disabled={isUploading}
                            />
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer"
                            >
                              {isUploading ? (
                                <Loader2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 animate-spin" />
                              ) : (
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              )}
                              <div className="space-y-2">
                                <p className="text-lg font-medium text-gray-900">
                                  {isUploading
                                    ? "Uploading..."
                                    : watchedValues.documentUrl
                                    ? "File Uploaded!"
                                    : "Upload Document"}
                                </p>
                                {uploadedFileName && (
                                  <p className="text-emerald-600 font-medium">
                                    {uploadedFileName}
                                  </p>
                                )}
                                {!isUploading && !watchedValues.documentUrl && (
                                  <p className="text-gray-500">
                                    Click to browse or drag and drop
                                  </p>
                                )}
                                <p className="text-sm text-gray-400">
                                  PDF, JPG, PNG up to 5MB
                                </p>
                              </div>
                            </label>
                          </motion.div>
                          {errors.documentUrl && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-600 flex items-center"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.documentUrl.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Application Review */}
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Review Your Application
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Loan Amount
                              </p>
                              <p className="font-semibold text-gray-900">
                                ${watchedValues.loanAmount}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Repayment Period
                              </p>
                              <p className="font-semibold text-gray-900">
                                {watchedValues.repaymentPeriod} months
                              </p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-sm text-gray-500">Purpose</p>
                              <p className="font-semibold text-gray-900">
                                {watchedValues.loanPurpose}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                          <Controller
                            name="agreeTerms"
                            control={control}
                            rules={loanFormSchema.agreeTerms}
                            render={({ field: { value, onChange } }) => (
                              <Checkbox
                                id="agreeTerms"
                                checked={value}
                                onCheckedChange={onChange}
                                className="mt-1"
                              />
                            )}
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor="agreeTerms"
                              className="text-sm font-medium"
                            >
                              I agree to the terms and conditions
                            </Label>
                            <p className="text-xs text-gray-600">
                              By checking this box, I confirm that all
                              information provided is accurate and I agree to
                              the{" "}
                              <Link
                                to="/terms"
                                className="text-emerald-600 hover:text-emerald-700 underline"
                              >
                                terms and conditions
                              </Link>{" "}
                              of the Mercy Financials program.
                            </p>
                          </div>
                        </div>
                        {errors.agreeTerms && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.agreeTerms.message}
                          </motion.p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Application
                                <CheckCircle className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
