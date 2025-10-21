import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, FileText, AlertCircle, Clock, Plus } from 'lucide-react';

export default function ApplicationForm() {
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    subject: "",
    priorityLevel: "medium", // Changed from 'priority' to 'priorityLevel' to match API
    message: "",
    attachments: [] as File[],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

const handleApplicationSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);
  

  if (!applicationForm.subject.trim()) {
    setError("Subject is required");
    return;
  }

  setIsSubmittingApplication(true);

  try {
    const payload = {
      subject: applicationForm.subject.trim(),
      priorityLevel: applicationForm.priorityLevel,
      message: applicationForm.message.trim(),
    };

    console.log('Sending payload:', payload); // Debug log

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log('Response:', responseData); // Debug log

    if (!response.ok) {
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }

    setSuccess("Application submitted successfully!");
    
    // Reset form
    setApplicationForm({
      subject: "",
      priorityLevel: "medium",
      message: "",
      attachments: [],
    });

  } catch (err) {
    console.error('Error submitting application:', err);
    setError(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
  } finally {
    setIsSubmittingApplication(false);
  }
};

  // Alternative version if your API expects JSON instead of FormData
  // const handleApplicationSubmitJSON = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);
    
  //   // Validation
  //   if (applicationForm.message.length < 20) {
  //     setError("Message must be at least 20 characters long");
  //     return;
  //   }

  //   setIsSubmittingApplication(true);

  //   try {
  //     const payload = {
  //       subject: applicationForm.subject,
  //       priorityLevel: applicationForm.priorityLevel,
  //       message: applicationForm.message,
  //       // Note: Files would need to be handled separately if using JSON
  //     };

  //     const response = await fetch('http://localhost:3000/api/contact-admin', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to submit application');
  //     }

  //     const data = await response.json();
  //     setSuccess("Application submitted successfully!");
      
  //     // Reset form
  //     setApplicationForm({
  //       subject: "",
  //       priorityLevel: "medium",
  //       message: "",
  //       attachments: [],
  //     });

  //   } catch (err) {
  //     console.error('Error submitting application:', err);
  //     setError(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
  //   } finally {
  //     setIsSubmittingApplication(false);
  //   }
  // };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2 text-emerald-600" />
            Contact Admin
          </CardTitle>
          <CardDescription>
            Submit your queries, requests, or applications directly to our admin
            team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleApplicationSubmit} className="space-y-6">
            {/* Subject and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={applicationForm.subject}
                  onChange={(e) =>
                    setApplicationForm((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Brief description of your request"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
              <select
                value={applicationForm.priorityLevel}
                onChange={(e) =>
                  setApplicationForm((prev) => ({
                    ...prev,
                    priorityLevel: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent</option>
              </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Message *
              </label>
              <textarea
                required
                rows={6}
                value={applicationForm.message}
                onChange={(e) =>
                  setApplicationForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                placeholder="Please provide detailed information about your request, including any relevant details that would help us assist you better..."
              />
              {/* <p className="mt-1 text-sm text-gray-500">
                {applicationForm.message.length < 20 ? (
                  <span className="text-red-500">
                    {20 - applicationForm.message.length} more characters required
                  </span>
                ) : (
                  "Minimum 20 characters required"
                )}
              </p> */}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setApplicationForm((prev) => ({
                      ...prev,
                      attachments: files,
                    }));
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Click to upload files or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB each)
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {applicationForm.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected files:
                  </p>
                  {applicationForm.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFiles = applicationForm.attachments.filter(
                            (_, i) => i !== index
                          );
                          setApplicationForm((prev) => ({
                            ...prev,
                            attachments: newFiles,
                          }));
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Response Time Information
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • <strong>Urgent:</strong> Within 2-4 hours
                    </li>
                    <li>
                      • <strong>High Priority:</strong> Within 24 hours
                    </li>
                    <li>
                      • <strong>Medium Priority:</strong> Within 2-3 business
                      days
                    </li>
                    <li>
                      • <strong>Low Priority:</strong> Within 5-7 business days
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={
                  isSubmittingApplication || 
                  applicationForm.message.length < 20 ||
                  !applicationForm.subject.trim()
                }
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingApplication ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-4 h-4 mr-2"
                    >
                      <Clock className="w-4 h-4" />
                    </motion.div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setApplicationForm({
                    subject: "",
                    priorityLevel: "medium",
                    message: "",
                    attachments: [],
                  });
                  setError(null);
                  setSuccess(null);
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}