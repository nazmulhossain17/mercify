import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageCircle} from 'lucide-react';

interface RestrictedAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFrozen: boolean;
}

export default function RestrictedAccessModal({ isOpen, onClose, isFrozen }: RestrictedAccessModalProps) {
  const messages = {
    frozen: {
      title: "Account Frozen",
      description: "Your account has been temporarily frozen. Please contact admin to restore access to all features.",
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      buttonText: "Contact Admin Now"
    },
    active: {
      title: "Account Activation Required",
      description: "Your account needs to be activated by admin to access all features. Please contact admin for activation.",
      icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
      buttonText: "Contact Admin"
    }
  };

  // Use isFrozen boolean to determine which message to show
  const message = isFrozen ? messages.frozen : messages.active;

  const handleContactAdmin = () => {
    onClose();
    window.location.href = '/dashboard/application-form';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white"
        >
          <DialogHeader className="relative p-6 pb-4">
            <DialogTitle className="text-center text-xl">
              {message.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 h-4 w-4 p-0"
            >
              {/* <X className="w-4 h-4" /> */}
            </Button>
          </DialogHeader>
          
          <div className="px-6 pb-6 text-center">
            <div className="flex justify-center mb-4">
              {message.icon}
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {message.description}
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleContactAdmin}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {message.buttonText}
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Continue with Limited Access
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}