import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Application {
  _id: string;
  memberName: string;
  amountRequested: number;
  applicationDate: string;
  status: "pending" | "approved" | "rejected";
}
interface ApplicationData {
  _id: string;
  memberId: { fullName: string };
  amountRequested: number;
  applicationDate: string;
  status: string;
}

export function PendingApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/loan`);
        const data = await res.json();

        if (data.success && Array.isArray(data.applications)) {
          // Transform API data to match our interface
          const transformedApps = data.applications
            .filter((app: ApplicationData) => app.status === "pending") // Only show pending applications
            .map((app: ApplicationData) => ({
              _id: app._id,
              memberName: app.memberId.fullName, // Extract name from nested object
              amountRequested: app.amountRequested,
              applicationDate: app.applicationDate,
              status: app.status,
            }));

          setApplications(transformedApps);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/loan/approve/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove approved application from list
        setApplications((prev) => prev.filter((app) => app._id !== id));
      } else {
        console.error("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/loan/reject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove rejected application from list
        setApplications((prev) => prev.filter((app) => app._id !== id));
      } else {
        console.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading pending applications...</div>;
  }

  if (!applications.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Applications
          </h2>
          <p className="text-sm text-gray-600">No pending applications 🎉</p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Applications
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Recent loan applications requiring review
            </p>
          </div>
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium self-start sm:self-center"
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700 uppercase tracking-wider">
            <div>Name</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {applications.map((application) => (
            <div
              key={application._id}
              className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">
                {application.memberName}
              </div>
              <div className="text-gray-700">
                ${application.amountRequested.toLocaleString()}
              </div>
              <div className="text-gray-600">
                {new Date(application.applicationDate).toLocaleDateString()}
              </div>
              <div>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                >
                  {application.status}
                </Badge>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                  onClick={() => handleApprove(application._id)}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                  onClick={() => handleReject(application._id)}
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {applications.map((application) => (
            <Card key={application._id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {application.memberName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        application.applicationDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  >
                    {application.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${application.amountRequested.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                      onClick={() => handleApprove(application._id)}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                      onClick={() => handleReject(application._id)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
