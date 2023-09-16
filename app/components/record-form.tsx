import type { Record } from "@prisma/client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import DatePicker from "./ui/date-picker";

export const recordSchema = z.object({
  name: z.string().nonempty("Name is required"),
  birthDate: z
    .string({
      required_error: "Birth Date is required",
    })
    .pipe(z.coerce.date()),
  telephone: z.string().nonempty("Phone number is required"),
  address: z.string().nonempty("Address is required"),
  gender: z.enum(["male", "female"]),
  status: z.enum(["single", "married", "divorced", "widowed", "separated"], {
    required_error: "Marital Status is required",
  }),
  occupation: z.string().nonempty("Occupation is required"),
});

type RecordInput = z.input<typeof recordSchema>;

const MARITAL_STATUS_OPTIONS: {
  label: string;
  value: Record["status"];
}[] = [
  {
    value: "married",
    label: "Married",
  },
  {
    value: "single",
    label: "Single",
  },
  {
    value: "divorced",
    label: "Divorced",
  },
  {
    value: "separated",
    label: "Separated",
  },
  {
    value: "widowed",
    label: "Widowed",
  },
];

type RecordFormProps = {
  formMethods: ReturnType<typeof useRemixForm<RecordInput>>;
};

const RecordForm = ({ formMethods }: RecordFormProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = formMethods;

  return (
    <div className="my-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <fieldset className="flex flex-[5] flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input placeholder="Name" {...register("name")} />
          {errors.name?.message && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </fieldset>

        <fieldset className="flex flex-[3] flex-col gap-2">
          <Label htmlFor="birthdate">Birth Date</Label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { value, onChange } }) => {
              return (
                <DatePicker
                  value={value ? new Date(value) : undefined}
                  onChange={(value) =>
                    onChange(value ? value.toString() : undefined)
                  }
                />
              );
            }}
          />
          {errors.birthDate?.message && (
            <p className="text-sm text-red-400">{errors.birthDate.message}</p>
          )}
        </fieldset>

        <fieldset className="flex flex-[2] flex-col gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            placeholder="Phone Number"
            {...register("telephone")}
          />
          {errors.telephone?.message && (
            <p className="text-sm text-red-400">{errors.telephone.message}</p>
          )}
        </fieldset>
      </div>

      <fieldset className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Input placeholder="Address" {...register("address")} />
        {errors.address?.message && (
          <p className="text-sm text-red-400">{errors.address.message}</p>
        )}
      </fieldset>

      <div className="flex flex-col gap-4 sm:flex-row">
        <fieldset className="flex flex-col gap-2">
          <Label>Gender</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RadioGroup
                className="flex flex-1 gap-4"
                {...field}
                onValueChange={field.onChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="male" value="male" />
                  <Label htmlFor="male">Male</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="female" value="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            )}
          />
        </fieldset>

        <fieldset className="flex flex-1 flex-col gap-2">
          <Label htmlFor="status">Marital Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field: { ref, ...field } }) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger ref={ref} id="status">
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status?.message && (
            <p className="text-sm text-red-400">{errors.status.message}</p>
          )}
        </fieldset>

        <fieldset className="flex flex-1 flex-col gap-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            placeholder="Occupation"
            {...register("occupation")}
          />
          {errors.occupation?.message && (
            <p className="text-sm text-red-400">{errors.occupation.message}</p>
          )}
        </fieldset>
      </div>
    </div>
  );
};

export default RecordForm;
