import { useState } from "react";
import { motion } from "framer-motion";

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast(
        "Thank you for contacting us. We'll get back to you within 24 hours."
      );

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast("Failed to send message. Please try again.");
      console.error("Error submitting contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["321-314-8170", "321-314-8170"],
      description: "Available 24/7 for urgent matters",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@alamanah.org", "info@alamanah.org"],
      description: "We respond within 24 hours",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Community Street", "Islamic Center, City 12345"],
      description: "Visit us during office hours",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      description: "Closed on Sundays and Islamic holidays",
      color: "from-orange-500 to-amber-600",
    },
  ];

  const supportTopics = [
    {
      icon: Users,
      title: "Account Support",
      description:
        "Help with registration, verification, and account management",
    },
    {
      icon: Heart,
      title: "Loan Assistance",
      description: "Questions about requesting or offering Mercy Financials",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Report security issues or privacy concerns",
    },
    {
      icon: MessageCircle,
      title: "General Inquiries",
      description: "Any other questions about our platform and services",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16 sm:mb-20"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm px-6 py-2">
                Get In Touch • We're Here to Help
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Contact Us
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Have questions about Mercy Financials? Need help with your
              account? Our dedicated support team is here to assist you every
              step of the way.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 h-full p-8">
                  <CardContent className="pt-8">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl`}
                    >
                      <info.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">
                      {info.title}
                    </h3>
                    <div className="space-y-3 mb-6">
                      {info.details.map((detail, idx) => (
                        <p
                          key={idx}
                          className="text-gray-700 font-semibold text-lg"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm px-6 py-2">
                Visit Our Location
              </Badge>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Find Us Here
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              We're conveniently located and ready to serve you. Visit us during
              our office hours or schedule an appointment.
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Map Container */}
            <div className="relative w-full h-0 pb-[50%] md:pb-[40%] lg:pb-[35%]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d32602.582498003045!2d-84.168206!3d33.889438!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5a434e3918a57%3A0xba0c53ef89932760!2s5625%20Nottingham%20Dr%20NW%2C%20Lilburn%2C%20GA%2030047!5e1!3m2!1sen!2sus!4v1755794326581!5m2!1sen!2sus"
                className="absolute top-0 left-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address Information Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-white">
                <div className="flex items-center mb-4 md:mb-0">
                  <MapPin className="w-6 h-6 mr-3 text-blue-200" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Our Address</h3>
                    <p className="text-blue-100 text-lg">
                      5625 Nottingham Dr NW, Lilburn, GA 30047
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-blue-200" />
                  <div className="text-center md:text-right">
                    <h3 className="text-xl font-bold mb-1">Office Hours</h3>
                    <p className="text-blue-100">
                      Mon - Fri: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Support Topics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16"
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm p-4">
                <CardHeader className="text-center pb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Send className="w-10 h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-3xl sm:text-4xl text-gray-900 mb-4">
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-lg sm:text-xl">
                    Fill out the form below and we'll get back to you as soon as
                    possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="name" className="text-lg font-semibold">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`mt-3 h-14 text-lg ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-2 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label
                          htmlFor="email"
                          className="text-lg font-semibold"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`mt-3 h-14 text-lg ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-2 flex items-center"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label
                        htmlFor="subject"
                        className="text-lg font-semibold"
                      >
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        className={`mt-3 h-14 text-lg ${
                          errors.subject ? "border-red-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.subject}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label
                        htmlFor="message"
                        className="text-lg font-semibold"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your inquiry in detail..."
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        className={`mt-3 min-h-[180px] text-lg ${
                          errors.message ? "border-red-500" : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-6 text-xl font-semibold h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6 mr-3" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Topics */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 space-y-8"
            >
              <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <MessageCircle className="w-6 h-6 mr-3 text-emerald-600" />
                    How Can We Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {supportTopics.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <topic.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base mb-2">
                          {topic.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 text-blue-600" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base text-gray-600">
                        General Inquiries
                      </span>
                      <span className="text-base font-bold text-blue-700">
                        24 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base text-gray-600">
                        Account Issues
                      </span>
                      <span className="text-base font-bold text-blue-700">
                        12 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base text-gray-600">
                        Security Concerns
                      </span>
                      <span className="text-base font-bold text-blue-700">
                        2 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-base text-gray-600">
                        Urgent Matters
                      </span>
                      <span className="text-base font-bold text-blue-700">
                        Immediate
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
