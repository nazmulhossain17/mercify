import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {value}
            </p>
            <p
              className={`text-xs md:text-sm mt-1 ${
                changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
