"use client";
import Helmet from "../Layout/Helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Button, Spinner } from "reactstrap";
import { addProduct } from "@/lib/api/products";
import {
  ACCEPTED_IMAGE_TYPES,
  PRODUCT_CATEGORIES,
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product.schema";
import "@/styles/add-product.css";

interface FieldErrorProps {
  id: string;
  message?: string;
}

/**
 * Shows a validation message under a field (renders nothing when there is no error).
 *
 * @param {FieldErrorProps} props Component props.
 * @returns {JSX.Element | null} The error element or null.
 */
function FieldError({ id, message }: FieldErrorProps): JSX.Element | null {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-danger small mt-1 mb-0">
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
      router.push("/admin/AllProducts");
    } catch {
      toast.error("Product not added!");
    }
  };

  return (
    <Helmet title="Add Product">
      <section className="add__product-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" xl="7">
              <div className="add__product-card p-4 p-md-5">
                <div className="mb-4">
                  <h2 className="products__title mb-1">Add New Product</h2>
                  <p className="products__subtitle text-muted">
                    Fill in the details below to list a new item in your inventory.
                  </p>
                </div>

                {isSubmitting ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-3 text-muted fw-medium">Adding product to inventory...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormGroup className="mb-3">
                      <label htmlFor="title" className="form-label fw-semibold text-dark">
                        Product Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Modern Minimalist Sofa"
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? "title-error" : undefined}
                        {...register("title")}
                      />
                      <FieldError id="title-error" message={errors.title?.message} />
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <label htmlFor="shortDesc" className="form-label fw-semibold text-dark">
                        Short Description
                      </label>
                      <input
                        id="shortDesc"
                        type="text"
                        className="form-control"
                        placeholder="A brief summary of the product"
                        aria-invalid={!!errors.shortDesc}
                        aria-describedby={errors.shortDesc ? "shortDesc-error" : undefined}
                        {...register("shortDesc")}
                      />
                      <FieldError id="shortDesc-error" message={errors.shortDesc?.message} />
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <label htmlFor="description" className="form-label fw-semibold text-dark">
                        Full Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        className="form-control"
                        placeholder="Detailed product description and features..."
                        aria-invalid={!!errors.description}
                        aria-describedby={errors.description ? "description-error" : undefined}
                        {...register("description")}
                      />
                      <FieldError id="description-error" message={errors.description?.message} />
                    </FormGroup>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <label htmlFor="price" className="form-label fw-semibold text-dark">
                            Price ($)
                          </label>
                          <input
                            id="price"
                            type="text"
                            inputMode="decimal"
                            className="form-control"
                            placeholder="199.00"
                            aria-invalid={!!errors.price}
                            aria-describedby={errors.price ? "price-error" : undefined}
                            {...register("price")}
                          />
                          <FieldError id="price-error" message={errors.price?.message} />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <label htmlFor="category" className="form-label fw-semibold text-dark">
                            Category
                          </label>
                          <select
                            id="category"
                            className="form-select"
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
                      </Col>
                    </Row>

                    <FormGroup className="mb-4">
                      <label htmlFor="image" className="form-label fw-semibold text-dark">
                        Product Image
                      </label>
                      <input
                        id="image"
                        type="file"
                        className="form-control"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        aria-invalid={!!errors.image}
                        aria-describedby={errors.image ? "image-error" : undefined}
                        {...register("image")}
                      />
                      <FieldError id="image-error" message={errors.image?.message as string | undefined} />
                    </FormGroup>

                    <div className="d-grid">
                      <Button  type="submit" disabled={isSubmitting} className="py-2 fw-semibold submit__btn bg-[#0a1b2a]">
                        Add Product
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}