import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { FormData } from "@/pages/membership/MemberShipForm";

interface MembershipQuestionsStepProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function MembershipQuestionsStep({
  data,
  updateData,
  onNext,
  onPrev,
}: MembershipQuestionsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="membershipStartDate" className="text-sm font-medium">
            Membership Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="membershipStartDate"
            type="date"
            value={data.membershipStartDate}
            onChange={(e) =>
              updateData({ membershipStartDate: e.target.value })
            }
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="monthlySavings" className="text-sm font-medium">
            Monthly Savings Amount <span className="text-red-500">*</span>
          </Label>
          <Input
            id="monthlySavings"
            type="number"
            placeholder="50"
            value={data.monthlySavings}
            onChange={(e) => updateData({ monthlySavings: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">
            Would you recommend Mercy Financials to others?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={data.willRecommend}
            onValueChange={(value) =>
              updateData({ willRecommend: value as "yes" | "maybe" | "no" })
            }
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="maybe" id="maybe" />
              <Label htmlFor="maybe">Maybe</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-sm font-medium">
            Please upload your driving license
            <span className="text-red-500">*</span>
          </Label>
          <label
            htmlFor="uploadFile1"
            className="bg-white text-slate-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-11 mb-3 fill-gray-500"
              viewBox="0 0 32 32"
            >
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000"
              />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000"
              />
            </svg>
            Upload driving license
            <input type="file" id="uploadFile1" className="hidden" />
            <p className="text-xs font-medium text-slate-400 mt-2">
              PNG, JPG are Allowed.
            </p>
          </label>
        </div>

        <div>
          <Label htmlFor="feedbackComment" className="text-sm font-medium">
            Feedback Comment
          </Label>
          <Textarea
            id="feedbackComment"
            placeholder="Share your thoughts about Mercy Financials..."
            value={data.feedbackComment}
            onChange={(e) => updateData({ feedbackComment: e.target.value })}
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="suggestions" className="text-sm font-medium">
            Suggestions for Improvement
          </Label>
          <Textarea
            id="suggestions"
            placeholder="Any suggestions to help us improve our services..."
            value={data.suggestions}
            onChange={(e) => updateData({ suggestions: e.target.value })}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Next Step
        </Button>
      </div>
    </motion.form>
  );
}
