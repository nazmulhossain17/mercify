// components/restricted-overlay.tsx
import { motion } from 'framer-motion';
import { Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestrictedOverlayProps {
  isRestricted: boolean;
  status: 'freez'; // Allow both status types
}

export default function RestrictedOverlay({ isRestricted, status }: RestrictedOverlayProps) {
  if (!isRestricted) return null;

  const messages = {
    freez: {
      title: "Account Frozen",
      description: "This feature is not available while your account is frozen.",
      icon: <Lock className="w-8 h-8" />
    },
    active: {
      title: "Activation Required",
      description: "Please activate your account to access this feature.",
      icon: <Lock className="w-8 h-8" />
    }
  };

  const message = messages[status];

  const handleContactAdmin = () => {
    window.location.href = '/dashboard/application-form';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="flex justify-center mb-4 text-gray-400">
          {message.icon}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {message.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {message.description}
        </p>
        
        <Button
          onClick={handleContactAdmin}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contact Admin
        </Button>
      </motion.div>
    </motion.div>
  );
}