import { CheckoutFormValues } from "@/lib/validations/checkout.schema";
import { Path } from "react-hook-form";

export interface FieldConfig {
  name: Path<CheckoutFormValues>;
  label: string;
  type: string;
  placeholder: string;
}

export interface FieldErrorProps {
  id: string;
  message?: string;
}
