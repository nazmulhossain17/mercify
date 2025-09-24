import SavingsForm from "@/components/savings/SavingsForm";

// interface ExtractedData {
//   transactionId?: string;
//   amount?: string;
//   date?: string;
//   bankName?: string;
//   accountNumber?: string;
//   reference?: string;
//   rawText: string;
// }

// interface SavingsEntry {
//   id: string;
//   userId: number;
//   amount: number;
//   transactionId: string;
//   paymentMethod: string[];
//   date: string;
//   status: "completed" | "pending";
//   documentVerified?: boolean;
// }

// interface User {
//   id: number;
//   email: string;
//   name?: string;
// }

// export default function SavingsPage() {
//   const [expectedTransactionId, setExpectedTransactionId] = useState("");
//   const [expectedAmount, setExpectedAmount] = useState("");
//   const [verificationResult, setVerificationResult] = useState<{
//     isValid: boolean;
//     data: ExtractedData;
//   } | null>(null);

//   // Savings related state
//   const [user, setUser] = useState<User | null>(null);
//   const [totalSavings, setTotalSavings] = useState(0);
//   const [savingsGoal, setSavingsGoal] = useState(1000);
//   console.log(setSavingsGoal);
//   const [quickAmounts] = useState([50, 100, 250, 500]);
//   const [paymentMethods, setPaymentMethods] = useState<string[]>(["card"]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   console.log(success);

//   useEffect(() => {
//     try {
//       const userString = localStorage.getItem("user");
//       if (userString) {
//         const userData = JSON.parse(userString);
//         setUser(userData);
//         loadUserSavings(userData.id);
//       }
//     } catch (err) {
//       console.error("Error getting user from localStorage:", err);
//       setError("Unable to retrieve user information. Please log in again.");
//     }
//   }, []);

//   const loadUserSavings = (userId: number) => {
//     try {
//       const savingsString = localStorage.getItem("userSavings");
//       if (savingsString) {
//         const allSavings: SavingsEntry[] = JSON.parse(savingsString);
//         const userSavings = allSavings.filter(
//           (saving) => saving.userId === userId
//         );
//         const total = userSavings.reduce(
//           (sum, saving) => sum + saving.amount,
//           0
//         );
//         setTotalSavings(total);
//       }
//     } catch (err) {
//       console.error("Error loading savings:", err);
//     }
//   };

//   const handleVerificationComplete = (
//     isValid: boolean,
//     data: ExtractedData
//   ) => {
//     setVerificationResult({ isValid, data });

//     if (isValid) {
//       // Auto-fill the expected values with extracted data
//       if (data.transactionId) {
//         setExpectedTransactionId(data.transactionId);
//       }
//       if (data.amount) {
//         setExpectedAmount(data.amount);
//       }
//       toast.success("Document verification successful! ✅");
//     } else {
//       toast.error("Document verification failed! ❌");
//     }
//   };

//   const handleQuickAmount = (quickAmount: number) => {
//     setExpectedAmount(quickAmount.toString());
//   };

//   const togglePaymentMethod = (method: string) => {
//     if (paymentMethods.includes(method)) {
//       setPaymentMethods(paymentMethods.filter((m) => m !== method));
//     } else {
//       setPaymentMethods([...paymentMethods, method]);
//     }
//   };

//   const handleSavingsSubmit = async () => {
//     if (!user) {
//       setError("User information not found. Please log in again.");
//       toast.error("Authentication Error");
//       return;
//     }

//     if (
//       !expectedAmount ||
//       isNaN(Number(expectedAmount)) ||
//       Number(expectedAmount) <= 0
//     ) {
//       setError("Please enter a valid amount");
//       return;
//     }

//     if (!expectedTransactionId.trim()) {
//       setError("Transaction ID is required");
//       return;
//     }

//     if (!verificationResult?.isValid) {
//       setError("Please verify your document first");
//       return;
//     }

//     setError(null);
//     setIsSubmitting(true);

//     try {
//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Create new savings entry with document verification
//       const newSaving: SavingsEntry = {
//         id: Date.now().toString(),
//         userId: user.id,
//         amount: Number(expectedAmount),
//         transactionId: expectedTransactionId.trim(),
//         paymentMethod: paymentMethods,
//         date: new Date().toISOString(),
//         status: "completed",
//         documentVerified: true,
//       };

//       // Get existing savings from localStorage
//       const existingSavingsString = localStorage.getItem("userSavings");
//       const existingSavings: SavingsEntry[] = existingSavingsString
//         ? JSON.parse(existingSavingsString)
//         : [];

//       // Add new saving
//       const updatedSavings = [...existingSavings, newSaving];
//       localStorage.setItem("userSavings", JSON.stringify(updatedSavings));

//       // Update total savings
//       setTotalSavings((prev) => prev + Number(expectedAmount));

//       setSuccess(true);
//       setExpectedAmount("");
//       setExpectedTransactionId("");
//       setPaymentMethods(["card"]);
//       setVerificationResult(null);

//       toast.success(
//         "Savings Added Successfully with Document Verification! 🎉"
//       );

//       // Reset success message after 3 seconds
//       setTimeout(() => {
//         setSuccess(false);
//       }, 3000);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "An unexpected error occurred";
//       setError(errorMessage);
//       toast.error("Error adding savings");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetVerification = () => {
//     setVerificationResult(null);
//     setExpectedTransactionId("");
//     setExpectedAmount("");
//     setError(null);
//   };

//   const progressPercentage = Math.min((totalSavings / savingsGoal) * 100, 100);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
//       {/* Header */}
//       <div className="bg-white/90 backdrop-blur-md border-b border-emerald-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Link to="/dashboard">
//                 <Button variant="ghost" size="sm">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Dashboard
//                 </Button>
//               </Link>
//               <div className="flex items-center gap-2">
//                 <PiggyBank className="h-6 w-6 text-emerald-600" />
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     Savings with Document Verification
//                   </h1>
//                   <p className="text-gray-600">
//                     Upload and verify transaction documents to add to your
//                     savings
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="space-y-8">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Total Savings</p>
//                     <p className="text-3xl font-bold text-emerald-700">
//                       ${totalSavings.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-emerald-100 p-3 rounded-full">
//                     <Wallet className="h-6 w-6 text-emerald-600" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Savings Goal</p>
//                     <p className="text-3xl font-bold text-teal-700">
//                       ${savingsGoal.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-teal-100 p-3 rounded-full">
//                     <Target className="h-6 w-6 text-teal-600" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">Progress</p>
//                     <p className="text-3xl font-bold text-green-700">
//                       {progressPercentage.toFixed(1)}%
//                     </p>
//                   </div>
//                   <div className="bg-green-100 p-3 rounded-full">
//                     <TrendingUp className="h-6 w-6 text-green-600" />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Progress Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//           >
//             <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="font-semibold text-emerald-800">
//                   Savings Progress
//                 </h3>
//                 <Badge
//                   variant="secondary"
//                   className="bg-emerald-100 text-emerald-700"
//                 >
//                   ${(savingsGoal - totalSavings).toLocaleString()} to go
//                 </Badge>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <motion.div
//                   className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressPercentage}%` }}
//                   transition={{ duration: 1, ease: "easeOut" }}
//                 />
//               </div>
//             </div>
//           </motion.div>

//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Document Upload Section */}
//             <div className="lg:col-span-2">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//               >
//                 <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
//                   <CardHeader>
//                     <CardTitle>Document Verification & Savings</CardTitle>
//                     <p className="text-sm text-gray-600">
//                       Upload your transaction document to automatically extract
//                       and verify details
//                     </p>
//                   </CardHeader>
//                   <CardContent>
//                     {/* Quick Amount Buttons */}
//                     <div className="space-y-4 mb-6">
//                       <Label className="text-emerald-700 font-medium">
//                         Quick Amounts
//                       </Label>
//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                         {quickAmounts.map((quickAmount) => (
//                           <Button
//                             key={quickAmount}
//                             type="button"
//                             variant={
//                               expectedAmount === quickAmount.toString()
//                                 ? "default"
//                                 : "outline"
//                             }
//                             size="sm"
//                             onClick={() => handleQuickAmount(quickAmount)}
//                             className={`${
//                               expectedAmount === quickAmount.toString()
//                                 ? "bg-emerald-600 hover:bg-emerald-700 text-white"
//                                 : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//                             }`}
//                           >
//                             ${quickAmount}
//                           </Button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Expected Values Input */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                       <div>
//                         <Label htmlFor="expected-amount">Expected Amount</Label>
//                         <div className="relative">
//                           <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
//                           <Input
//                             id="expected-amount"
//                             type="number"
//                             value={expectedAmount}
//                             onChange={(e) => setExpectedAmount(e.target.value)}
//                             placeholder="e.g., 1500.00"
//                             className="pl-10 border-emerald-200 focus:border-emerald-400"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <Label htmlFor="expected-txn-id">
//                           Expected Transaction ID
//                         </Label>
//                         <Input
//                           id="expected-txn-id"
//                           value={expectedTransactionId}
//                           onChange={(e) =>
//                             setExpectedTransactionId(e.target.value)
//                           }
//                           placeholder="e.g., TXN123456789"
//                           className="border-emerald-200 focus:border-emerald-400"
//                         />
//                       </div>
//                     </div>

//                     {/* Payment Methods */}
//                     <div className="space-y-3 mb-6">
//                       <Label className="text-emerald-700 font-medium">
//                         Payment Methods
//                       </Label>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                         <label
//                           className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all hover:border-emerald-400 ${
//                             paymentMethods.includes("card")
//                               ? "border-emerald-500 bg-emerald-50"
//                               : "border-emerald-200 bg-white"
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <input
//                               type="checkbox"
//                               checked={paymentMethods.includes("card")}
//                               onChange={() => togglePaymentMethod("card")}
//                               className="h-4 w-4 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500"
//                             />
//                             <div>
//                               <span className="font-medium text-gray-900">
//                                 Credit Card
//                               </span>
//                               <p className="text-xs text-gray-500">
//                                 Visa, Mastercard
//                               </p>
//                             </div>
//                           </div>
//                           <CreditCard className="h-5 w-5 text-emerald-600" />
//                         </label>

//                         <label
//                           className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all hover:border-emerald-400 ${
//                             paymentMethods.includes("paypal")
//                               ? "border-emerald-500 bg-emerald-50"
//                               : "border-emerald-200 bg-white"
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <input
//                               type="checkbox"
//                               checked={paymentMethods.includes("paypal")}
//                               onChange={() => togglePaymentMethod("paypal")}
//                               className="h-4 w-4 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500"
//                             />
//                             <div>
//                               <span className="font-medium text-gray-900">
//                                 PayPal
//                               </span>
//                               <p className="text-xs text-gray-500">
//                                 Online payment
//                               </p>
//                             </div>
//                           </div>
//                           <svg
//                             className="h-5 w-5 text-blue-600"
//                             viewBox="0 0 24 24"
//                             fill="currentColor"
//                           >
//                             <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42c-.561 3.497-3.394 5.984-7.55 5.984H11.11c-.524 0-.968.382-1.05.9l-1.585 10.048c-.041.26.15.5.414.5h2.99c.344 0 .636-.248.689-.586l.027-.14.683-4.334.044-.237c.053-.339.345-.586.69-.586h.617c2.814 0 5.018-.51 5.667-1.99.196-.446.315-.955.393-1.519.365-2.443-.003-4.11-1.563-5.04z" />
//                           </svg>
//                         </label>
//                       </div>
//                     </div>

//                     {/* Error Message */}
//                     {error && (
//                       <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
//                         {error}
//                       </div>
//                     )}

//                     {/* Document Upload Component */}
//                     <DocumentUpload
//                       expectedAmount={expectedAmount || undefined}
//                       expectedTransactionId={expectedTransactionId || undefined}
//                       onVerificationComplete={handleVerificationComplete}
//                     />

//                     {/* Add to Savings Button */}
//                     {verificationResult?.isValid && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         className="mt-6"
//                       >
//                         <Button
//                           onClick={handleSavingsSubmit}
//                           disabled={isSubmitting || !user}
//                           className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 text-lg font-semibold shadow-lg"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <motion.div
//                                 animate={{ rotate: 360 }}
//                                 transition={{
//                                   duration: 2,
//                                   repeat: Number.POSITIVE_INFINITY,
//                                   ease: "linear",
//                                 }}
//                                 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
//                               />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <Plus className="h-5 w-5 mr-2" />
//                               Add ${expectedAmount} to Savings
//                             </>
//                           )}
//                         </Button>
//                       </motion.div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-6">
//               {/* Verification Status */}
//               {verificationResult && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <Card
//                     className={`border-2 ${
//                       verificationResult.isValid
//                         ? "border-green-200 bg-green-50"
//                         : "border-red-200 bg-red-50"
//                     }`}
//                   >
//                     <CardHeader>
//                       <CardTitle
//                         className={`flex items-center ${
//                           verificationResult.isValid
//                             ? "text-green-800"
//                             : "text-red-800"
//                         }`}
//                       >
//                         {verificationResult.isValid ? (
//                           <CheckCircle className="w-6 h-6 mr-2" />
//                         ) : (
//                           <AlertCircle className="w-6 h-6 mr-2" />
//                         )}
//                         Verification{" "}
//                         {verificationResult.isValid ? "Successful" : "Failed"}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div>
//                           <Label className="text-sm font-medium">
//                             Extracted Transaction ID
//                           </Label>
//                           <p className="text-sm font-mono bg-white p-2 rounded border">
//                             {verificationResult.data.transactionId ||
//                               "Not found"}
//                           </p>
//                         </div>
//                         <div>
//                           <Label className="text-sm font-medium">
//                             Extracted Amount
//                           </Label>
//                           <p className="text-sm font-mono bg-white p-2 rounded border">
//                             {verificationResult.data.amount
//                               ? `$${verificationResult.data.amount}`
//                               : "Not found"}
//                           </p>
//                         </div>
//                         <Button
//                           onClick={resetVerification}
//                           variant="outline"
//                           className="w-full bg-white"
//                         >
//                           Verify Another Document
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               )}

//               {/* Security Info */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.5 }}
//               >
//                 <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-emerald-100 p-2 rounded-full">
//                       <Shield className="h-5 w-5 text-emerald-600" />
//                     </div>
//                     <h3 className="font-semibold text-emerald-800">
//                       Secure & Protected
//                     </h3>
//                   </div>
//                   <ul className="space-y-2 text-sm text-gray-600">
//                     <li className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-emerald-500" />
//                       Document OCR verification
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-emerald-500" />
//                       Bank-level encryption
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-emerald-500" />
//                       FDIC insured up to $250,000
//                     </li>
//                     <li className="flex items-center gap-2">
//                       <Check className="h-4 w-4 text-emerald-500" />
//                       24/7 fraud monitoring
//                     </li>
//                   </ul>
//                 </div>
//               </motion.div>

//               {/* Instructions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//               >
//                 <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
//                   <CardHeader>
//                     <CardTitle>How to Use</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4 text-sm text-gray-600">
//                       <div className="flex items-start space-x-3">
//                         <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-emerald-600 font-semibold text-xs">
//                             1
//                           </span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             Set Expected Values
//                           </p>
//                           <p>
//                             Enter the expected transaction amount and ID for
//                             verification.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-emerald-600 font-semibold text-xs">
//                             2
//                           </span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             Upload Document
//                           </p>
//                           <p>
//                             Take clear photos of your transaction receipts or
//                             bank statements.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-emerald-600 font-semibold text-xs">
//                             3
//                           </span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             Automatic Verification
//                           </p>
//                           <p>
//                             Our OCR system will extract and verify the
//                             transaction details.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-emerald-600 font-semibold text-xs">
//                             4
//                           </span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             Add to Savings
//                           </p>
//                           <p>
//                             Once verified, add the amount to your savings
//                             account securely.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

const SavingsPage: React.FC = () => {
  return (
    <div className="">
      <SavingsForm />
    </div>
  );
};

export default SavingsPage;
