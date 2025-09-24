import { useCallback, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Loader2,
  Camera,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExtractedData {
  transactionId?: string;
  amount?: string;
  date?: string;
  bankName?: string;
  accountNumber?: string;
  reference?: string;
  rawText: string;
}

interface DocumentUploadProps {
  onVerificationComplete?: (isValid: boolean, data: ExtractedData) => void;
  expectedAmount?: string;
  expectedTransactionId?: string;
}

export default function DocumentUpload({
  onVerificationComplete,
  expectedAmount,
  expectedTransactionId,
}: DocumentUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);
  const [showRawText, setShowRawText] = useState(false);

  // Manual input fields for verification
  const [manualTransactionId, setManualTransactionId] = useState("");
  const [manualAmount, setManualAmount] = useState("");

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setExtractedData(null);
    setVerificationStatus(null);

    // Auto-start Gemini processing
    processDocumentWithGemini(file);
  }, []);

  const processDocumentWithGemini = async (file: File) => {
    setIsProcessing(true);

    try {
      toast.info("Analyzing document with Gemini AI...");

      // Convert file to base64
      const base64 = await fileToBase64(file);

      // Import the utility function
      const { analyzeDocumentWithGemini } = await import(
        "../../utils/geminiClient"
      );

      // Call Gemini API through utility
      const result = await analyzeDocumentWithGemini({
        image: base64,
        expectedAmount,
        expectedTransactionId,
        prompt: `Analyze this financial document/transaction receipt and extract the following information:
      1. Transaction ID or Reference Number
      2. Amount (numerical value only)
      3. Date of transaction
      4. Bank name or payment provider
      5. Account number (if visible)
      
      Please respond in JSON format with these fields:
      {
        "transactionId": "extracted transaction ID",
        "amount": "numerical amount only",
        "date": "transaction date",
        "bankName": "bank or provider name",
        "accountNumber": "account number if visible",
        "confidence": "high/medium/low",
        "rawText": "all visible text in the image"
      }
      
      Expected values for verification:
      - Expected Amount: ${expectedAmount || "Not provided"}
      - Expected Transaction ID: ${expectedTransactionId || "Not provided"}
      
      Also verify if the extracted values match the expected values and indicate if verification passes.`,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      const extracted: ExtractedData = {
        transactionId: result.transactionId,
        amount: result.amount,
        date: result.date,
        bankName: result.bankName,
        accountNumber: result.accountNumber,
        rawText: result.rawText || "AI analysis completed",
      };

      setExtractedData(extracted);

      // Perform verification if expected values are provided
      if (expectedAmount || expectedTransactionId) {
        const isValid = verifyTransaction(
          extracted,
          expectedAmount,
          expectedTransactionId
        );
        setVerificationStatus(isValid ? "success" : "failed");
        onVerificationComplete?.(isValid, extracted);

        if (isValid) {
          toast.success("Document verified successfully!");
        } else {
          toast.error(
            "Document verification failed. Please check the details."
          );
        }
      } else {
        toast.success("Document processed successfully!");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast.error(
        "Failed to process document. Please try again or enter details manually."
      );
      setVerificationStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const verifyTransaction = (
    extracted: ExtractedData,
    expectedAmount?: string,
    expectedTxnId?: string
  ): boolean => {
    let isValid = true;

    if (expectedAmount && extracted.amount) {
      const extractedAmount = Number.parseFloat(
        extracted.amount.replace(/[^0-9.]/g, "")
      );
      const expectedAmountNum = Number.parseFloat(
        expectedAmount.replace(/[^0-9.]/g, "")
      );

      if (Math.abs(extractedAmount - expectedAmountNum) > 0.01) {
        isValid = false;
      }
    }

    if (expectedTxnId && extracted.transactionId) {
      if (
        extracted.transactionId.toLowerCase() !== expectedTxnId.toLowerCase()
      ) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleManualVerification = () => {
    if (!manualTransactionId || !manualAmount) {
      toast.error("Please fill in both transaction ID and amount");
      return;
    }

    const manualData: ExtractedData = {
      transactionId: manualTransactionId,
      amount: manualAmount,
      rawText: "Manual entry",
    };

    const isValid = verifyTransaction(
      manualData,
      expectedAmount,
      expectedTransactionId
    );
    setVerificationStatus(isValid ? "success" : "failed");
    setExtractedData(manualData);
    onVerificationComplete?.(isValid, manualData);

    if (isValid) {
      toast.success("Manual verification successful!");
    } else {
      toast.error("Manual verification failed. Please check the details.");
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setVerificationStatus(null);
    setShowRawText(false);
    setManualTransactionId("");
    setManualAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!uploadedFile && (
        <Card className="border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
          <CardContent className="p-8">
            <div
              className="text-center cursor-pointer"
              onClick={() =>
                document.getElementById("document-upload")?.click()
              }
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
              >
                <Upload className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Transaction Document
              </h3>
              <p className="text-gray-600 mb-4">
                Upload a screenshot or photo of your transaction receipt
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  JPG, PNG
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  Mobile Screenshots
                </div>
              </div>
            </div>
            <input
              id="document-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-6 h-6 text-emerald-600" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-medium text-emerald-900">
                      Analyzing Document with AI...
                    </p>
                    <p className="text-sm text-emerald-700 mt-1">
                      Using Gemini AI to extract transaction details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Preview and Results */}
      {uploadedFile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Document Preview
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetUpload}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {previewUrl && (
                <div className="space-y-4">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Document preview"
                    className="w-full h-64 object-contain border rounded-lg bg-gray-50"
                  />
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>File:</strong> {uploadedFile.name}
                    </p>
                    <p>
                      <strong>Size:</strong>{" "}
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  AI Extracted Information
                </div>
                {verificationStatus && (
                  <Badge
                    className={
                      verificationStatus === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {verificationStatus === "success" ? "Verified" : "Failed"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {extractedData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Transaction ID
                      </Label>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {extractedData.transactionId || "Not found"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Amount
                      </Label>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {extractedData.amount
                          ? `$${extractedData.amount}`
                          : "Not found"}
                      </p>
                    </div>
                    {extractedData.date && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Date
                        </Label>
                        <p className="text-sm bg-gray-50 p-2 rounded">
                          {extractedData.date}
                        </p>
                      </div>
                    )}
                    {extractedData.bankName && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Bank
                        </Label>
                        <p className="text-sm bg-gray-50 p-2 rounded">
                          {extractedData.bankName}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRawText(!showRawText)}
                      className="mb-3"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showRawText ? "Hide" : "Show"} AI Analysis
                    </Button>

                    <AnimatePresence>
                      {showRawText && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto"
                        >
                          {extractedData.rawText}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {verificationStatus === "failed" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        <p className="text-sm font-medium text-red-800">
                          Verification Failed
                        </p>
                      </div>
                      <p className="text-sm text-red-700">
                        The extracted data doesn't match the expected values.
                        Please verify manually or upload a clearer image.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Upload a document to see AI extracted information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manual Entry Fallback */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Manual Entry</CardTitle>
          <p className="text-sm text-blue-700">
            If AI extraction fails, you can enter the details manually
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manual-txn-id">Transaction ID</Label>
              <Input
                id="manual-txn-id"
                value={manualTransactionId}
                onChange={(e) => setManualTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="manual-amount">Amount</Label>
              <Input
                id="manual-amount"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white"
              />
            </div>
          </div>
          <Button
            onClick={handleManualVerification}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            disabled={!manualTransactionId || !manualAmount}
          >
            Verify Manually
          </Button>
        </CardContent>
      </Card>

      {/* Expected Values Display */}
      {(expectedAmount || expectedTransactionId) && (
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-gray-900">Expected Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {expectedTransactionId && (
                <div>
                  <Label className="text-gray-600">
                    Expected Transaction ID
                  </Label>
                  <p className="font-mono bg-white p-2 rounded border">
                    {expectedTransactionId}
                  </p>
                </div>
              )}
              {expectedAmount && (
                <div>
                  <Label className="text-gray-600">Expected Amount</Label>
                  <p className="font-mono bg-white p-2 rounded border">
                    ${expectedAmount}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
