import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

interface DonationsHeaderProps {
  onAddProject: () => void;
}

export default function DonationsHeader({
  onAddProject,
}: DonationsHeaderProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 100,
          },
        },
      }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Donations Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and track all donation activities
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          onClick={onAddProject}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
    </motion.div>
  );
}
