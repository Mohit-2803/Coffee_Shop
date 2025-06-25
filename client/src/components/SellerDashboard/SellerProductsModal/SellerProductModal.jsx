/* eslint-disable react/prop-types */
import {
  XMarkIcon,
  TagIcon,
  CubeIcon,
  TruckIcon,
  BookmarkIcon,
  ScaleIcon,
  ShieldCheckIcon,
  StarIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const SellerProductModal = ({ product, onClose }) => {
  console.log("product", product);

  // Helper function to format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  // Helper function to format dates
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="bg-white shadow-2xl w-full max-w-3xl mx-4 p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">
              {product.Name}
            </h2>
            <p className="text-xl font-medium text-blue-600 mt-1">
              {formatCurrency(product.Price)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Media Section */}
          <div className="space-y-6">
            <div className="aspect-square rounded-xl overflow-hidden border border-gray-300">
              <img
                src={product.ImageURL}
                alt={product.Name}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatBadge
                icon={<CubeIcon className="w-5 h-5" />}
                label="Stock"
                value={product.Stock}
                color="bg-blue-100 text-blue-800"
              />
              <StatBadge
                icon={<TagIcon className="w-5 h-5" />}
                label="Category"
                value={product.Category}
                color="bg-purple-100 text-purple-800"
              />
              <StatBadge
                icon={<StarIcon className="w-5 h-5" />}
                label="Rating"
                value={product.Rating || "0"}
                color="bg-amber-100 text-amber-800"
              />
              <StatBadge
                icon={<ShieldCheckIcon className="w-5 h-5" />}
                label="Warranty"
                value={product.Warranty ? "Available" : "None"}
                color="bg-green-100 text-green-800"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Product Metadata */}
            <DetailSection title="Product Specifications">
              <DetailItem
                icon={<ScaleIcon className="w-5 h-5" />}
                label="Weight"
                value={product.Weight ? `${product.Weight} kg` : "0"}
              />
              <DetailItem
                icon={<TruckIcon className="w-5 h-5" />}
                label="Shipping"
                value={
                  product.ShippingCost
                    ? formatCurrency(product.ShippingCost)
                    : "Free"
                }
              />
              <DetailItem
                icon={<BookmarkIcon className="w-5 h-5" />}
                label="Discount"
                value={
                  product.Discount ? `${product.Discount}%` : "No Discount"
                }
              />
              <DetailItem
                icon={<ArrowPathIcon className="w-5 h-5" />}
                label="Return Policy"
                value={product.ReturnPolicy || "No returns accepted"}
              />
            </DetailSection>

            {/* Tags */}
            {product.Tags && (
              <DetailSection title="Product Tags">
                <div className="flex flex-wrap gap-2">
                  {product.Tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 font-medium text-gray-600 rounded-full text-sm flex items-center gap-2"
                    >
                      <TagIcon className="w-4 h-4" />
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </DetailSection>
            )}

            {/* Featured Status */}
            <DetailSection title="Promotion">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`p-2 rounded-full ${
                    product.IsFeatured
                      ? "bg-green-200 text-green-600"
                      : "bg-gray-200"
                  }`}
                >
                  <StarIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Featured Product</p>
                  <p className="text-sm font-medium text-gray-500">
                    {product.IsFeatured
                      ? "Currently featured in collections"
                      : "Not featured"}
                  </p>
                </div>
              </div>
            </DetailSection>

            {/* Dates */}
            <DetailSection title="Timeline">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="text-sm font-medium">Product Added On</p>
                    <p className="text-sm text-gray-500 font-medium">
                      {formatDate(product.CreatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowPathIcon className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-500 font-medium">
                      {formatDate(product.UpdatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </DetailSection>
          </div>
        </div>

        {/* Description Section */}
        {product.Description && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Product Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.Description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const DetailSection = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
    <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
    <div className="flex-1">
      <p className="text-md font-medium">{label}</p>
      <p className="text-gray-600 text-sm font-medium">{value}</p>
    </div>
  </div>
);

const StatBadge = ({ icon, label, value, color }) => (
  <div className={`${color} p-4 rounded-xl flex items-center gap-2`}>
    <div className="p-2 bg-white/30 rounded-lg">{icon}</div>
    <div>
      <p className="text-md font-bold">{label}</p>
      <p className="text-md font-semibold">{value}</p>
    </div>
  </div>
);

export default SellerProductModal;
