// Donation type (matches /api/donation response)
export type Donation = {
  _id: string;
  totalAmount: number;
  donorFirstName: string;
  donorLastName: string;
  email: string;
  paymentMethod: string;
  transactionId: string;
  status?: string;
  createdAt: string; // ✅ backend sends ISO string
  updatedAt: string; // ✅ backend sends ISO string
};

// Project type (matches /api/projects response)
export interface IProject {
  _id: string;
  projectName: string;
  projectType: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  startDate: string; // ✅ backend sends ISO string, not Date object
  endDate: string; // ✅ backend sends ISO string
  status: "Active" | "Inactive" | "Completed";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Props for charts
export interface ChartsSectionProps {
  donations: Donation[];
  projects: IProject[];
}

export type IDonation = Donation;
