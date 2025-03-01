import { useEffect, useState } from "react";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import ProductCard from "../components/Dashboard/ProductCard";

const Dashboard = () => {
  // List of categories to display
  const categories = ["Electronics", "Fashion", "Top Picks for You"];
  const [trendingProducts, setTrendingProducts] = useState({
    Electronics: [],
    Fashion: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel sample data
  const carouselItems = [
    {
      id: 1,
      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/GW/P42/Boult_3000x1200-PC._CB543542644_.jpg",
      title: "New Arrivals",
      subtitle: "Discover the latest tech gadgets",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/pc_unrec_refresh._CB555261616_.jpg",
      title: "Summer Collection",
      subtitle: "Explore our trendy summer wear",
      buttonText: "Explore Now",
    },
    {
      id: 3,
      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2025/GW/BAU/Unrec/PC/934044814._CB551384116_.jpg",
      title: "Kitchen Essentials",
      subtitle: "Upgrade your home cooking",
      buttonText: "Buy Now",
    },
  ];

  // Fetch trending products from API using Axios
  useEffect(() => {
    const fetchTrendingProducts = async (category) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_FRONTEND_URL
          }/api/trending/products/${category}`
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
        throw error;
      }
    };

    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Note: adjust endpoint category names if necessary
        const [electronics, fashion] = await Promise.all([
          fetchTrendingProducts("electronics"),
          fetchTrendingProducts("clothing"),
        ]);
        setTrendingProducts({
          Electronics: electronics,
          Fashion: fashion,
        });
      } catch (error) {
        setError("Failed to load products. Please try again later.");
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="mb-12 relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          navigation
          className="h-[400px] shadow-lg"
        >
          {carouselItems.map((item) => (
            <SwiperSlide key={item.id} className="relative">
              <div
                className="h-[400px] bg-cover"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Trending Categories */}
      <div className="container mx-auto px-4">
        {categories.map((category) => (
          <section key={category} className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-medium text-gray-700 ml-10">
                Trending in {category}
              </h3>
              <a
                href={`products?search=${category}`}
                className="text-blue-600 hover:underline font-medium"
              >
                View All →
              </a>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : category === "Top Picks for You" ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Coming soon - Personalized recommendations based on your
                  preferences
                </p>
              </div>
            ) : (
              // For Electronics and Fashion, display a slider with custom arrows.
              <div className="relative">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                  }}
                  navigation={{
                    nextEl: `.custom-swiper-button-next-${category}`,
                    prevEl: `.custom-swiper-button-prev-${category}`,
                  }}
                >
                  {trendingProducts[category]?.map((product) => (
                    <SwiperSlide key={product.ProductID}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* Custom Previous Arrow */}
                <button
                  className={`custom-swiper-button-prev-${category} absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full z-10`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* Custom Next Arrow */}
                <button
                  className={`custom-swiper-button-next-${category} absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full z-10`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
