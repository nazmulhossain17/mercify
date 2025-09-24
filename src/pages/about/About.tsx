import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  Shield,
  CheckCircle,
  TrendingUp,
  Globe,
  BookOpen,
  Building,
  Home,
  Briefcase,
  CreditCard,
  Sprout,
  ArrowRight,
  DollarSign,
  Handshake,
  PiggyBank,
  Target,
  Eye,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const challenges = [
    {
      icon: Building,
      title: "High-Interest Banks",
      description:
        "Traditional banks burden borrowers with interest rates that compound financial stress, making it harder for families to achieve financial stability.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Users,
      title: "Limited Community Support",
      description:
        "Friends and family may not always have the resources to help when needed most, leaving individuals without reliable financial support networks.",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: CreditCard,
      title: "Interest-Based System",
      description:
        "The current financial system is dominated by interest, conflicting with Islamic principles and creating barriers for ethical financial participation.",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const ourModel = [
    {
      icon: DollarSign,
      title: "Savings",
      description:
        "Start saving today with as low as $50 a month. This small and stress-free amount will enable you to receive all benefits of Mercy Financials including interest-free loans whenever you need it. Upon termination of membership, you'll receive the full amount you saved with us.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Handshake,
      title: "Interest-Free Loan",
      description:
        "Known as 'Qard Hasan' in Arabic, this is our primary goal to serve you. If you are a member and save a very small and stress-free amount with us, you'll be eligible for this interest-free loan for personal needs and small businesses.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: PiggyBank,
      title: "Investment",
      description:
        "Investing is our secondary goal to grow your savings in a Halal way. We'll be investing in halal and profitable business and distribute the profits with you. We make every effort to not deal with any losses but will share the losses proportionately if it occurs according to Islamic Shariah.",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const useCases = [
    {
      icon: Home,
      title: "Housing Needs",
      description:
        "Rent payments, down payments for homes, and housing-related expenses",
    },
    {
      icon: Briefcase,
      title: "Business Launch",
      description:
        "Starting or expanding small businesses with interest-free capital",
    },
    {
      icon: Shield,
      title: "Emergency Support",
      description:
        "Covering bills during unexpected job loss or financial hardship",
    },
    {
      icon: Heart,
      title: "Medical Expenses",
      description:
        "Healthcare costs and medical emergencies for you and your family",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Trust-Based",
      description:
        "Built on mutual trust and community bonds, not credit scores or collateral. We believe in the inherent goodness of our community members.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Halal-First",
      description:
        "Completely interest-free and compliant with Islamic financial principles. Every transaction follows Shariah guidelines for ethical finance.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Community-Powered",
      description:
        "By the community, for the community - every member is both contributor and beneficiary in our mutual support system.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: TrendingUp,
      title: "Growth-Oriented",
      description:
        "Designed to grow with us over time, creating lasting financial dignity and sustainable prosperity for all members.",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const stats = [
    { number: "15,000+", label: "Community Members", icon: Users },
    { number: "$8.5M", label: "Interest-Free Loans", icon: TrendingUp },
    { number: "99.2%", label: "Repayment Rate", icon: CheckCircle },
    { number: "65+", label: "Countries Served", icon: Globe },
  ];

  const team = [
    {
      name: "Shafikul Islam",
      role: "Founder and President",
      description:
        "Professional Transportation Engineer working for Arcadis US Inc., a European based Multinational Consulting Firm. He received his MBA from Missouri State University and MS in Civil Engineering from University of Central Florida.",
      image: "https://mercyfi.com/wp-content/uploads/2020/06/1-shafik-2.jpg",
      email: "president@mercyfi.com",
    },
    {
      name: "KIM Iqbal",
      role: "Director (Finance)",
      description:
        "Graduate Researcher in the field of Structural Engineering. He is currently doing his Doctoral Study at Drexel University. He got his Masters in Structural Engineering from University of Texas at Rio Grande Valley.",
      image: "https://mercyfi.com/wp-content/uploads/2021/04/Iqbal-768x768.jpg",
      email: "finance@mercyfi.com",
    },
    {
      name: "Mohaiminul Haque",
      role: "Founding Director (Administrative)",
      description:
        "Graduate Researcher in the area of US surface Transportation. He is pursuing his Doctoral Study in Transportation Engineering at George Washington University. He got his bachelor's from Bangladesh University of Engineering and Technology.",
      image: "https://mercyfi.com/wp-content/uploads/2020/06/4-shimul-2.jpg",
      email: "admin@mercyfi.com",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "The Vision",
      description:
        "Conceived the idea of a trust-based, halal-first financial model during the global financial uncertainty, recognizing the need for ethical alternatives.",
    },
    {
      year: "2020",
      title: "Foundation Laid",
      description:
        "Established Mercy Financials with the first 100 founding members and $50K in initial funding, setting the groundwork for our community-driven approach.",
    },
    {
      year: "2021",
      title: "Community Growth",
      description:
        "Reached 2,500 members across 15 countries, facilitating over $500K in interest-free loans and proving the viability of our model.",
    },
    {
      year: "2022",
      title: "Technology Revolution",
      description:
        "Launched our advanced platform with AI-powered matching and blockchain-secured transactions, making the process more efficient and transparent.",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description:
        "Expanded to 45 countries with 8,000+ members and $3.2M in loans facilitated, establishing regional chapters worldwide.",
    },
    {
      year: "2024",
      title: "Movement Momentum",
      description:
        "Achieved 15,000+ members and $8.5M in interest-free loans, proving the model's sustainability and impact on global communities.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-x-hidden">
      {/* Hero Section with Arabic Blessing */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8 sm:mb-12"
          >
            {/* Arabic Blessing */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-4 text-gray-700 font-arabic">
                بسم الله الرحمن الرحيم
              </div>
              <p className="text-sm sm:text-base text-gray-600 italic">
                "In the name of Allah, the Most Gracious, the Most Merciful"
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs sm:text-sm px-3 sm:px-4 py-2">
                Building Financial Dignity • Interest-Free • Community-Powered
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                A Bit About Us
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6 sm:mb-8"
            >
              Working Towards a Better Tomorrow
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="max-w-5xl mx-auto bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg border border-rose-200"
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                Here at Mercy Financials, we see the value in everyone. We want
                to be a catalyst for positive change, and since our foundation,
                we've been driven by the same ideas we initially founded our
                organization upon: support, empowerment, and progress. Learn
                more about our mission, our vision, and how we go about making
                the changes we wish to see in the world of ethical finance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Background/Problem Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-400 to-emerald-500">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
              Background
            </h2>
            <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-white/20">
              <p className="text-sm sm:text-base md:text-lg text-white leading-relaxed text-justify">
                Very often we fall in a situation when we have to borrow money
                from a friend or bank or somewhere else, but in some cases, it
                becomes really critical - right? Your friend might not have the
                money you need and the bank will charge you at high interest for
                only a few categories of needs. In the US, the rent of an
                apartment is pretty much the same as a mortgage payment, but how
                could we manage the down payment or a halal mortgage? Many of us
                dream of starting a small business but where's the fund? If our
                job is suspended for a couple of weeks, how can we afford our
                family and pay the bills? In this era of interest-based economy,
                can we dream of an interest-free financial system? All these
                questions lead to one solution - a general/mutual fund that will
                be raised by us, structured for us, and grow with us which will
                establish the foundation of that system. So, would you help out
                by putting stone to that foundation? Just save a little with
                us...
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Want / How We View Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12"
          >
            <motion.div
              variants={itemVariants}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400 mr-3" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-400">
                  What We Want
                </h2>
              </div>
              <div className="space-y-4 text-white">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  We envision a world where financial assistance is based on
                  trust, community support, and Islamic principles. Our goal is
                  to create a sustainable ecosystem where members can save,
                  invest, and borrow without the burden of interest.
                </p>
                <ul className="text-left space-y-2 text-sm sm:text-base">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Interest-free financial solutions for all members
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Community-driven support system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Halal investment opportunities</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start mb-4 sm:mb-6">
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 mr-3" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400">
                  How We View
                </h2>
              </div>
              <div className="space-y-4 text-white">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  We see every member as a valuable contributor to our
                  collective success. Our approach is built on mutual respect,
                  transparency, and the belief that together we can create a
                  more equitable financial future.
                </p>
                <ul className="text-left space-y-2 text-sm sm:text-base">
                  <li className="flex items-start">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Every member has inherent value and potential</span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Transparency builds trust and community</span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Collective success benefits everyone</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Model Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
              Our Model
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              How It Works - Three Pillars of Financial Dignity
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {ourModel.map((model, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${model.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                    >
                      <model.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                      {model.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base text-justify">
                      {model.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
              The Challenges We Address
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Understanding the problems that led us to create this solution
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 md:mb-16"
          >
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-white h-full">
                  <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${challenge.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                    >
                      <challenge.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {challenge.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              In a system dominated by interest-based finance, many of us are
              left wondering:
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 mb-6 sm:mb-8">
              Is an interest-free financial future even possible?
            </p>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
            >
              We believe the answer is yes.
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 sm:mr-4"
              >
                <Sprout className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Real-Life Applications
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              How our community-powered solution helps in everyday situations
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="h-full"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4 md:p-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                    >
                      <useCase.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
              Our Foundation Principles
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              The core values that make our community-powered solution possible
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="h-full"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-white h-full">
                  <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                    >
                      <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
              Proven Impact, Growing Movement
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Real numbers from our thriving community of financial dignity
              builders
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="h-full"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="pt-4 sm:pt-6 md:pt-8 p-3 sm:p-4 md:p-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                    >
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: index * 0.1,
                      }}
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 mb-2"
                    >
                      {stat.number}
                    </motion.div>
                    <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
              Meet Our Leadership
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Dedicated professionals committed to building financial dignity
              for our global community
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="h-full"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-500 border-0 bg-white h-full">
                  <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden border-4 border-emerald-200"
                    >
                      <img
                        src={
                          member.image ||
                          "/placeholder.svg?height=200&width=200&text=" +
                            member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                        }
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-emerald-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                      {member.description}
                    </p>
                    {member.email && (
                      <div className="flex items-center justify-center text-xs sm:text-sm text-emerald-600">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:underline"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
              Our Journey
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From vision to reality - building the financial future we all
              deserve
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xs sm:text-sm md:text-base mx-auto sm:mx-0"
                >
                  {milestone.year}
                </motion.div>
                <div className="flex-1 pb-6 sm:pb-8 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Will You Be a Part of This Movement?
            </h2>
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8">
              <p>
                Your small contribution today can lay the first stone in a
                powerful, ethical, and inclusive financial future.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-700">
                Start saving with us. Grow together. Build the system we all
                deserve.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/sign-up">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  >
                    <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Join the Movement
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white/80 backdrop-blur-sm"
                  >
                    <BookOpen className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
