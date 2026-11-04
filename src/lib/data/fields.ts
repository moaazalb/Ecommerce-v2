import { FieldConfig } from "@/types/field";

export const FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "checkout.fields.name.label",
    type: "text",
    placeholder: "checkout.fields.name.placeholder",
  },
  {
    name: "email",
    label: "checkout.fields.email.label",
    type: "email",
    placeholder: "checkout.fields.email.placeholder",
  },
  {
    name: "phone",
    label: "checkout.fields.phone.label",
    type: "tel",
    placeholder: "checkout.fields.phone.placeholder",
  },
  {
    name: "streetAddress",
    label: "checkout.fields.streetAddress.label",
    type: "text",
    placeholder: "checkout.fields.streetAddress.placeholder",
  },
  {
    name: "postalCode",
    label: "checkout.fields.postalCode.label",
    type: "text",
    placeholder: "checkout.fields.postalCode.placeholder",
  },
  {
    name: "country",
    label: "checkout.fields.country.label",
    type: "text",
    placeholder: "checkout.fields.country.placeholder",
  },
];