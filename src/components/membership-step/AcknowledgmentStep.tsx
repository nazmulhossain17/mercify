import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormData } from "@/pages/membership/MemberShipForm";
import { SignaturePad } from "../signature/Signaturepad";

interface AcknowledgmentStepProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function AcknowledgmentStep({
  data,
  updateData,
  onNext,
  onPrev,
}: AcknowledgmentStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.acknowledgment && data.signature) {
      updateData({ signatureDate: new Date().toISOString().split("T")[0] });
      onNext();
    }
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
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Terms and Conditions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              By signing below, I acknowledge that I have read and understood
              the Mercy Financials bylaws, terms of service, and membership
              agreement.
            </p>
            <p>
              I understand that this is a non-profit organization and that my
              participation is voluntary. I agree to abide by all rules and
              regulations set forth by the organization.
            </p>
            <p>
              I understand that my membership fees and savings are used to
              provide interest-free loans to members in need, and I agree to
              this use of my funds.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acknowledgment"
            checked={data.acknowledgment}
            onCheckedChange={(checked) =>
              updateData({ acknowledgment: checked as boolean })
            }
          />
          <Label htmlFor="acknowledgment" className="text-sm">
            I acknowledge and agree to the terms and conditions above{" "}
            <span className="text-red-500">*</span>
          </Label>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Digital Signature <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <SignaturePad
              value={data.signature}
              onSignatureChange={(signature) => updateData({ signature })}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Draw your signature above or upload an image of your signature. The
            signature will be automatically saved to secure storage.
          </p>
        </div>

        {data.signatureDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 p-3 rounded-lg border border-green-200"
          >
            <Label className="text-sm font-medium text-green-800">
              Signature Date
            </Label>
            <p className="text-sm text-green-700 mt-1">{data.signatureDate}</p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={!data.acknowledgment || !data.signature}
        >
          Next Step
        </Button>
      </div>
    </motion.form>
  );
}
