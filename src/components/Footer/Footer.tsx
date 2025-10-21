import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

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

  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full"
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
              >
                <img
                  src="/images/logo.png"
                  alt="Mercy Financials"
                  className="h-10 w-auto object-contain"
                />
              </motion.div>
              <span className="text-xl sm:text-2xl font-bold">
                Mercy Financials
              </span>
            </div>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Connecting communities through interest-free lending based on
              Islamic principles.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400">
            {["home", "about", "how-it-works", "testimonials"].map(
              (section) => (
                <li key={section}>
                  <Link
                    to={section.toLowerCase()}
                    className="hover:text-white transition-colors capitalize text-left text-sm sm:text-base"
                    onClick={() => scrollToSection(section)}
                  >
                    {section.replace("-", " ")}
                  </Link>
                </li>
              )
            )}
          </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400">
              {[
                "Request Loan",
                "Offer Help",
                "Community Support",
                "Financial Guidance",
              ].map((service) => (
                <li key={service}>
                  <motion.a
                    whileHover={{ x: 5, color: "#ffffff" }}
                    href="#"
                    className="hover:text-white transition-colors text-sm sm:text-base"
                  >
                    {service}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Contact
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base lg:text-lg">
              <li>321-314-8170</li>
              <li className="break-words">info@alamanah.org</li>
              <li>5625 Nottingham Dr</li>
              <li>Lilburn, GA 30047</li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base lg:text-lg"
        >
          <p>
            &copy; 2025 Mercy Financials. All rights reserved. Built with
            Islamic principles in mind.
          </p>
          <p className="mt-2">
            Developed by{" "}
            <a
              href="https://itbeesolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:text-emerald-400 transition-colors"
            >
              ITBee Solution
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
