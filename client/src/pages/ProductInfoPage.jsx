import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading/LoadingSpinner";
import ElectronicsProductInfo from "../components/ProductInfo/ElectronicsProductInfo";
import ClothingProductInfo from "../components/ProductInfo/ClothingProductInfo";
import toast from "react-hot-toast";

const ProductInfoPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/products/get-product/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details. Please try again later.");
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <Loading />;

  if (product.Category.toLowerCase() === "electronics") {
    return <ElectronicsProductInfo product={product} />;
  } else if (product.Category.toLowerCase() === "clothing") {
    return <ClothingProductInfo product={product} />;
  } else {
    return <div>Product category not supported.</div>;
  }
};

export default ProductInfoPage;
