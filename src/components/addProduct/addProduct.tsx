"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import { addProduct } from "@/lib/api/products";
import {
  ACCEPTED_IMAGE_TYPES,
  PRODUCT_CATEGORIES,
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product.schema";

interface FieldErrorProps {
  id: string;
  message?: string;
}

/**
 * Shows a validation message under a field (renders nothing when there is no error).
 *
 * @param {FieldErrorProps} props - Component props.
 * @param {string} props.id - Id referenced by the field's aria-describedby.
 * @param {string} [props.message] - The error message to show.
 * @returns {JSX.Element | null} The error element or null.
 */
function FieldError({ id, message }: FieldErrorProps): JSX.Element | null {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-danger mb-0">
      {message}
    </p>
  );
}

/**
 * "Add Product" page: validates the form, uploads the image, saves the product
 * in Firestore, then redirects to the products dashboard.
 *
 * @returns {JSX.Element} The add-product page.
 */
export default function AddProductPage(): JSX.Element {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { title: "", shortDesc: "", description: "", price: "", category: "" },
  });

  /**
   * Handles a valid form submission.
   *
   * @param {ProductFormValues} values - The validated form values.
   * @returns {Promise<void>}
   */
  const onSubmit = async (values: ProductFormValues): Promise<void> => {
    try {
      await addProduct(
        {
          productName: values.title,
          shortDesc: values.shortDesc,
          description: values.description,
          category: values.category,
          price: values.price,
        },
        values.image[0]
      );
      toast.success("Product successfully added!");
      router.push("/dashboard/all-products");
    } catch {
      toast.error("Product not added!");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {isSubmitting ? (
              <h4 className="py-5">Loading......</h4>
            ) : (
              <>
                <h4 className="mb-5">Add Product</h4>
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <FormGroup className="form__group">
                    <label htmlFor="title">Product title</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Double sofa"
                      aria-invalid={!!errors.title}
                      aria-describedby={errors.title ? "title-error" : undefined}
                      {...register("title")}
                    />
                    <FieldError id="title-error" message={errors.title?.message} />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <label htmlFor="shortDesc">Short Description</label>
                    <input
                      id="shortDesc"
                      type="text"
                      placeholder="A short summary of the product"
                      aria-invalid={!!errors.shortDesc}
                      aria-describedby={errors.shortDesc ? "shortDesc-error" : undefined}
                      {...register("shortDesc")}
                    />
                    <FieldError id="shortDesc-error" message={errors.shortDesc?.message} />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <label htmlFor="description">Description</label>
                    <input
                      id="description"
                      type="text"
                      placeholder="Full product description"
                      aria-invalid={!!errors.description}
                      aria-describedby={errors.description ? "description-error" : undefined}
                      {...register("description")}
                    />
                    <FieldError id="description-error" message={errors.description?.message} />
                  </FormGroup>

                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <label htmlFor="price">Price</label>
                      <input
                        id="price"
                        type="text"
                        inputMode="decimal"
                        placeholder="100"
                        aria-invalid={!!errors.price}
                        aria-describedby={errors.price ? "price-error" : undefined}
                        {...register("price")}
                      />
                      <FieldError id="price-error" message={errors.price?.message} />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        className="w-100 p-2"
                        aria-invalid={!!errors.category}
                        aria-describedby={errors.category ? "category-error" : undefined}
                        {...register("category")}
                      >
                        <option value="">Select category</option>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                      <FieldError id="category-error" message={errors.category?.message} />
                    </FormGroup>
                  </div>

                  <FormGroup className="form__group">
                    <label htmlFor="image">Product Image</label>
                    <input
                      id="image"
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      aria-invalid={!!errors.image}
                      aria-describedby={errors.image ? "image-error" : undefined}
                      {...register("image")}
                    />
                    <FieldError id="image-error" message={errors.image?.message as string | undefined} />
                  </FormGroup>

                  <button className="buy__btn" type="submit" disabled={isSubmitting}>
                    Add Product
                  </button>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}
