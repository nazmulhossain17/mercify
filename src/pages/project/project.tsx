import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Project {
  _id: string;
  projectName: string;
  projectType: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto px-4 py-8 max-w-6xl mt-5">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Current Projects
        </h1>

        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No projects available.
          </p>
        ) : (
          <div className="space-y-16">
            {projects.map((project) => (
              <section key={project._id} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {project.projectName}
                </h2>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                    <img
                      src={
                        project.imageUrl ||
                        "https://via.placeholder.com/600x400?text=No+Image"
                      }
                      alt={project.projectName}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* <p className="text-sm text-muted-foreground">
                      Target: ${project.targetAmount} | Current: $
                      {project.currentAmount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration:{" "}
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p> */}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                        Learn More
                      </Button>
                      <Link
                        to={"/donation"}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded-md"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
