"use client";

import Helmet from "../layout/Helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Spinner,
} from "reactstrap";
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
    <p id={id} role="alert" className="add-product__field-error">
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
    defaultValues: {
      title: "",
      shortDesc: "",
      description: "",
      price: "",
      category: "",
    },
  });

  /**
   * Validates the submitted product and saves it through the product API.
   *
   * @param {ProductFormValues} values Validated product form values.
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
      router.push("/admin/AllProducts");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Product not added. Please try again.");
    }
  };

  return (
    <Helmet title="Add Product">
      <section className="add__product-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" xl="7">
              <div className="add__product-card">
                <div className="add__product-header">
                  <div className="add__product-icon">
                    <i className="ri-shopping-bag-3-line" aria-hidden="true" />
                  </div>

                  <div>
                    <span className="add__product-eyebrow">
                      PRODUCT MANAGEMENT
                    </span>
                    <h1 className="products__title">Add New Product</h1>
                    <p className="products__subtitle">
                      Enter the product details below to add a new item to
                      your inventory.
                    </p>
                  </div>
                </div>

                <div className="add__product-divider" />

                {isSubmitting ? (
                  <div className="add__product-loading" role="status">
                    <Spinner color="primary" />
                    <p>Uploading image and adding product...</p>
                    <span>Please wait while we save your product.</span>
                  </div>
                ) : (
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="add__product-form"
                  >
                    <FormGroup className="add__product-field">
                      <label htmlFor="title">
                        Product Title <span>*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        placeholder="e.g. Modern Minimalist Sofa"
                        aria-invalid={!!errors.title}
                        aria-describedby={
                          errors.title ? "title-error" : undefined
                        }
                        {...register("title")}
                      />
                      <FieldError
                        id="title-error"
                        message={errors.title?.message}
                      />
                    </FormGroup>

                    <FormGroup className="add__product-field">
                      <label htmlFor="shortDesc">
                        Short Description <span>*</span>
                      </label>
                      <input
                        id="shortDesc"
                        type="text"
                        className={`form-control ${
                          errors.shortDesc ? "is-invalid" : ""
                        }`}
                        placeholder="A brief summary of the product"
                        aria-invalid={!!errors.shortDesc}
                        aria-describedby={
                          errors.shortDesc
                            ? "shortDesc-error"
                            : undefined
                        }
                        {...register("shortDesc")}
                      />
                      <FieldError
                        id="shortDesc-error"
                        message={errors.shortDesc?.message}
                      />
                    </FormGroup>

                    <FormGroup className="add__product-field">
                      <label htmlFor="description">
                        Full Description <span>*</span>
                      </label>
                      <textarea
                        id="description"
                        rows={5}
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        placeholder="Describe the product, its features, and details..."
                        aria-invalid={!!errors.description}
                        aria-describedby={
                          errors.description
                            ? "description-error"
                            : undefined
                        }
                        {...register("description")}
                      />
                      <FieldError
                        id="description-error"
                        message={errors.description?.message}
                      />
                    </FormGroup>

                    <Row>
                      <Col md="6">
                        <FormGroup className="add__product-field">
                          <label htmlFor="price">
                            Price (USD) <span>*</span>
                          </label>
                          <div className="add__product-price-input">
                            <span aria-hidden="true">$</span>
                            <input
                              id="price"
                              type="text"
                              inputMode="decimal"
                              className={`form-control ${
                                errors.price ? "is-invalid" : ""
                              }`}
                              placeholder="199.00"
                              aria-invalid={!!errors.price}
                              aria-describedby={
                                errors.price ? "price-error" : undefined
                              }
                              {...register("price")}
                            />
                          </div>
                          <FieldError
                            id="price-error"
                            message={errors.price?.message}
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="add__product-field">
                          <label htmlFor="category">
                            Category <span>*</span>
                          </label>
                          <select
                            id="category"
                            className={`form-select ${
                              errors.category ? "is-invalid" : ""
                            }`}
                            aria-invalid={!!errors.category}
                            aria-describedby={
                              errors.category
                                ? "category-error"
                                : undefined
                            }
                            {...register("category")}
                          >
                            <option value="">Select category</option>
                            {PRODUCT_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() +
                                  category.slice(1)}
                              </option>
                            ))}
                          </select>
                          <FieldError
                            id="category-error"
                            message={errors.category?.message}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup className="add__product-field">
                      <label htmlFor="image">
                        Product Image <span>*</span>
                      </label>
                      <div
                        className={`add__product-upload ${
                          errors.image ? "has-error" : ""
                        }`}
                      >
                        <i
                          className="ri-image-add-line"
                          aria-hidden="true"
                        />
                        <div className="add__product-upload-content">
                          <strong>Choose a product image</strong>
                          <span>
                            Select an image from your device. Supported formats
                            are listed below.
                          </span>
                          <small>
                            {ACCEPTED_IMAGE_TYPES.map((type) =>
                              type.replace("image/", "").toUpperCase()
                            ).join(", ")}
                          </small>
                        </div>
                        <input
                          id="image"
                          type="file"
                          className="form-control"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          aria-invalid={!!errors.image}
                          aria-describedby={
                            errors.image ? "image-error" : undefined
                          }
                          {...register("image")}
                        />
                      </div>
                      <FieldError
                        id="image-error"
                        message={errors.image?.message as
                          | string
                          | undefined}
                      />
                    </FormGroup>

                    <div className="add__product-actions">
                      <Button
                        type="button"
                        className="add__product-cancel"
                        onClick={() => router.push("/admin/AllProducts")}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="submit__btn"
                      >
                        <i
                          className="ri-add-line"
                          aria-hidden="true"
                        />
                        Add Product
                      </Button>
                    </div>
                  </Form>
                )}
              </div>

              <div className="add__product-security">
                <i className="ri-shield-check-line" aria-hidden="true" />
                Your product details will be saved securely.
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}