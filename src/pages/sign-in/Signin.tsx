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
import { Checkbox } from "@/components/ui/checkbox";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  Shield,
  UserCheck,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { LoginRequest } from "@/types/auth";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "@/store/selectors/authSelectors";
import { createAuthDispatch } from "@/store/dispatch/authDispatch";

interface LoginFormData extends LoginRequest {
  rememberMe: boolean;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  // Redux hooks
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Create auth dispatch instance
  const authDispatch = createAuthDispatch(dispatch);

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
    console.log("🔍 Validating login form...");
    const newErrors: Partial<LoginFormData> = {};

    // Email validation
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

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      console.log("❌ Password validation failed - empty");
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      console.log("❌ Password validation failed - too short");
    } else {
      console.log("✅ Password validation passed");
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("📊 Form validation result:", isValid ? "PASSED" : "FAILED");

    return isValid;
  };

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    console.log(`📝 Input changed - ${field}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof Partial<LoginFormData>]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      console.log(`🧹 Cleared error for field: ${field}`);
    }

    // Clear auth error when user starts typing
    if (authError) {
      authDispatch.clearAuthError();
    }
  };

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    console.log("🚀 Login form submission started");
    console.log("📋 Login credentials:", {
      email: data.email,
      rememberMe: data.rememberMe,
    });

    try {
      // Prepare login request (exclude rememberMe from API call)
      const loginRequest: LoginRequest = {
        email: data.email,
        password: data.password,
      };

      // Call login through auth dispatch
      const result = await authDispatch.login(loginRequest);

      if (result.success) {
        console.log("✅ Login successful!");
        toast.success(`Welcome back! ${result.message || "Login successful"}`);

        // Handle remember me functionality
        if (data.rememberMe) {
          console.log("💾 Remember me enabled - extending session");
          // You could set a longer expiration or additional persistence here
        }

        // Redirect based on user role
        setTimeout(() => {
          if (result.user?.role === "admin") {
            console.log("👑 Redirecting to admin dashboard");
            window.location.href = "/admin";
          } else {
            console.log("👤 Redirecting to user dashboard");
            window.location.href = "/dashboard";
          }
        }, 1500);
      } else {
        console.log("❌ Login failed:", result.error);
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("💥 Unexpected login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submit event triggered");

    if (validateForm()) {
      console.log("✅ Form validation passed, proceeding with login...");
      await onSubmit(formData);
    } else {
      console.log("❌ Form validation failed, submission blocked");
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    console.log("ℹ️ User already authenticated, redirecting...");
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-x-hidden">
      {/* Navigation */}

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
                Welcome Back • Secure Login
              </Badge>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-2"
            >
              Sign in to your account to access our interest-free lending
              platform and connect with your community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Sign In Form Section */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
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
                    <LogIn className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl sm:text-3xl text-gray-900">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Global Error Display */}
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-red-700 text-sm">
                          {authError}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => authDispatch.clearAuthError()}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </motion.div>
                    )}

                    {/* Email */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
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
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`mt-2 h-12 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        autoComplete="email"
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
                      transition={{ delay: 0.2 }}
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
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`h-12 pr-12 ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          disabled={isLoading}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
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

                    {/* Remember Me & Forgot Password */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            handleInputChange("rememberMe", checked as boolean)
                          }
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor="rememberMe"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Remember me
                        </Label>
                      </div>
                      <a
                        href="/forgot-password"
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Forgot password?
                      </a>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-4 text-lg font-semibold h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-5 h-5 mr-2" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center pt-4"
                    >
                      <p className="text-gray-600">
                        Don't have an account?{" "}
                        <a
                          href="/sign-up"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          Create one here
                        </a>
                      </p>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Your Security is Our Priority
            </h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Shield,
                title: "SSL Encrypted",
                description:
                  "All data transmitted is encrypted with industry-standard SSL",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: UserCheck,
                title: "Verified Users",
                description: "All members go through our verification process",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: Lock,
                title: "Secure Storage",
                description: "Your personal information is stored securely",
                color: "from-purple-500 to-indigo-600",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardContent className="pt-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
              >
                <Heart className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold">Secure Access</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Your login credentials are protected with enterprise-grade
              security. We never store your password in plain text and use
              advanced encryption to keep your account safe.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Mercy Financials. All rights reserved. Built with
              Islamic principles in mind.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
