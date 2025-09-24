import { motion } from "framer-motion";
import { Copy, Check, Share2, Users, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

// Mock data
const mockData = {
  referralLink: "https://app.example.com/ref/abc123xyz",
  referralCode: "ABC123XYZ",
  stats: {
    totalReferrals: 12,
    activeReferrals: 8,
    rewardsEarned: 150,
    conversionRate: 67,
  },
  recentReferrals: [
    { name: "Alex Johnson", status: "Active", joinDate: "2024-01-15" },
    { name: "Sarah Chen", status: "Pending", joinDate: "2024-01-12" },
    { name: "Mike Rodriguez", status: "Active", joinDate: "2024-01-10" },
  ],
};

export default function MemberReferralPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Referral link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast("Please try again");
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen ">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Share Referral
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Invite friends and amazing rewards for every successful referral.
            The more you share!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {mockData.stats.totalReferrals}
              </div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {mockData.stats.activeReferrals}
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {mockData.stats.rewardsEarned}
              </div>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Share2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {mockData.stats.conversionRate}%
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Referral Link Section */}
          <motion.div variants={itemVariants}>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Your Referral Link
                </CardTitle>
                <CardDescription>
                  Share this link with friends to start earning rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={mockData.referralLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => copyToClipboard(mockData.referralLink)}
                      variant={copied ? "secondary" : "default"}
                      size="icon"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Referral Code:</p>
                  <div className="flex gap-2">
                    <Input
                      value={mockData.referralCode}
                      readOnly
                      className="font-mono text-lg font-bold text-center"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => copyToClipboard(mockData.referralCode)}
                        variant="outline"
                        size="icon"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  className="bg-accent/20 p-4 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h4 className="font-semibold text-accent-foreground mb-2">
                    How it works:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Share your unique referral link</li>
                    <li>• Friends sign up using your link</li>
                    <li>• You both earn rewards when they join</li>
                    <li>• Track your progress in real-time</li>
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Referrals */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>Your latest referral activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentReferrals.map((referral, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div>
                        <p className="font-medium text-card-foreground">
                          {referral.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Joined {referral.joinDate}
                        </p>
                      </div>
                      <motion.span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === "Active"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {referral.status}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Referrals
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Start Sharing?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Copy your referral link and start inviting friends today.
                  Every successful referral brings you closer to amazing
                  rewards!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => copyToClipboard(mockData.referralLink)}
                    className="font-semibold"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Copy & Share Now
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
