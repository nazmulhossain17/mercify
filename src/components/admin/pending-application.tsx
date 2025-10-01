import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Application {
  _id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  amountRequested: number;
  applicationDate: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  documentUrl?: string;
}

interface ApplicationData {
  _id: string;
  memberId: {
    _id: string;
    fullName: string;
    email: string;
  };
  amountRequested: number;
  applicationDate: string;
  status: string;
  purpose: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  decisionDate?: string;
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
          const transformedApps = data.applications
            .filter((app: ApplicationData) => app.status === "pending")
            .map((app: ApplicationData) => ({
              _id: app._id,
              memberId: app.memberId._id,
              memberName: app.memberId.fullName,
              memberEmail: app.memberId.email,
              amountRequested: app.amountRequested,
              applicationDate: app.applicationDate,
              purpose: app.purpose,
              status: app.status as "pending" | "approved" | "rejected",
              documentUrl: app.documentUrl,
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/loan/approve/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
      }
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/loan/reject/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600">Loading pending applications...</div>
    );
  }

  if (!applications.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-xl font-semibold">Pending Applications</h2>
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
            <h2 className="text-xl font-semibold">Pending Applications</h2>
            <p className="text-sm text-gray-600 mt-1">
              Loan requests waiting for review
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700 uppercase tracking-wider">
            <div>Member ID</div>
            <div>Name</div>
            <div>Amount</div>
            <div>Purpose</div>
            <div>Date</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {applications.map((application) => (
            <div
              key={application._id}
              className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div
                className="font-mono text-sm text-green-500 truncate"
                title={application.memberId}
              >
                {application.memberId}
              </div>
              <div>
                <div className="font-medium">{application.memberName}</div>
                <div
                  className="text-xs text-gray-500 truncate"
                  title={application.memberEmail}
                >
                  {application.memberEmail}
                </div>
              </div>
              <div>${application.amountRequested.toLocaleString()}</div>
              <div className="truncate" title={application.purpose}>
                {application.purpose}
              </div>
              <div>
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
                {application.documentUrl && (
                  <a
                    href={application.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center text-sm"
                  >
                    <FileText className="h-4 w-4 mr-1" /> Download
                  </a>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300"
                  onClick={() => handleApprove(application._id)}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300"
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
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{application.memberName}</h3>
                    <p
                      className="text-sm text-gray-500 font-mono truncate"
                      title={application.memberId}
                    >
                      ID: {application.memberId}
                    </p>
                    <p
                      className="text-sm text-gray-600 truncate"
                      title={application.memberEmail}
                    >
                      {application.memberEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        application.applicationDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {application.status}
                  </Badge>
                </div>
                <div className="text-gray-700">{application.purpose}</div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    ${application.amountRequested.toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    {application.documentUrl && (
                      <a
                        href={application.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center text-sm"
                      >
                        <FileText className="h-4 w-4 mr-1" /> Download
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-green-200 hover:bg-green-50 hover:border-green-300"
                      onClick={() => handleApprove(application._id)}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300"
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
