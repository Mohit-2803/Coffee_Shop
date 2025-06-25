/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// ElectronicsForm.js
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    formData
  );
  return response.data.secure_url;
};

const electronicsValidationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  stock: Yup.number()
    .required("Stock quantity is required")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  weight: Yup.number()
    .positive("Weight must be a positive number")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  shippingCost: Yup.number()
    .min(0, "Shipping cost cannot be negative")
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  returnPolicy: Yup.string().max(500, "Maximum 500 characters allowed"),
  warranty: Yup.string().max(500, "Maximum 500 characters allowed"),
  tags: Yup.string().max(500, "Maximum 500 characters allowed"),
  brandInstallation: Yup.boolean(),
  setupAtDelivery: Yup.boolean(),
  images: Yup.mixed().required("At least one image is required"),
});

const electronicsInitialValues = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "electronics",
  brand: "",
  stock: "",
  weight: "",
  shippingCost: "",
  returnPolicy: "",
  warranty: "",
  tags: "",
  images: [],
  brandInstallation: false,
  setupAtDelivery: false,
};

const ElectronicsForm = ({ userEmail }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const uploadedImages = await Promise.all(
        Array.from(values.images).map((file) => uploadImage(file))
      );

      const productData = {
        ...values,
        sellerEmail: userEmail,
        images: uploadedImages,
      };

      const response = await axios.post(
        `${
          import.meta.env.VITE_FRONTEND_URL
        }/api/seller-central/add-product-electronics`,
        productData
      );

      if (response.status === 200) {
        toast.success("Product added successfully!");
        resetForm();
      }
    } catch (error) {
      toast.error("An error occurred while adding the product!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl w-full max-w-3xl bg-white shadow-2xl border mx-auto border-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        Add New Electronics Product
      </h2>

      <Formik
        initialValues={electronicsInitialValues}
        validationSchema={electronicsValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, touched, validateForm, submitForm }) => (
          <Form className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Product Name
              </label>
              <Field
                name="name"
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-all"
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                placeholder="Describe your product..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-all resize-none h-32"
              />
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Price (Rs)
                </label>
                <Field
                  type="number"
                  name="price"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
                {errors.price && touched.price && (
                  <div className="text-red-500 text-sm">{errors.price}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Discount (%)
                </label>
                <Field
                  type="number"
                  name="discount"
                  placeholder="0"
                  step="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
                {errors.discount && touched.discount && (
                  <div className="text-red-500 text-sm">{errors.discount}</div>
                )}
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Category is hidden since it’s fixed */}
                <Field type="hidden" name="category" value="electronics" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Brand
                </label>
                <Field
                  name="brand"
                  placeholder="Enter brand name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
                {errors.brand && touched.brand && (
                  <div className="text-red-500 text-sm">{errors.brand}</div>
                )}
              </div>
            </div>

            {/* Stock & Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Stock Quantity
                </label>
                <Field
                  type="number"
                  name="stock"
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
                {errors.stock && touched.stock && (
                  <div className="text-red-500 text-sm">{errors.stock}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Weight (kg)
                </label>
                <Field
                  type="number"
                  name="weight"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
                {errors.weight && touched.weight && (
                  <div className="text-red-500 text-sm">{errors.weight}</div>
                )}
              </div>
            </div>

            {/* Shipping Cost & Return Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Shipping Cost (Rs)
                </label>
                <Field
                  type="number"
                  name="shippingCost"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
                {errors.shippingCost && touched.shippingCost && (
                  <div className="text-red-500 text-sm">
                    {errors.shippingCost}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Return Policy
                </label>
                <Field
                  as="select"
                  name="returnPolicy"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all appearance-none bg-select-arrow 
                             bg-no-repeat bg-right-4"
                >
                  <option value="">Select Return Policy</option>
                  <option value="7 days">7 Days</option>
                  <option value="14 days">14 Days</option>
                  <option value="20 days">20 Days</option>
                  <option value="1 month">1 Month</option>
                </Field>
              </div>
            </div>

            {/* Warranty & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Warranty Information
                </label>
                <Field
                  as="textarea"
                  name="warranty"
                  placeholder="Enter warranty details..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all resize-none h-32"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-600">
                  Tags
                </label>
                <Field
                  name="tags"
                  placeholder="Enter comma-separated tags (e.g., summer, casual)"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             outline-none transition-all"
                />
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Additional Services
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="brandInstallation"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Brand Installation</span>
                </label>
                <label className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="setupAtDelivery"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Setup at Delivery</span>
                </label>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-600">
                Product Images
              </label>
              <input
                type="file"
                multiple
                onChange={(event) => {
                  setFieldValue("images", event.currentTarget.files);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition-all"
              />
              {errors.images && touched.images && (
                <div className="text-red-500 text-sm">{errors.images}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={async () => {
                  const errors = await validateForm();
                  if (Object.keys(errors).length > 0) {
                    toast.error("Please fix the errors before submitting.");
                    console.log(errors);
                  } else {
                    submitForm();
                  }
                }}
                className={`w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold rounded-lg transition-all 
                           transform hover:-translate-y-0.5 focus:ring-4 
                           focus:ring-blue-100 shadow-md hover:shadow-lg ${
                             isSubmitting
                               ? "cursor-not-allowed"
                               : "cursor-pointer"
                           }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Product →"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ElectronicsForm;
