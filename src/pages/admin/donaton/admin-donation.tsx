/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Donation as IDonation, IProject } from "@/types/donation";
import DonationsHeader from "@/components/admin/project-donation/DonationHeader";
import StatsCards from "@/components/admin/project-donation/Statescard";
import ChartsSection from "@/components/admin/project-donation/ChartSection";
import DonationsTable from "@/components/admin/project-donation/DonationTable";
import CreateProjectModal, {
  type ProjectFormData,
} from "@/components/admin/project-donation/CreateProjectModal";
import EditProjectModal from "@/components/admin/project-donation/EditeProjectModal";
import ProjectsTable from "@/components/admin/project-donation/Project";

export default function DonationsPage() {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  console.log(setSearchTerm, setStatusFilter);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    projectName: "",
    projectType: "",
    description: "", // optional in type, but can set empty string
    targetAmount: "",
    currentAmount: "",
    startDate: "",
    endDate: "",
    status: "Active", // must match union type
    imageUrl: "",
  });

  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    fetchDonations();
    fetchProjects();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/donation`);
      if (!res.ok) throw new Error("Failed to fetch donations");
      const data = await res.json();
      setDonations(data.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch projects");
    }
  };

  const handleCreateProject = async () => {
    try {
      const newProject = {
        ...projectFormData,
        targetAmount: Number(projectFormData.targetAmount),
        currentAmount: Number(projectFormData.currentAmount) || 0,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const savedProject = await res.json();

      setProjects((prev) => [...prev, savedProject]);
      setIsProjectModalOpen(false);

      toast.success("Project created successfully!");

      setProjectFormData({
        projectName: "",
        projectType: "",
        description: "",
        targetAmount: "",
        currentAmount: "",
        startDate: "",
        endDate: "",
        status: "Active",
        imageUrl: "",
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project. Please try again.");
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    try {
      const updatedProject = {
        ...editingProject,
        ...projectFormData,
        targetAmount: Number(projectFormData.targetAmount),
        currentAmount: Number(projectFormData.currentAmount) || 0,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${editingProject._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProject),
        }
      );
      if (!res.ok) throw new Error("Failed to update project");

      const savedProject = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === editingProject._id ? savedProject : p))
      );
      setIsEditProjectModalOpen(false);
      setEditingProject(null);
      window.location.reload();
      toast.success("Project updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      window.location.reload();
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  const totalDonations = donations.reduce(
    (sum, d) => sum + Number(d.totalAmount),
    0
  );
  const completedDonations = donations.filter(
    (d) => d.status === "completed"
  ).length;
  const pendingDonations = donations.filter(
    (d) => d.status === "pending"
  ).length;

  const filteredDonations = donations.filter((donation) => {
    const donorName =
      `${donation.donorFirstName} ${donation.donorLastName}`.toLowerCase();
    const matchesSearch =
      donorName.includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : donation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openEditProjectModal = (project: IProject) => {
    setEditingProject(project);
    setProjectFormData({
      projectName: project.projectName,
      projectType: project.projectType,
      description: project.description,
      targetAmount: project.targetAmount,
      currentAmount: project.currentAmount,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      imageUrl: project.imageUrl,
    });
    setIsEditProjectModalOpen(true);
  };

  const handleEditDonation = (donation: IDonation) => {
    console.log("Edit donation:", donation);
    toast.info("Edit donation functionality not implemented yet");
  };

  const handleDeleteDonation = (id: string) => {
    console.log("Delete donation:", id);
    toast.info("Delete donation functionality not implemented yet");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        <DonationsHeader onAddProject={() => setIsProjectModalOpen(true)} />

        <StatsCards
          totalDonations={totalDonations}
          totalDonors={donations.length}
          completedDonations={completedDonations}
          pendingDonations={pendingDonations}
        />

        <ChartsSection donations={donations} projects={projects} />

        <ProjectsTable
          projects={projects}
          onEdit={openEditProjectModal}
          onDelete={handleDeleteProject}
        />

        <DonationsTable
          donations={filteredDonations}
          loading={loading}
          onEdit={handleEditDonation}
          onDelete={handleDeleteDonation}
        />

        <CreateProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          formData={projectFormData}
          onFormDataChange={setProjectFormData} // now type-safe
          onSubmit={handleCreateProject}
        />

        <EditProjectModal
          isOpen={isEditProjectModalOpen}
          onClose={() => setIsEditProjectModalOpen(false)}
          formData={projectFormData}
          onFormDataChange={setProjectFormData}
          onSubmit={handleUpdateProject}
        />
      </motion.div>
    </div>
  );
}
