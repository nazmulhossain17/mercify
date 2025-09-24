import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Home,
  Search,
  ArrowLeft,
  MapPin,
  Compass,
  RefreshCw,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
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

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  };

  const quickLinks = [
    {
      title: "Home",
      description: "Return to our main page",
      to: "/",
      icon: Home,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Sign Up",
      description: "Create your account",
      to: "/sign-up",
      icon: Heart,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Sign In",
      description: "Access your account",
      to: "/sign-in",
      icon: ArrowLeft,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Donation",
      description: "Support our community",
      to: "/donation",
      icon: Gift,
      color: "from-orange-500 to-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-x-hidden relative">
      {/* Background Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full hidden sm:block"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full hidden sm:block"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full hidden sm:block"
      />

      {/* Navigation */}

      {/* Main Content */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* 404 Animation */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                className="relative inline-block"
              >
                <motion.h1
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(16, 185, 129, 0.5)",
                      "0 0 40px rgba(20, 184, 166, 0.8)",
                      "0 0 20px rgba(16, 185, 129, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent leading-none"
                >
                  404
                </motion.h1>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center"
                >
                  <Compass className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Status Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-200 text-sm sm:text-base px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Page Not Found
              </Badge>
            </motion.div>

            {/* Main Message */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Oops! You've Lost Your Way
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2"
            >
              The page you're looking for seems to have wandered off. Don't
              worry though - our community is here to help you find your way
              back to where you need to be.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg"
                  >
                    <Home className="mr-2 w-5 h-5" />
                    Go Home
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Go Back
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm"
                >
                  <RefreshCw className="mr-2 w-5 h-5" />
                  Refresh
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
              Or explore these popular sections:
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to={link.to}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl`}
                        >
                          <link.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {link.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {link.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 max-w-md mx-auto">
              <CardContent className="p-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Search className="w-6 h-6 text-white" />
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Looking for something specific?
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Try searching from our homepage or contact our support team
                  for assistance.
                </p>
                <Link to="/#contact">
                  <Button
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                  >
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
