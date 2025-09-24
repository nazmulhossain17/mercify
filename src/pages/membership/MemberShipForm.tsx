import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Phone, CreditCard, FileCheck, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PersonalInformationStep } from "@/components/membership-step/personal-information";
import { EmergencyContactStep } from "@/components/membership-step/EmergencyContactStep";
import { MembershipQuestionsStep } from "@/components/membership-step/MembershipQuestionsStep";
import { AcknowledgmentStep } from "@/components/membership-step/AcknowledgmentStep";
import { PaymentStep } from "@/components/membership-step/PaymentStep";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

// Form validation schema
export interface FormData {
  memberId?: string;

  // Personal Information
  dateOfBirth: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Emergency Contact
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyStreetAddress: string;
  emergencyStreetAddress2?: string;
  emergencyCity: string;
  emergencyState: string;
  emergencyZipCode: string;
  emergencyCountry: string;
  emergencyAreaCode: string; // ✅ Add this line
  emergencyPhoneNumber: string;
  emergencyEmail: string;

  // Membership Questions
  membershipStartDate: string;
  monthlySavings: string;
  willRecommend: "yes" | "maybe" | "no" | "";
  feedbackComment?: string;
  suggestions?: string;

  // Acknowledgment & Signature
  acknowledgment: boolean;
  signature: string;
  signatureDate: string;

  // Payment
  paymentAmount: string;
  paypalTransactionNumber: string;
}
const steps = [
  { id: "personal", title: "Personal Information", icon: User },
  { id: "emergency", title: "Emergency Contact", icon: Phone },
  { id: "membership", title: "Membership Questions", icon: HelpCircle },
  {
    id: "acknowledgment",
    title: "Acknowledgment & Signature",
    icon: FileCheck,
  },
  { id: "payment", title: "Payment", icon: CreditCard },
];

export function MembershipForm() {
  const currentUser = useAppSelector(selectUser);
  console.log("Current user:", currentUser?.id);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    memberId: currentUser?.id || "",
    dateOfBirth: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    emergencyFirstName: "",
    emergencyLastName: "",
    emergencyStreetAddress: "",
    emergencyStreetAddress2: "",
    emergencyCity: "",
    emergencyState: "",
    emergencyZipCode: "",
    emergencyCountry: "",
    emergencyPhoneNumber: "",
    emergencyEmail: "",
    membershipStartDate: "",
    monthlySavings: "",
    emergencyAreaCode: "",
    willRecommend: "",
    feedbackComment: "",
    suggestions: "",
    acknowledgment: false,
    signature: "",
    signatureDate: "",
    paymentAmount: "",
    paypalTransactionNumber: "",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      memberId: currentUser?.id || prev.memberId,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="text-lg text-muted-foreground font-arabic">
          بسم الله الرحمن الرحيم
        </div>
        <div className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
          <p>
            Assalamu Alaikum! Welcome to the membership area of Mercy
            Financials. You are just one step away to become a registered
            member! Mercy Financials is a US non-profit organization registered
            in the State of Texas (check the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Status
            </a>
            ). Mercy is giving you a unique opportunity to save and get
            interest-free loans whenever you need them. Your savings could start
            from as low as $50/month. Please visit{" "}
            <a
              href="https://www.mercyfi.com"
              className="text-blue-600 hover:underline"
            >
              www.mercyfi.com
            </a>
            , read the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Bylaws
            </a>
            , contact the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              board
            </a>
            , or email{" "}
            <a
              href="mailto:mercyfinancials@gmail.com"
              className="text-blue-600 hover:underline"
            >
              mercyfinancials@gmail.com
            </a>{" "}
            should you have any questions. And, jump in-----
          </p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps.length}
        </div>
      </motion.div>

      {/* Step Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 md:gap-4"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                  : isCompleted
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Form Content */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3"
          >
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon className="w-6 h-6 text-orange-500" />;
            })()}
            <h2 className="text-xl font-semibold text-orange-500">
              {steps[currentStep].title}
            </h2>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <PersonalInformationStep
                  data={formData}
                  updateData={updateFormData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 1 && (
                <EmergencyContactStep
                  data={formData}
                  updateData={updateFormData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 2 && (
                <MembershipQuestionsStep
                  data={formData}
                  updateData={updateFormData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && (
                <AcknowledgmentStep
                  data={formData}
                  updateData={updateFormData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 4 && (
                <PaymentStep
                  data={formData}
                  updateData={updateFormData}
                  onPrev={prevStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
