/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useState } from "react";

export type ProjectFormData = {
  projectName: string;
  projectType: string;
  description?: string;
  targetAmount: number | string;
  currentAmount?: number | string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive" | "Completed";
  imageUrl?: string;
};

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProjectFormData;
  onFormDataChange: (data: ProjectFormData) => void;
  onSubmit: () => void;
}

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { scale: 0.8, opacity: 0 },
};

export default function EditProjectModal({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onSubmit,
}: EditProjectModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    formData.imageUrl ?? null
  );

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const uploadToDriveApi = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size must be less than 5MB");

    const allowedTypes = ["jpg", "jpeg", "png", "pdf"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      throw new Error(
        "File type not allowed. Please upload JPG, PNG, or PDF files."
      );
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    const result = await response.json();
    return result.link; // Google Drive link
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadedFileName(file.name);
    try {
      const fileUrl = await uploadToDriveApi(file);
      onFormDataChange({ ...formData, imageUrl: fileUrl });
      toast.success("File uploaded successfully!");
    } catch (error: any) {
      console.error("File upload failed:", error);
      toast.error(error.message || "Failed to upload file. Please try again.");
      setUploadedFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <motion.div
          variants={modalVariants as any}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details including image, target, and status.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={formData.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                  placeholder="Project Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleChange("projectType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Udhiya">Udhiya (Qurbani)</SelectItem>
                    <SelectItem value="Winter Clothes">
                      Winter Clothes Drive
                    </SelectItem>
                    <SelectItem value="Ramadan Charity">
                      Ramadan Charity
                    </SelectItem>
                    <SelectItem value="Tree Plantation">
                      Tree Plantation
                    </SelectItem>
                    <SelectItem value="Building Masjid">
                      Building Masjid
                    </SelectItem>
                    <SelectItem value="Emergency Relief">
                      Emergency Relief
                    </SelectItem>
                    <SelectItem value="Education">Education Support</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                placeholder="Describe the project goals..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount ($)</Label>
                <Input
                  id="target-amount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleChange("targetAmount", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-amount">Current Amount ($)</Label>
                <Input
                  id="current-amount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) =>
                    handleChange("currentAmount", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "Inactive" | "Completed") =>
                    handleChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-image">Project Image (Optional)</Label>
                <input
                  id="project-image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleFileUpload(file);
                  }}
                />
                {uploadedFileName && (
                  <p className="text-sm text-gray-500">
                    Uploaded file: {uploadedFileName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Update Project"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
