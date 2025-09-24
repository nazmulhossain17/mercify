// import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
// import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { Donation } from "@/types/donation";
// import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

interface DonationsTableProps {
  donations: Donation[];
  loading: boolean;
  onEdit: (donation: Donation) => void;
  onDelete: (id: string) => void;
}

export default function DonationsTable({
  donations,
  loading,
  onEdit,
  onDelete,
}: DonationsTableProps) {
  console.log(onEdit, onDelete);
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
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>
            A list of all donations and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    {/* <TableHead>Project</TableHead> */}
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>

                    <TableHead>Date</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {donations.map((donation, index) => (
                      <motion.tr
                        key={donation._id} // ✅ use Mongo _id as unique key
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {donation.donorFirstName} {donation.donorLastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {donation.email}
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell>{donation.project ?? "—"}</TableCell> */}
                        <TableCell className="font-medium">
                          ${donation.totalAmount?.toLocaleString() ?? "N/A"}
                        </TableCell>
                        <TableCell>{donation.paymentMethod}</TableCell>

                        <TableCell>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onEdit(donation)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(donation._id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
