/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  Check,
  CreditCard,
  MapPin,
  MessageSquare,
  Phone,
  User,
  X,
  XIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import api from "@/api/axiosInstance";

interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any | null;
  onApprove?: (memberId: string) => void;
  onReject?: (memberId: string) => void;
}

export default function MemberDetailsModal({
  isOpen,
  onClose,
  member,
  onApprove,
  onReject,
}: MemberDetailsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member) return null;

  const handleApprove = async () => {
    if (!onApprove) {
      console.log("No onApprove callback provided");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Attempting to approve member:", member._id);

      // Check if api is properly imported and configured
      console.log("API instance:", api);

      // Method 1: Using the api instance (recommended)
      const response = await api.post(`/member/members/${member._id}/activate`);

      // Alternative Method 2: If api instance doesn't work, try direct fetch
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/members/${member._id}/activate`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Add any required authentication headers here
      //     // "Authorization": `Bearer ${token}`,
      //   },
      // });

      console.log("API Response:", response);

      // Check response based on which method you're using
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(
          `Failed to activate member: ${response.status} ${
            response.statusText || response.data?.message || ""
          }`
        );
      }

      console.log("Member activated successfully, calling onApprove callback");

      // Call the callback function
      await onApprove(member._id);

      console.log("Closing modal");
      onClose();
    } catch (error) {
      console.error("Failed to approve member:", error);

      // Set error message for user feedback
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred while approving the member");
      }

      // Don't close the modal on error so user can see the error message
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) {
      console.log("No onReject callback provided");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Attempting to reject member:", member._id);
      await onReject(member._id);
      onClose();
    } catch (error) {
      console.error("Failed to reject member:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred while rejecting the member");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Member Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete membership information
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/80 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Full Name:
                        </span>
                        <span className="text-gray-900">{member.fullName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="text-gray-900 break-all">
                          {member.email}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Phone:
                        </span>
                        <span className="text-gray-900">
                          {member.phoneNumber}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">Role:</span>
                        <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {member.role}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            member.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Driving License:
                        </span>
                        <a
                          href={`${member.drivingLicense}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900"
                        >
                          View License
                        </a>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Loan Eligibility:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            member.loanEligibility
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.loanEligibility ? "Eligible" : "Not Eligible"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="font-medium text-gray-700">
                          Member Since:
                        </span>
                        <span className="text-gray-900">
                          {formatDate(member.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membership Information */}
                <div className="space-y-4">
                  {member.membership ? (
                    <>
                      {/* Personal Details */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          Personal Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Date of Birth:
                            </span>
                            <span className="text-gray-900">
                              {formatDate(member.membership.dateOfBirth)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Membership Start:
                            </span>
                            <span className="text-gray-900">
                              {formatDate(
                                member.membership.membershipStartDate
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Monthly Savings:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              ${member.membership.monthlySavings}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Address Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-gray-700 block mb-1">
                              Primary Address:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.streetAddress}
                              <br />
                              {member.membership.city},{" "}
                              {member.membership.state}{" "}
                              {member.membership.zipCode}
                              <br />
                              {member.membership.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-orange-600" />
                          Emergency Contact
                        </h3>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Name:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.emergencyFirstName}{" "}
                              {member.membership.emergencyLastName}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Phone:
                            </span>
                            <span className="text-gray-900">
                              ({member.membership.emergencyAreaCode}){" "}
                              {member.membership.emergencyPhoneNumber}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Email:
                            </span>
                            <span className="text-gray-900 break-all">
                              {member.membership.emergencyEmail}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 block mb-1">
                              Address:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.emergencyStreetAddress}
                              {member.membership.emergencyStreetAddress2 &&
                                `, ${member.membership.emergencyStreetAddress2}`}
                              <br />
                              {member.membership.emergencyCity},{" "}
                              {member.membership.emergencyState}{" "}
                              {member.membership.emergencyZipCode}
                              <br />
                              {member.membership.emergencyCountry}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment & Referral */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                          Payment & Referral
                        </h3>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Payment Amount:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              ${member.membership.paymentAmount}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Transaction ID:
                            </span>
                            <span className="text-gray-900 font-mono text-sm">
                              {member.membership.paypalTransactionNumber}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Referral Name:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.referralName}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Referral Email:
                            </span>
                            <span className="text-gray-900 break-all">
                              {member.membership.referralEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback & Signature */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-gray-600" />
                          Feedback & Signature
                        </h3>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Will Recommend:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                member.membership.willRecommend === "yes"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {member.membership.willRecommend === "yes"
                                ? "Yes"
                                : "No"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 block mb-1">
                              Feedback:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.feedbackComment}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 block mb-1">
                              Suggestions:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.suggestions}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Signature:
                            </span>
                            <a
                              href={member.membership.signature}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-900 font-signature rounded-4xl hover:underline"
                            >
                              View Signature
                            </a>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Signature Date:
                            </span>
                            <span className="text-gray-900">
                              {member.membership.signatureDate}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="font-medium text-gray-700">
                              Acknowledgment:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                member.membership.acknowledgment
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {member.membership.acknowledgment
                                ? "Acknowledged"
                                : "Not Acknowledged"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <User className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-gray-600 text-lg">
                        No membership data available
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        This member hasn't completed their membership
                        application yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with Action Buttons */}

            <div className="border-t bg-gray-50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                  {isProcessing ? "Processing..." : "Reject Application"}
                </button>

                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {isProcessing ? "Processing..." : "Approve Application"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
