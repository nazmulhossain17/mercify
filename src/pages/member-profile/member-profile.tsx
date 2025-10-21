/* eslint-disable @typescript-eslint/no-explicit-any */
// import DriveImage from "@/components/DriveImage/DriveImage";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";
import { useEffect, useState } from "react";
// export default function MemberProfilePage() {
//   const user = useAppSelector(selectUser);
//   console.log(user);

//   // Animation variants for container and items
//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         duration: 0.4,
//         ease: easeOut,
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 15 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//   };

//   return (
//     <div className="flex items-center justify-center p-4 sm:p-8 m-2 sm:m-4 mt-1">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="w-full max-w-md md:max-w-2xl"
//       >
//         <Card className="shadow-lg rounded-2xl border border-gray-200">
//           {/* Header */}
//           <CardHeader className="text-center">
//             <motion.div variants={itemVariants}>
//               <CardTitle className="text-xl sm:text-2xl font-bold">
//                 {user?.fullName || "Member Name"}
//               </CardTitle>
//               <p className="text-xs sm:text-sm text-muted-foreground break-words">
//                 {user?.email || "Email not available"}
//               </p>
//             </motion.div>
//           </CardHeader>

//           <Separator />

//           {/* Content */}
//           <CardContent className="space-y-4 pt-4">
//             <Separator />

//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
//             >
//               <span className="font-medium">Phone Number</span>
//               <span className="text-muted-foreground break-words">
//                 {user?.phoneNumber || "N/A"}
//               </span>
//             </motion.div>
//             <Separator />

//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
//             >
//               <span className="font-medium">Referral ID</span>
//               <span className="text-muted-foreground break-words">
//                 {user?.referalId || "N/A"}
//               </span>
//             </motion.div>
//             <Separator />

//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
//             >
//               <span className="font-medium">Account Status</span>
//               <Badge variant={user?.active ? "default" : "destructive"}>
//                 {user?.active ? "Active" : "Inactive"}
//               </Badge>
//             </motion.div>
//             <Separator />

//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
//             >
//               <span className="font-medium">Loan Eligibility</span>
//               <Badge variant={user?.loanEligibility ? "default" : "outline"}>
//                 {user?.loanEligibility ? "Eligible" : "Not Eligible"}
//               </Badge>
//             </motion.div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

interface Member {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  active: boolean;
  loanEligibility: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MembershipForm {
  _id: string;
  memberId: string;
  dateOfBirth: string;
  streetAddress: string;
  city: string;
  country: string;
  membershipStartDate: string;
  monthlySavings: string;
  willRecommend: string;
  acknowledgment: boolean;
  signature: string;
  signatureDate: string;
  paymentAmount: string;
  paypalTransactionNumber: string;
}

interface ApiResponse {
  member: Member;
  membershipForm: MembershipForm;
}

interface UpdateMemberData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  active?: boolean;
  loanEligibility?: boolean;
}

interface UpdateMembershipFormData {
  dateOfBirth?: string;
  streetAddress?: string;
  city?: string;
  country?: string;
  monthlySavings?: string;
  willRecommend?: string;
  paymentAmount?: string;
}

const MemberProfilePage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const id = user?.id;
  const [profileData, setProfileData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Form states
  const [memberData, setMemberData] = useState<UpdateMemberData>({});
  const [membershipFormData, setMembershipFormData] =
    useState<UpdateMembershipFormData>({});

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setProfileData(data);

      // Initialize form data with current values (only if they exist)
      setMemberData({
        fullName: data.member.fullName,
        email: data.member.email,
        phoneNumber: data.member.phoneNumber,
        active: data.member.active,
        loanEligibility: data.member.loanEligibility,
      });

      // Only set membership form data if it exists
      if (data.membershipForm) {
        setMembershipFormData({
          dateOfBirth: data.membershipForm.dateOfBirth || "",
          streetAddress: data.membershipForm.streetAddress || "",
          city: data.membershipForm.city || "",
          country: data.membershipForm.country || "",
          monthlySavings: data.membershipForm.monthlySavings || "",
          willRecommend: data.membershipForm.willRecommend || "yes",
          paymentAmount: data.membershipForm.paymentAmount || "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Only include membershipFormData if it has values
      const updatePayload: any = {
        memberData,
      };

      if (Object.keys(membershipFormData).length > 0) {
        updatePayload.membershipFormData = membershipFormData;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/member/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update member");
      }

      const result = await response.json();
      setProfileData(result);
      setUpdateSuccess(true);

      // Close modal after successful update
      setTimeout(() => {
        setIsEditModalOpen(false);
        setUpdateSuccess(false);
      }, 1500);
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "An error occurred while updating"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("member.")) {
      const fieldName = name.replace("member.", "");
      setMemberData((prev) => ({
        ...prev,
        [fieldName]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    } else if (name.startsWith("form.")) {
      const fieldName = name.replace("form.", "");
      setMembershipFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    // Reset form data to current values
    if (profileData) {
      setMemberData({
        fullName: profileData.member.fullName,
        email: profileData.member.email,
        phoneNumber: profileData.member.phoneNumber,
        active: profileData.member.active,
        loanEligibility: profileData.member.loanEligibility,
      });

      if (profileData.membershipForm) {
        setMembershipFormData({
          dateOfBirth: profileData.membershipForm.dateOfBirth || "",
          streetAddress: profileData.membershipForm.streetAddress || "",
          city: profileData.membershipForm.city || "",
          country: profileData.membershipForm.country || "",
          monthlySavings: profileData.membershipForm.monthlySavings || "",
          willRecommend: profileData.membershipForm.willRecommend || "yes",
          paymentAmount: profileData.membershipForm.paymentAmount || "",
        });
      }
    }
  };

  // Format date function with safe handling
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Calculate age from date of birth with safe handling
  // const calculateAge = (dob: string | undefined): string => {
  //   if (!dob) return "Unknown";
  //   try {
  //     const birthDate = new Date(dob);
  //     const today = new Date();
  //     let age = today.getFullYear() - birthDate.getFullYear();
  //     const monthDiff = today.getMonth() - birthDate.getMonth();

  //     if (
  //       monthDiff < 0 ||
  //       (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //     ) {
  //       age--;
  //     }

  //     return age.toString();
  //   } catch {
  //     return "Unknown";
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfileData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Profile Data Found
          </h2>
          <p className="text-gray-600">Unable to load member profile.</p>
        </div>
      </div>
    );
  }

  const { member, membershipForm } = profileData;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section with Edit Button */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                      {member.fullName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.active
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {member.active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.loanEligibility
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        Loan{" "}
                        {member.loanEligibility ? "Eligible" : "Not Eligible"}
                      </span>
                    </div>
                  </div>

                  {/* Header Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {member.fullName}
                    </h1>
                    <p className="text-blue-100 text-lg mb-4 capitalize">
                      {member.role} Member
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 text-blue-100">
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {member.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {member.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={openEditModal}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>
              <div className="space-y-4">
                {membershipForm?.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </label>
                    <p className="text-gray-800">
                      {formatDate(membershipForm.dateOfBirth)}
                    </p>
                  </div>
                )}
                {membershipForm?.membershipStartDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Membership Since
                    </label>
                    <p className="text-gray-800">
                      {formatDate(membershipForm.membershipStartDate)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Member ID
                  </label>
                  <p className="text-gray-800 font-mono text-sm">
                    {member._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information - Only show if address data exists */}
            {(membershipForm?.streetAddress ||
              membershipForm?.city ||
              membershipForm?.country) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Address
                  </h2>
                </div>
                <div className="space-y-2">
                  {membershipForm.streetAddress && (
                    <p className="text-gray-800">
                      {membershipForm.streetAddress}
                    </p>
                  )}
                  {(membershipForm.city || membershipForm.country) && (
                    <p className="text-gray-800">
                      {membershipForm.city}
                      {membershipForm.city && membershipForm.country
                        ? ", "
                        : ""}
                      {membershipForm.country}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Financial Information - Only show if financial data exists */}
            {(membershipForm?.monthlySavings ||
              membershipForm?.paymentAmount ||
              membershipForm?.paypalTransactionNumber) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Financial Details
                  </h2>
                </div>
                <div className="space-y-4">
                  {membershipForm.monthlySavings && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Monthly Savings
                      </label>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${membershipForm.monthlySavings}
                      </p>
                    </div>
                  )}
                  {membershipForm.paymentAmount && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Payment Amount
                      </label>
                      <p className="text-xl font-semibold text-gray-800">
                        ${membershipForm.paymentAmount}
                      </p>
                    </div>
                  )}
                  {membershipForm.paypalTransactionNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Transaction ID
                      </label>
                      <p className="text-gray-800 font-mono text-sm">
                        {membershipForm.paypalTransactionNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Membership Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Membership Details
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Account Created
                  </label>
                  <p className="text-gray-800">
                    {formatDate(member.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-gray-800">
                    {formatDate(member.updatedAt)}
                  </p>
                </div>
                {membershipForm?.willRecommend && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Would Recommend
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        membershipForm.willRecommend === "yes"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {membershipForm.willRecommend === "yes" ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Signature Section - Only show if signature data exists */}
          {(membershipForm?.signature ||
            membershipForm?.signatureDate ||
            membershipForm?.acknowledgment !== undefined) && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Signature & Agreement
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {membershipForm.signature && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Signature
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-center">
                      {/* <DriveImage
                        driveImageURL={membershipForm.signature}
                        alt="Signature"
                        width={300}
                        isThumbnail
                      /> */}
                      <a href={membershipForm.signature} target="_blank" className="text-blue-600">Signature</a>
                    </div>
                  </div>
                )}
                {membershipForm.signatureDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Signed Date
                    </label>
                    <p className="text-gray-800 p-4 bg-gray-50 rounded-lg">
                      {formatDate(membershipForm.signatureDate)}
                    </p>
                  </div>
                )}
                {membershipForm.acknowledgment !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Acknowledgment
                    </label>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        membershipForm.acknowledgment
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {membershipForm.acknowledgment ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Member Profile
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateMember} className="p-6">
              {updateError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {updateError}
                </div>
              )}

              {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Profile updated successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Member Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="member.fullName"
                      value={memberData.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="member.email"
                      value={memberData.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="member.phoneNumber"
                      value={memberData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="member.active"
                        checked={memberData.active || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Active Member
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="member.loanEligibility"
                        checked={memberData.loanEligibility || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Loan Eligible
                      </span>
                    </label>
                  </div>
                </div>

                {/* Membership Form Information - Only show if membership form exists */}
                {membershipForm && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Membership Details
                    </h3>

                    {membershipFormData.dateOfBirth !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="form.dateOfBirth"
                          value={membershipFormData.dateOfBirth || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {membershipFormData.streetAddress !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="form.streetAddress"
                          value={membershipFormData.streetAddress || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {(membershipFormData.city !== undefined ||
                      membershipFormData.country !== undefined) && (
                      <div className="grid grid-cols-2 gap-3">
                        {membershipFormData.city !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            .
                            <input
                              type="text"
                              name="form.city"
                              value={membershipFormData.city || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        {membershipFormData.country !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              name="form.country"
                              value={membershipFormData.country || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    )}             

                    {(membershipFormData.monthlySavings !== undefined ||
                      membershipFormData.paymentAmount !== undefined) && (
                      <div className="grid grid-cols-2 gap-3">
                        {membershipFormData.monthlySavings !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Monthly Savings ($)
                            </label>
                            <input
                              type="number"
                              name="form.monthlySavings"
                              value={membershipFormData.monthlySavings || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        {membershipFormData.paymentAmount !== undefined && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Payment Amount ($)
                            </label>
                            <input
                              type="number"
                              name="form.paymentAmount"
                              value={membershipFormData.paymentAmount || ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {membershipFormData.willRecommend !== undefined && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Would Recommend?
                        </label>
                        <select
                          name="form.willRecommend"
                          value={membershipFormData.willRecommend || "yes"}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}      
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberProfilePage;
