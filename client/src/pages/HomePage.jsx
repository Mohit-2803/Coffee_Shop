/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import heroImage from "../assets/shopwomen.jpg";
import feature1 from "../assets/clothes.jpg";
import feature2 from "../assets/electronics.jpg";
import feature3 from "../assets/ai.jpg";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const HomePage = () => {
  const features = [
    {
      icon: TruckIcon,
      title: "Fast Delivery",
      description:
        "Free shipping on orders over $50 and expedited options available",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payments",
      description: "Pay Securely and easy way using stripe payments",
    },
    {
      icon: CreditCardIcon,
      title: "EMI Options",
      description: "Multiple product contains various emi options to go with",
    },
  ];

  const testimonials = [
    {
      name: "Roshan Soma",
      role: "Software Developer",
      text: "The best shopping experience I've ever had. Fast shipping and excellent customer support!",
      rating: 5,
    },
    {
      name: "Sourav Mohanty",
      role: "Aquaman",
      text: "Impressive product quality and seamless checkout process. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        <motion.div
          className="relative z-10 text-center px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            variants={fadeInUp}
          >
            Elevate Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Shopping Experience
            </span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-medium"
            variants={fadeInUp}
          >
            Discover curated collections from premium brands with fast shipping
            and exceptional customer service.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-black/40 hover:text-white transition-all group"
            >
              <span>Shop Now</span>
              <ArrowRightIcon className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern shopping experience"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Why Choose Us"
            subtitle="Experience the difference with our premium services"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Featured Collections"
            subtitle="Explore our curated selections"
          />
          <div className="grid md:grid-cols-3 gap-8">
            <CollectionCard
              image={feature1}
              title="Summer Fashion"
              category="Apparel"
            />
            <CollectionCard
              image={feature2}
              title="Smart Home"
              category="Electronics"
            />
            <CollectionCard
              image={feature3}
              title="Personalized Experience"
              category="Machine Learning"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Customer Stories"
            subtitle="What our clients say about us"
          />
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Shopping Experience?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Start Shopping
            </Link>
            <Link
              to="/about"
              className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Components
const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    className="text-center mb-12"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
  >
    <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
      {title}
    </h2>
    <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto">
      {subtitle}
    </p>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-blue-800" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
    </div>
    <p className="text-gray-600 font-medium leading-relaxed">{description}</p>
  </motion.div>
);

const CollectionCard = ({ image, title, category }) => (
  <motion.div
    className="group relative overflow-hidden rounded-xl shadow-lg"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <img
      src={image}
      alt={title}
      className="w-full h-[270px] object-contain transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent p-6 flex flex-col justify-end">
      <span className="text-sm text-white/80 font-medium mb-2">{category}</span>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
  </motion.div>
);

const TestimonialCard = ({ name, role, text, rating }) => (
  <motion.div
    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        <StarIcon className="w-6 h-6 text-orange-500" />
      </div>
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600 font-medium">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 italic mb-4 font-medium">&quot;{text}&quot;</p>
    <div className="flex items-center">
      {[...Array(rating)].map((_, i) => (
        <StarIcon key={i} className="w-5 h-5 text-orange-500" />
      ))}
    </div>
  </motion.div>
);

export default HomePage;
