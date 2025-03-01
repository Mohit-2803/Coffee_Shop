import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import SellNavbar from "./components/Navbar/SellNavbar";
import CheckoutNavbar from "./components/Navbar/CheckoutNavbar"; // Import your checkout navbar
import Sidebar from "./components/Sidebar/Sidebar"; // Import the Sidebar
import Footer from "./components/Footer/Footer"; // Regular Footer
import CheckoutFooter from "./components/Footer/CheckoutFooter"; // Specialized Checkout Footer

const Layout = () => {
  const location = useLocation();

  // Hide navbar/footer on signin/signup pages
  const hideOnPages = ["/signup", "/login"];
  const shouldHide = hideOnPages.includes(location.pathname);

  // Check if the current route is a sell-related route
  const isSellRoute = location.pathname.startsWith("/sell");
  const isDashboardRoute = location.pathname === "/sell/dashboard"; // Only show sidebar on /sell/dashboard

  // Check if the current route is checkout
  const isCheckoutRoute = location.pathname === "/checkout";

  return (
    <>
      {/* Navbar */}
      {!shouldHide &&
        (isCheckoutRoute ? (
          <CheckoutNavbar />
        ) : isSellRoute ? (
          <SellNavbar />
        ) : (
          <Navbar />
        ))}

      {/* Content and Optional Sidebar */}
      {isDashboardRoute ? (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar /> {/* Sidebar only on /sell/dashboard */}
          <div style={{ flex: 1 }}>
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}

      {/* Footer */}
      {!shouldHide && isCheckoutRoute ? (
        <CheckoutFooter />
      ) : (
        !shouldHide && !isSellRoute && <Footer />
      )}
    </>
  );
};

export default Layout;
