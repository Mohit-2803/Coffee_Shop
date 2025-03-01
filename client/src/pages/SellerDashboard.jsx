/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RecentOrders from "../components/SellerDashboard/RecentOrders";
import TopProducts from "../components/SellerDashboard/TopProducts";
import {
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { auth } from "../config/firebaseConfig";
import { getOrdersByEmail } from "../api/orderApi";
import toast from "react-hot-toast";
import CountUp from "react-countup";

const SellerDashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]); // You can compute this later if needed
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = auth.currentUser?.email;
        if (!email) {
          toast.error("User not logged in");
          return;
        }
        // Fetch orders using the provided API
        const response = await getOrdersByEmail(email);
        const fetchedOrders = response.data;
        setOrders(fetchedOrders);

        // Calculate summary metrics:
        // Total Sales: Sum of Amount for orders with DeliveryStatus "delivered"
        const deliveredOrders = fetchedOrders.filter(
          (order) => order.DeliveryStatus.toLowerCase() === "delivered"
        );
        const totalSales = deliveredOrders.reduce(
          (sum, order) => sum + Number(order.Amount),
          0
        );

        // Total Orders: Count orders that are NOT cancelled
        const totalOrders = fetchedOrders.filter(
          (order) => order.DeliveryStatus.toLowerCase() !== "cancelled"
        ).length;

        // New Customers: Count unique customer emails among delivered orders
        const uniqueCustomers = new Set(
          deliveredOrders.map((order) => order.UserEmail)
        ).size;

        setSummaryData([
          {
            title: "Total Sales",
            value: totalSales, // raw numeric value
            prefix: "₹",
            icon: CurrencyRupeeIcon,
            change: "", // Optionally calculate percentage change
          },
          {
            title: "Total Orders",
            value: totalOrders,
            prefix: "",
            icon: ShoppingCartIcon,
            change: "",
          },
          {
            title: "New Customers",
            value: uniqueCustomers,
            prefix: "",
            icon: UserGroupIcon,
            change: "",
          },
        ]);

        // Optionally, compute monthlySales from orders here if needed.
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Main Content */}
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="p-2 rounded border bg-gray-50 border-gray-300"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="p-2 rounded border bg-gray-50 border-gray-300"
            />
          </div>
          <button
            onClick={() => navigate("/sell/dashboard/add-product")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Add Product
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {summaryData.map((item, index) => (
            <div key={index} className="p-6 rounded-xl bg-white shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-md text-gray-900 font-medium">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold mt-2 text-gray-700">
                    <CountUp
                      start={0}
                      end={item.value}
                      duration={2}
                      separator=","
                      prefix={item.prefix}
                    />
                  </p>
                  <span className="text-green-500 text-sm">{item.change}</span>
                </div>
                <item.icon className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-white shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
