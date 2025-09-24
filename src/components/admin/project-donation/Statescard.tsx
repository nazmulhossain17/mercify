import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react";

interface StatsCardsProps {
  totalDonations: number;
  totalDonors: number;
  completedDonations: number;
  pendingDonations: number;
}

export default function StatsCards({
  totalDonations,
  totalDonors,
  completedDonations,
  pendingDonations,
}: StatsCardsProps) {
  const statCards = [
    {
      title: "Total Donations",
      value: `$${totalDonations.toLocaleString()}`,
      description: `${totalDonors} unique donors`,
      icon: DollarSign,
    },
    {
      title: "Total Donors",
      value: totalDonors.toString(),
      description: `Across ${completedDonations + pendingDonations} donations`,
      icon: Users,
    },
    {
      title: "Completed",
      value: completedDonations.toString(),
      description: `${(
        (completedDonations / (completedDonations + pendingDonations)) *
        100
      ).toFixed(1)}% success rate`,
      icon: TrendingUp,
    },
    {
      title: "Pending",
      value: pendingDonations.toString(),
      description: "Awaiting processing",
      icon: Calendar,
    },
  ];

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
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}
