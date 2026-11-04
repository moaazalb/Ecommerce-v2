import type { JSX } from "react";
import type { FieldErrorProps } from "@/types/field";

/**
 * Shows a validation message under a field (renders nothing when there is no error).
 *
 * @param {FieldErrorProps} props Component props.
 * @returns {JSX.Element | null} The error element or null.
 */
export function FieldError({
  id,
  message,
}: FieldErrorProps): JSX.Element | null {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="add-product__field-error">
      {message}
    </p>
  );
}