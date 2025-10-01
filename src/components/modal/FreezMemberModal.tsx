/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FreezeMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any | null;
  onConfirm: (status: "freez" | "active") => void;
}

export default function FreezeMemberModal({
  isOpen,
  onClose,
  member,
  onConfirm,
}: FreezeMemberModalProps) {
  if (!member) return null;

  const nextStatus = member.status === "freez" ? "active" : "freez";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {nextStatus === "freez" ? "Freeze Member" : "Activate Member"}
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-medium">{nextStatus}</span> member{" "}
              <span className="font-semibold">{member.fullName}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(nextStatus as "freez" | "active")}
                className={`px-4 py-2 rounded-lg text-white ${
                  nextStatus === "freez"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {nextStatus === "freez" ? "Freeze" : "Activate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
