import { motion } from "framer-motion";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormData } from "@/pages/membership/MemberShipForm";
import countries from "world-countries";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/selectors/authSelectors";

interface PersonalInformationStepProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const countryOptions = countries
  .map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function PersonalInformationStep({
  data,
  updateData,
  onNext,
}: PersonalInformationStepProps) {
  const currentUser = useAppSelector(selectUser);
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
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            value={currentUser?.fullName}
            disabled
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">
            Current Address <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-3 mt-2">
            <Input
              placeholder="Street Address"
              value={data.streetAddress}
              onChange={(e) => updateData({ streetAddress: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="City"
                value={data.city}
                onChange={(e) => updateData({ city: e.target.value })}
                required
              />
              <Input
                placeholder="State"
                value={data.state}
                onChange={(e) => updateData({ state: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Zip Code"
                value={data.zipCode}
                onChange={(e) => updateData({ zipCode: e.target.value })}
                required
              />
              <Select
                value={data.country}
                onValueChange={(value) => updateData({ country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Please Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countryOptions.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Next Step
        </Button>
      </div>
    </motion.form>
  );
}
