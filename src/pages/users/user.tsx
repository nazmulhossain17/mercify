/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import api from "@/api/axiosInstance";
import MemberDetailsModal from "@/components/modal/MemberModal";
import {
  CheckCircle,
  Eye,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  drivingLicense: string;
  active: boolean;
  phoneNumber: string;
  referalId?: string;
  loanEligibility: boolean;
  createdAt: string;
  membership?: any;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Using mock API instead of real API call
      const res = await api.get<Member[]>("/member");
      setMembers(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId: string) => {
    try {
      console.log("🔄 Starting approval process for member:", memberId);

      // Using mock API - make sure the endpoint matches what your backend expects
      const res = await api.post(`/member/members/${memberId}/activate`);
      console.log("✅ API Response for approval:", res.data);

      // Update local state to reflect the change
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === memberId ? { ...member, active: true } : member
        )
      );

      // Also update the selected member if it's the one being approved
      if (selectedMember && selectedMember._id === memberId) {
        setSelectedMember((prev: any) => ({ ...prev, active: true }));
      }

      console.log("✅ Member approved successfully!");
    } catch (error) {
      console.error("❌ Failed to approve member:", error);
      throw error;
    }
  };

  const handleReject = async (memberId: string) => {
    try {
      console.log("🔄 Starting rejection process for member:", memberId);

      // Make API call to reject the member
      const res = await api.post(`/member/${memberId}/reject`);
      console.log("✅ API Response for rejection:", res.data);

      // Update local state to reflect the change
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === memberId ? { ...member, active: false } : member
        )
      );

      // Also update the selected member if it's the one being rejected
      if (selectedMember && selectedMember._id === memberId) {
        setSelectedMember((prev: any) => ({ ...prev, active: false }));
      }

      console.log("✅ Member rejected successfully!");
    } catch (error) {
      console.error("❌ Failed to reject member:", error);
      throw error;
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setMembershipFilter("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    membershipFilter !== "all";

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phoneNumber.includes(searchTerm);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.active) ||
      (statusFilter === "inactive" && !member.active);

    const matchesMembership =
      membershipFilter === "all" ||
      (membershipFilter === "with" && member.membership) ||
      (membershipFilter === "without" && !member.membership);

    return matchesSearch && matchesRole && matchesStatus && matchesMembership;
  });

  const handleViewDetails = (member: any) => {
    console.log("👁️ Opening details for member:", member._id);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("❌ Closing modal");
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const stats = {
    total: members.length,
    active: members.filter((m) => m.active).length,
    withMembership: members.filter((m) => m.membership).length,
    pendingApproval: members.filter((m) => m.membership && !m.active).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Members Management
          </h1>
          <p className="text-gray-600">Manage and review member applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  With Membership
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.withMembership}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pendingApproval}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Memberships</option>
                <option value="with">With Membership</option>
                <option value="without">Without Membership</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 underline whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membership
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <Users className="w-12 h-12 mx-auto" />
                      </div>
                      <p className="text-gray-600">No members found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {hasActiveFilters
                          ? "Try adjusting your filters"
                          : "No members have been added yet"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {member.role}
                          </span>
                          <div>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                member.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {member.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {member.membership ? (
                          <div className="space-y-1">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Complete
                            </span>
                            <div className="text-xs text-gray-500">
                              ${member.membership.monthlySavings}/month
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(member)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        {filteredMembers.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        )}
      </div>

      {/* Modal - FIXED: Now passing the callback functions */}
      <MemberDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={selectedMember}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
