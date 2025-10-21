/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, type Transition } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  drivingLicense?: string; // This will store the Google Drive link
  phoneNumber: string;
  referralFullName: string;
  referralEmail: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  drivingLicense?: string; // Changed from drivingLicenseFile
  phoneNumber?: string;
  referralFullName?: string;
  referralEmail?: string;
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  console.log(uploadedFileName, setIsUploading, setUploadedFileName);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    drivingLicense: "", // This will store the Google Drive link
    phoneNumber: "",
    referralFullName: "",
    referralEmail: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
      } as Transition,
    },
  };

  const validateForm = (): boolean => {
    console.log("🔍 Starting form validation...");
    console.log("📋 Current form data:", formData);

    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      console.log("❌ Full name validation failed");
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
      console.log("❌ Full name too short");
    } else {
      console.log("✅ Full name validation passed");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      console.log("❌ Email validation failed - empty");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      console.log("❌ Email validation failed - invalid format");
    } else {
      console.log("✅ Email validation passed");
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      console.log("❌ Password validation failed - empty");
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      console.log("❌ Password validation failed - too short");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
      console.log("❌ Password validation failed - complexity requirements");
    } else {
      console.log("✅ Password validation passed");
    }

    // Check for driving license (Google Drive link)
    // if (!formData.drivingLicense.trim()) {
    //   newErrors.drivingLicense = "Driving license file is required";
    //   console.log("❌ Driving license validation failed - no file uploaded");
    // } else {
    //   console.log("✅ Driving license validation passed");
    //   console.log("🔗 Driving license link:", formData.drivingLicense);
    // }

  
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      console.log("❌ Phone number validation failed - empty");
    
    } else {
      console.log("✅ Phone number validation passed");
    }

    if (formData.referralEmail.trim()) {
      if (!emailRegex.test(formData.referralEmail)) {
        newErrors.referralEmail = "Please enter a valid referral email address";
        console.log("❌ Referral email validation failed - invalid format");
      } else {
        console.log("✅ Referral email validation passed");
      }
    } else {
      console.log("ℹ️ Referral email is empty (optional)");
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("📊 Validation result:", isValid ? "PASSED" : "FAILED");
    console.log("🚫 Validation errors:", newErrors);

    return isValid;
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    console.log(`📝 Input changed - ${field}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors for the field being updated
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      console.log(`🧹 Cleared error for field: ${field}`);
    }
  };

  // const uploadToDriveApi = async (file: File): Promise<string> => {
  //   console.log("📤 Starting file upload to Google Drive...");
  //   console.log("📁 File details:", {
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //   });

  //   // Validate file size
  //   if (file.size > 5 * 1024 * 1024) {
  //     console.log("❌ File too large:", file.size);
  //     throw new Error("File size must be less than 5MB");
  //   }

  //   // Validate file type
  //   const allowedTypes = ["jpg", "jpeg", "png", "pdf"];
  //   const fileExtension = file.name.split(".").pop()?.toLowerCase();
  //   if (!fileExtension || !allowedTypes.includes(fileExtension)) {
  //     console.log("❌ Invalid file type:", fileExtension);
  //     throw new Error(
  //       "File type not allowed. Please upload JPG, PNG, or PDF files."
  //     );
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     console.log("🌐 Making API request to upload endpoint...");
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/upload`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );
  //     console.log(
  //       "API URL used for upload:",
  //       `${import.meta.env.VITE_API_URL}/api/upload`
  //     );

  //     if (!response.ok) {
  //       console.log(
  //         "❌ Upload API response not ok:",
  //         response.status,
  //         response.statusText
  //       );
  //       throw new Error(`Upload failed: ${response.statusText}`);
  //     }

  //     const result = await response.json();
  //     console.log("✅ Upload successful! Response:", result);
  //     console.log("🔗 Google Drive link:", result.link);

  //     return result.link; // Return the Google Drive link
  //   } catch (error: any) {
  //     console.error("💥 Drive upload error:", error);
  //     throw new Error("Failed to upload file");
  //   }
  // };

  // const handleFileUpload = async (file: File) => {
  //   console.log("🎯 File upload initiated:", file.name);

  //   if (file.size > 5 * 1024 * 1024) {
  //     console.log("❌ File size validation failed");
  //     setErrors((prev) => ({
  //       ...prev,
  //       drivingLicense: "File size must be less than 5MB",
  //     }));
  //     return;
  //   }

  //   setIsUploading(true);
  //   setUploadedFileName(file.name);
  //   console.log("⏳ Upload state set to loading...");

  //   try {
  //     const fileUrl = await uploadToDriveApi(file);
  //     console.log(
  //       "✅ File uploaded successfully! Storing link in drivingLicense field..."
  //     );

  //     // Store the Google Drive link in the drivingLicense field
  //     handleInputChange("drivingLicense", fileUrl);

  //     toast.success("File uploaded successfully!");
  //     console.log("🎉 Upload process completed successfully");
  //   } catch (error: any) {
  //     console.error("💥 File upload failed:", error);
  //     toast.error(error.message || "Failed to upload file. Please try again.");
  //     setErrors((prev) => ({
  //       ...prev,
  //       drivingLicense:
  //         error.message || "Failed to upload file. Please try again.",
  //     }));
  //     setUploadedFileName(null);
  //   } finally {
  //     setIsUploading(false);
  //     console.log("🏁 Upload process finished (loading state cleared)");
  //   }
  // };

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    console.log("🚀 Form submission started...");
    console.log("📦 Payload being sent:", data);

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        drivingLicense: data.drivingLicense, // This contains the Google Drive link
        phoneNumber: data.phoneNumber,
        ...(data.referralFullName.trim() && {
          referralFullName: data.referralFullName,
        }),
        ...(data.referralEmail.trim() && {
          referralEmail: data.referralEmail,
        }),
      };

      console.log("📡 Making API request to register endpoint...");
      console.log("📋 Final payload:", payload);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("📨 API Response status:", response.status);

      if (response.status === 201) {
        console.log("✅ Registration successful!");
        toast.success("Account created! Redirecting to login...");
        setTimeout(() => {
          // Replace with your navigation logic
          window.location.href = "/sign-in";
        }, 1500);
      } else {
        const errorData = await response.json();
        console.log("❌ Registration failed with response:", errorData);
        throw new Error(
          errorData.error || errorData.message || "Registration failed"
        );
      }
    } catch (error: any) {
      console.error("💥 Registration error:", error);
      const errorMessage = error.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Form submission finished");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submit event triggered");
    console.log("🔍 Current form data before validation:", formData);

    if (validateForm()) {
      console.log("✅ Form validation passed, proceeding with submission...");
      await onSubmit(formData);
    } else {
      console.log("❌ Form validation failed, submission blocked");
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs sm:text-sm">
                Join Our Community • Interest-Free Lending
              </Badge>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create Your Account
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-2"
            >
              Join our community of lenders and borrowers committed to
              interest-free financial assistance based on Islamic principles.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Sign Up Form Section */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <User className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl sm:text-3xl text-gray-900">
                    Sign Up
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Fill in your details to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label
                        htmlFor="fullName"
                        className="text-base font-semibold flex items-center"
                      >
                        <User className="w-4 h-4 mr-2 text-emerald-600" />
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className={`mt-2 h-12 ${
                          errors.fullName ? "border-red-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.fullName}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label
                        htmlFor="email"
                        className="text-base font-semibold flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`mt-2 h-12 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label
                        htmlFor="password"
                        className="text-base font-semibold flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                        Password
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`h-12 pr-12 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded ${
                                  level <= passwordStrength
                                    ? passwordStrength <= 2
                                      ? "bg-red-500"
                                      : passwordStrength <= 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Password strength:{" "}
                            {passwordStrength <= 2
                              ? "Weak"
                              : passwordStrength <= 3
                              ? "Medium"
                              : "Strong"}
                          </p>
                        </div>
                      )}
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.password}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Driving License File Upload */}
                    {/* <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label
                        htmlFor="drivingLicenseFile"
                        className="text-base font-semibold flex items-center"
                      >
                        <CreditCard className="w-4 h-4 mr-2 text-emerald-600" />
                        Driving License / Government ID
                      </Label>
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-700">
                          Upload a copy of your valid Driving License or Govt.
                          Issued ID (Passport/State ID){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex items-center gap-4">
                          <label
                            htmlFor="drivingLicenseFile"
                            className="cursor-pointer flex-1"
                          >
                            <div
                              className={`flex flex-col items-center justify-center px-6 py-4 border-2 border-dashed rounded-lg transition-colors ${
                                formData.drivingLicense
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-300 hover:border-emerald-500"
                              }`}
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-6 h-6 text-emerald-600 mb-2 animate-spin" />
                                  <p className="text-sm text-gray-600 text-center">
                                    Uploading {uploadedFileName}...
                                  </p>
                                </>
                              ) : formData.drivingLicense ? (
                                <>
                                  <div className="flex items-center mb-2">
                                    <FileText className="w-6 h-6 text-green-600 mr-2" />
                                    <Check className="w-4 h-4 text-green-600" />
                                  </div>
                                  <p className="text-sm text-green-600 text-center font-medium">
                                    {uploadedFileName} uploaded successfully
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Click to upload a different file
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-emerald-600 mb-2" />
                                  <p className="text-sm text-gray-600 text-center">
                                    Click to upload file (PDF, JPG, PNG)
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Max file size: 5MB
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              id="drivingLicenseFile"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileUpload(e.target.files[0]);
                                }
                              }}
                              disabled={isSubmitting || isUploading}
                            />
                          </label>
                          {formData.drivingLicense && !isUploading && (
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange("drivingLicense", "");
                                setUploadedFileName(null);
                                console.log("🗑️ Driving license file removed");
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {errors.drivingLicense && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-1 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.drivingLicense}
                          </motion.p>
                        )}
                      </div>
                    </motion.div> */}

                    {/* Phone Number */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label
                        htmlFor="phoneNumber"
                        className="text-base font-semibold flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        required
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        className={`mt-2 h-12 ${
                          errors.phoneNumber ? "border-red-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.phoneNumber && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phoneNumber}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Referral Full Name */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.55 }}
                    >
                      <Label
                        htmlFor="referralFullName"
                        className="text-base font-semibold flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-2 text-emerald-600" />
                        Referrer's Full Name
                      </Label>
                      <Input
                        id="referralFullName"
                        type="text"
                        placeholder="Enter referrer's full name if applicable"
                        value={formData.referralFullName}
                        onChange={(e) =>
                          handleInputChange("referralFullName", e.target.value)
                        }
                        className="mt-2 h-12"
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    {/* Referral Email */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label
                        htmlFor="referralEmail"
                        className="text-base font-semibold flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                        Referrer's Email
                      </Label>
                      <Input
                        id="referralEmail"
                        type="email"
                        placeholder="Enter referrer's email if applicable"
                        value={formData.referralEmail}
                        onChange={(e) =>
                          handleInputChange("referralEmail", e.target.value)
                        }
                        className={`mt-2 h-12 ${
                          errors.referralEmail ? "border-red-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.referralEmail && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.referralEmail}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 text-lg font-semibold h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Login Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-center pt-4"
                    >
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                          to="/sign-in"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
