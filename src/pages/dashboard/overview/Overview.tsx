import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, Calendar, CheckCircle, Plus } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";
import { addMonths, format, isAfter, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const OverviewPage = () => {
  const user = useAppSelector(selectUser);
  const memberid = user?.id || "";
  const [memberSavings, setMemberSavings] = useState(null);
  useEffect(() => {
    const fetchMemberSavings = async () => {
      if (user?.id) {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/savings/total-savings/${memberid}`
          );
          const data = await response.json();
          setMemberSavings(data?.totalSavings);
          console.log("Member Savings:", data.totalSavings);
        } catch (error) {
          console.error("Failed to fetch member savings:", error);
        }
      }
    };
    fetchMemberSavings();
  }, [user]);
  if (!user) {
    return <div>Loading...</div>;
  }

  const createdDate = user?.createdAt ? parseISO(user.createdAt) : null;
  const sixMonthsLater = createdDate ? addMonths(createdDate, 6) : null;
  const isEligible = sixMonthsLater
    ? isAfter(new Date(), sixMonthsLater)
    : false;

  // const paymentHistory = [
  //   {
  //     id: 1,
  //     date: "Apr 15, 2024",
  //     amount: "$0",
  //     status: "Paid",
  //     type: "Monthly Contribution",
  //   },
  //   {
  //     id: 2,
  //     date: "Mar 15, 2024",
  //     amount: "$0",
  //     status: "Paid",
  //     type: "Monthly Contribution",
  //   },
  //   {
  //     id: 3,
  //     date: "Feb 15, 2024",
  //     amount: "$0",
  //     status: "Paid",
  //     type: "Monthly Contribution",
  //   },
  //   {
  //     id: 4,
  //     date: "Jan 15, 2024",
  //     amount: "$0",
  //     status: "Paid",
  //     type: "Monthly Contribution",
  //   },
  // ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.fullName}!
                </h1>
                <p className="text-emerald-100">
                  Member joined since{" "}
                  <span className="font-semibold">
                    {format(new Date(user?.createdAt ?? ""), "MMMM d, yyyy")}
                  </span>
                </p>
              </div>
              {user?.active === true && (
                <div className="text-right">
                  <p className="text-emerald-100 text-sm">Total Savings</p>
                  <p className="text-3xl font-bold">${memberSavings || 0}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {user?.active === true ? (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                      <PiggyBank className="h-6 w-6 text-green-700" />
                    </div>
                    <Link
                      to="/dashboard/savings"
                      className="flex items-center justify-end ml-4 group"
                    >
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          Savings
                        </p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                      <Calendar className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Next Payment
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {/* May 15, 2024 */}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3">
                      <CheckCircle className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Loan Eligibility
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {isEligible ? "Eligible" : "Not Eligible"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          {/* <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.slice(0, 3).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Payment Received
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.amount} • {payment.date}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => onTabChange("payments")}
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    View All Payments
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div> */}

          {/* Apply for Loan */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Apply for Interest-Free Loan
                    </h3>
                    <p className="text-gray-600">
                      {isEligible
                        ? "You are eligible to apply for an interest-free loan. Start your application now."
                        : "You are not eligible to apply for a loan yet. Please wait until 3 months after your account creation date."}
                    </p>
                  </div>

                  {isEligible ? (
                    <Link to="/dashboard/apply-loan">
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="bg-gray-300 text-gray-600 cursor-not-allowed"
                      title="You're not eligible to apply for a loan yet"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Not Eligible
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[300px] p-4">
          <Card className="max-w-md w-full p-6 text-center shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Your account is not active
            </h2>
            <p className="mb-6 text-gray-600">
              Please activate your account to access the dashboard features.
            </p>
            <Link
              to="/dashboard/membership-form"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Activate Account
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OverviewPage;
