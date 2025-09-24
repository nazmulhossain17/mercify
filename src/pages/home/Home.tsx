import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  HandHeart,
  Users,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors/authSelectors";

const Home = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  console.log(showBackToTop);
  const { scrollY } = useScroll();

  // Check if user is authenticated
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
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

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const features = [
    {
      icon: Heart,
      title: "Interest-Free",
      description: "Pure benevolent loans without any interest or profit",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: HandHeart,
      title: "Community Support",
      description: "Helping community members in times of need",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Users,
      title: "Trusted Network",
      description: "Verified members ensuring secure transactions",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "Secure Process",
      description: "Safe and transparent lending process",
      color: "from-green-500 to-emerald-600",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Register",
      description: "Create your account and get verified",
    },
    {
      step: "2",
      title: "Request/Offer",
      description: "Submit loan request or offer to help others",
    },
    {
      step: "3",
      title: "Connect",
      description: "Get matched with suitable lenders/borrowers",
    },
    {
      step: "4",
      title: "Complete",
      description: "Finalize the agreement and receive funds",
    },
  ];

  // const testimonials = [
  //   {
  //     name: "Ahmed Hassan",
  //     role: "Small Business Owner",
  //     content:
  //       "Mercy Financials helped me expand my business without the burden of interest. The community support is incredible.",
  //     rating: 5,
  //     avatar: "/placeholder.svg?height=64&width=64&text=AH",
  //   },
  //   {
  //     name: "Fatima Ali",
  //     role: "Student",
  //     content:
  //       "I was able to complete my education thanks to the generous lenders in this platform. May Allah reward them.",
  //     rating: 5,
  //     avatar: "/placeholder.svg?height=64&width=64&text=FA",
  //   },
  //   {
  //     name: "Omar Khan",
  //     role: "Family Man",
  //     content:
  //       "During a medical emergency, this platform connected me with help quickly. Truly a blessing.",
  //     rating: 5,
  //     avatar: "/placeholder.svg?height=64&width=64&text=OK",
  //   },
  // ];

  return (
    <div>
      {/* Hero Section - Only show if user is NOT authenticated */}
      {!isAuthenticated && (
        <section
          id="home"
          className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 -z-10"
          />
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div variants={itemVariants}>
                <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs sm:text-sm">
                  Islamic Finance • Interest-Free
                </Badge>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
              >
                <motion.span
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent bg-300%"
                >
                  Mercy Financials
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
                >
                  Benevolent Lending
                </motion.span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2"
              >
                Connect with your community through interest-free loans. Help
                others in need or get help when you need it most, following
                Islamic principles of mutual support and brotherhood.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  >
                    Request Loan
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white/80 backdrop-blur-sm"
                  >
                    Offer Help
                    <HandHeart className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          {/* Mobile-optimized Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-20 hidden sm:block"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-1/4 right-4 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-full opacity-20 hidden sm:block"
          />
        </section>
      )}

      {/* Authenticated User Welcome Section */}
      {isAuthenticated && (
        <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 min-h-[50vh] flex items-center bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Continue your journey with Mercy Financials. Access your
                dashboard to manage your loans, savings, and community
                connections.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section
        id="about"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 -z-10"
        />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Why Choose Mercy Financials?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the beauty of Islamic finance principles in a modern,
              secure platform
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm h-full">
                    <CardHeader className="pb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}
                      >
                        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-lg sm:text-xl text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Rest of your sections remain the same... */}
      {/* I'll include the remaining sections but they stay unchanged */}

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
              Simple steps to connect lenders and borrowers in our trusted
              community
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center relative"
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white text-lg sm:text-2xl font-bold shadow-lg"
                  >
                    {step.step}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                      className="hidden lg:block absolute top-8 sm:top-10 left-full w-full h-1 bg-gradient-to-r from-emerald-300 to-teal-300 -translate-x-10 origin-left"
                    />
                  )}
                </div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3"
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-gray-600 text-base sm:text-lg leading-relaxed px-2"
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Get In Touch
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
              Have questions? We're here to help you understand Mercy Financials
              better
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                icon: Phone,
                title: "Phone",
                info: "321-314-8170",
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: Mail,
                title: "Email",
                info: "info@alamanah.org",
                color: "from-purple-500 to-indigo-600",
              },
              {
                icon: MapPin,
                title: "Address",
                info: "5625 Nottingham Dr Lilburn, GA 30047",
                color: "from-green-500 to-emerald-600",
              },
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="sm:col-span-1 lg:col-span-1"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                    <CardContent className="pt-6 sm:pt-8">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                      >
                        <contact.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </motion.div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">
                        {contact.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base lg:text-lg break-words">
                        {contact.info}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
