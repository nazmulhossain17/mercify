/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash, UserPlus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MemberReferralPage from "../dashboard/memberReferal/MemberReferral";

export default function ReferralPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  // Fetch all referrals on load
  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await api.get("/referal");
      setReferrals(res.data);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast("Please fill in both name and email fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/referal/create", {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      });

      toast("Referral created successfully");

      setFormData({ fullName: "", email: "" });
      fetchReferrals(); // Refresh list
    } catch (error: any) {
      toast("Failed to create referral");
      console.error("Error creating referral:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReferral = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/referal/${deleteId}`);
      toast("Referral deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchReferrals();
    } catch (error: any) {
      toast("Failed to delete referral");
      console.error("Error deleting referral:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Referral Program
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Invite friends and earn rewards! Get $20 for every successful
            referral.
          </p>
        </div>

        {/* Centered Cards Container */}
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Create Referral Form */}
          <Card className="w-full md:w-[900px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Referral
              </CardTitle>
              <CardDescription>
                Add a new referral by entering their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateReferral} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Referral
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Referrals List */}
          <Card className="w-full md:w-[900px]">
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Your latest referral activity</CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div
                      key={referral._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{referral.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {referral.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined{" "}
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteId(referral._id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No referrals yet</p>
                  <p className="text-sm">
                    Start sharing your code to see referrals here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteReferral}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <MemberReferralPage />
    </div>
  );
}
