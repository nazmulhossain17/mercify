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
import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import countries from "world-countries";

interface EmergencyContactStepProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const countryList = countries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b));

export function EmergencyContactStep({
  data,
  updateData,
  onNext,
  onPrev,
}: EmergencyContactStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (!value) {
      updateData({
        emergencyAreaCode: "",
        emergencyPhoneNumber: "",
      });
      return;
    }

    try {
      const phoneNumber = parsePhoneNumber(value);
      if (phoneNumber) {
        // Extract country code as area code
        const areaCode = phoneNumber.countryCallingCode;
        // Extract national number (without country code)
        const nationalNumber = phoneNumber.nationalNumber;

        updateData({
          emergencyAreaCode: `+${areaCode}`,
          emergencyPhoneNumber: nationalNumber,
        });
      } else {
        // If parsing fails, store the full number in emergencyPhoneNumber
        updateData({
          emergencyAreaCode: "",
          emergencyPhoneNumber: value,
        });
      }
    } catch (error) {
      // If parsing fails, store the full number in emergencyPhoneNumber
      updateData({
        emergencyAreaCode: "",
        emergencyPhoneNumber: value,
      });
      console.error("Error parsing phone number:", error);
    }
  };

  const getDisplayPhoneNumber = () => {
    if (data.emergencyAreaCode && data.emergencyPhoneNumber) {
      return `${data.emergencyAreaCode}${data.emergencyPhoneNumber}`;
    }
    return data.emergencyPhoneNumber || "";
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
          <Label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <Input
              placeholder="First Name"
              value={data.emergencyFirstName}
              onChange={(e) =>
                updateData({ emergencyFirstName: e.target.value })
              }
              required
            />
            <Input
              placeholder="Last Name"
              value={data.emergencyLastName}
              onChange={(e) =>
                updateData({ emergencyLastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Address</Label>
          <div className="space-y-3 mt-2">
            <Input
              placeholder="Street Address"
              value={data.emergencyStreetAddress}
              onChange={(e) =>
                updateData({ emergencyStreetAddress: e.target.value })
              }
              required
            />
            <Input
              placeholder="Street Address Line 2"
              value={data.emergencyStreetAddress2}
              onChange={(e) =>
                updateData({ emergencyStreetAddress2: e.target.value })
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="City"
                value={data.emergencyCity}
                onChange={(e) => updateData({ emergencyCity: e.target.value })}
                required
              />
              <Input
                placeholder="State / Province"
                value={data.emergencyState}
                onChange={(e) => updateData({ emergencyState: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Postal / Zip Code"
                value={data.emergencyZipCode}
                onChange={(e) =>
                  updateData({ emergencyZipCode: e.target.value })
                }
                required
              />
              <Select
                value={data.emergencyCountry}
                onValueChange={(value) =>
                  updateData({ emergencyCountry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Please Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {countryList.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <PhoneInput
              placeholder="Enter phone number"
              value={getDisplayPhoneNumber()}
              onChange={handlePhoneChange}
              defaultCountry="US"
              className="phone-input"
              style={
                {
                  "--PhoneInputCountryFlag-height": "1em",
                  "--PhoneInputCountrySelectArrow-color": "#6b7280",
                  "--PhoneInput-color--focus": "#059669",
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="emergencyEmail" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="emergencyEmail"
            type="email"
            placeholder="example@example.com"
            value={data.emergencyEmail}
            onChange={(e) => updateData({ emergencyEmail: e.target.value })}
            className="mt-1"
            required
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
