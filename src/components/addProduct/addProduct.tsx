"use client";

import { useTranslation } from "react-i18next";
import Helmet from "../layout/helmet";
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
import { FieldError } from "../common/fieldError";

/**
 * "Add Product" page: validates the form, uploads the image, saves the product
 * in Firestore, then redirects to the products dashboard.
 *
 * @returns {JSX.Element} The add-product page.
 */
export default function AddProductPage(): JSX.Element {
  const router = useRouter();
  const { t, i18n } = useTranslation();
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
        values.image[0],
      );

      toast.success(t("addProduct.success"));
      router.push("/admin/allProducts");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(t("addProduct.errors.addFailed"));
    }
  };

  return (
    <Helmet title={t("addProduct.title")}>
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
                      {t("addProduct.eyebrow")}
                    </span>
                    <h1 className="products__title">
                      {t("addProduct.heading")}
                    </h1>
                    <p className="products__subtitle">
                      {t("addProduct.description")}
                    </p>
                  </div>
                </div>

                <div className="add__product-divider" />

                {isSubmitting ? (
                  <div className="add__product-loading" role="status">
                    <Spinner color="primary" />
                    <p>{t("addProduct.loading")}</p>
                    <span>{t("addProduct.loadingDescription")}</span>
                  </div>
                ) : (
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="add__product-form"
                  >
                    <FormGroup className="add__product-field">
                      <label htmlFor="title">
                        {t("addProduct.fields.title")} <span>*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        placeholder={t("addProduct.placeholders.title")}
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
                        {t("addProduct.fields.shortDescription")} <span>*</span>
                      </label>
                      <input
                        id="shortDesc"
                        type="text"
                        className={`form-control ${
                          errors.shortDesc ? "is-invalid" : ""
                        }`}
                        placeholder={t(
                          "addProduct.placeholders.shortDescription",
                        )}
                        aria-invalid={!!errors.shortDesc}
                        aria-describedby={
                          errors.shortDesc ? "shortDesc-error" : undefined
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
                        {t("addProduct.fields.description")} <span>*</span>
                      </label>
                      <textarea
                        id="description"
                        rows={5}
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        placeholder={t("addProduct.placeholders.description")}
                        aria-invalid={!!errors.description}
                        aria-describedby={
                          errors.description ? "description-error" : undefined
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
                            {t("addProduct.fields.price")} <span>*</span>
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
                              placeholder={t("addProduct.placeholders.price")}
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
                            {t("addProduct.fields.category")} <span>*</span>
                          </label>
                          <select
                            id="category"
                            dir={i18n.language === "ar" ? "rtl" : "ltr"}
                            className={`form-select ${
                              errors.category ? "is-invalid" : ""
                            }`}
                            aria-invalid={!!errors.category}
                            aria-describedby={
                              errors.category ? "category-error" : undefined
                            }
                            {...register("category")}
                          >
                            <option value="">
                              {t("addProduct.placeholders.category")}
                            </option>

                            {PRODUCT_CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {t(`shop.categories.${category}`, {
                                  defaultValue:
                                    category.charAt(0).toUpperCase() +
                                    category.slice(1),
                                })}
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
                        {t("addProduct.fields.image")} <span>*</span>
                      </label>
                      <div
                        className={`add__product-upload ${
                          errors.image ? "has-error" : ""
                        }`}
                      >
                        <i className="ri-image-add-line" aria-hidden="true" />
                        <div className="add__product-upload-content">
                          <strong>
                            {t("addProduct.placeholders.category")}
                          </strong>
                          <span>{t("addProduct.upload.title")}</span>
                          <small>
                            {ACCEPTED_IMAGE_TYPES.map((type) =>
                              type.replace("image/", "").toUpperCase(),
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
                        message={errors.image?.message as string | undefined}
                      />
                    </FormGroup>

                    <div className="add__product-actions">
                      <Button
                        type="button"
                        className="add__product-cancel"
                        onClick={() => router.push("/admin/allProducts")}
                      >
                        {t("addProduct.cancel")}
                      </Button>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="submit__btn"
                      >
                        <i className="ri-add-line" aria-hidden="true" />
                        {t("addProduct.submit")}
                      </Button>
                    </div>
                  </Form>
                )}
              </div>

              <div className="add__product-security">
                <i className="ri-shield-check-line" aria-hidden="true" />
                {t("addProduct.securityNote")}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}
