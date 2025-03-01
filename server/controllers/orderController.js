const { sql } = require("../config/db");
const createTransporter = require("../config/nodemailerConfig");

const getOrdersByEmail = async (req, res) => {
  try {
    // Retrieve email from the request body (since you're sending it as data)
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);

    const query = `
      SELECT OrderID, UserName, UserEmail, Phone, Address, Amount, Currency, PaymentStatus,
             OrderStatus, DeliveryStatus, PaymentIntentId, OrderItems, CreatedAt, ItemQuantity
      FROM Orders
      WHERE UserEmail = @email
      ORDER BY CreatedAt DESC
    `;
    const result = await request.query(query);
    const orders = result.recordset;

    // For each order, parse OrderItems JSON and then fetch product details using the same logic as in getProductById
    for (let order of orders) {
      let orderItemsArr = [];
      if (order.OrderItems) {
        try {
          orderItemsArr = JSON.parse(order.OrderItems);
          if (!Array.isArray(orderItemsArr)) orderItemsArr = [];
        } catch (e) {
          console.error(
            `Error parsing OrderItems for order ${order.OrderID}:`,
            e
          );
          orderItemsArr = [];
        }
      }
      order.OrderItems = orderItemsArr;

      // Now, for each product id in OrderItems, fetch product details
      const productDetails = [];
      for (const productId of order.OrderItems) {
        try {
          // Reuse the same query logic as in your getProductById function
          const productRequest = new sql.Request();
          productRequest.input("productID", sql.Int, productId);
          const productQuery = `
            SELECT 
              ProductID, 
              Name, 
              Description, 
              Price, 
              Category, 
              Brand, 
              Weight,
              Stock, 
              Discount,
              ImageURL, 
              SetupService,
              Rating,
              TotalReviews,
              IsFeatured
            FROM Products
            WHERE ProductID = @productID
          `;
          const productResult = await productRequest.query(productQuery);
          if (productResult.recordset.length > 0) {
            productDetails.push(productResult.recordset[0]);
          }
        } catch (e) {
          console.error(`Error fetching product with ID ${productId}:`, e);
        }
      }
      order.ProductDetails = productDetails;
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId, email } = req.body;
    if (!orderId || !email) {
      return res
        .status(400)
        .json({ message: "Order ID and email are required." });
    }

    // Verify that the order exists and is pending
    const request = new sql.Request();
    request.input("orderId", sql.Int, orderId);
    request.input("email", sql.NVarChar, email);
    const checkQuery = `
      SELECT DeliveryStatus FROM Orders
      WHERE OrderID = @orderId AND UserEmail = @email
    `;
    const checkResult = await request.query(checkQuery);
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }
    const currentStatus = checkResult.recordset[0].DeliveryStatus;
    if (currentStatus.toLowerCase() !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled." });
    }

    // Update the order to cancelled
    const updateRequest = new sql.Request();
    updateRequest.input("orderId", sql.Int, orderId);
    updateRequest.input("email", sql.NVarChar, email);
    const updateQuery = `
      UPDATE Orders
      SET DeliveryStatus = 'Cancelled', OrderStatus = 'Cancelled'
      WHERE OrderID = @orderId AND UserEmail = @email
    `;
    await updateRequest.query(updateQuery);

    // Send cancellation confirmation email
    if (email) {
      try {
        const transporter = await createTransporter();
        const mailOptions = {
          from: '"ShopEase" <no-reply@shopease.com>',
          to: email,
          subject: "Your Order Cancellation Confirmation",
          html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Order Cancelled</title>
              </head>
              <body style="margin:0; padding:20px; background-color:#f4f4f4; font-family: Arial, sans-serif;">
                <div style="max-width:600px; margin:0 auto; background:#ffffff; padding: 20px; border-radius:8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <h1 style="color: #2d3436; font-size: 24px; margin-bottom: 16px;">Order Cancellation Confirmation</h1>
                  <p style="color: #2d3436; font-size: 16px;">Dear Customer,</p>
                  <p style="color: #555555; font-size: 14px;">
                    We regret to inform you that your order with Order ID <strong>${orderId}</strong> has been successfully cancelled as per your request.
                  </p>
                  <p style="color: #555555; font-size: 14px;">
                    If you made the payment online, a refund will be initiated shortly and should reflect in your account within 5-7 business days. Please note that the exact time may vary depending on your bank's processing times.
                  </p>
                  <p style="color: #555555; font-size: 14px; margin-top: 16px;">Cancellation Details:</p>
                  <ul style="color: #555555; font-size: 14px; margin-left: 20px;">
                    <li><strong>Order ID:</strong> ${orderId}</li>
                    <li><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</li>
                    <li><strong>Status:</strong> Cancelled</li>
                  </ul>
                  <p style="color: #555555; font-size: 14px; margin-top: 16px;">
                    If you did not request this cancellation or if you have any concerns, please contact our support team immediately.
                  </p>
                  <p style="color: #555555; font-size: 14px;">
                    For further assistance, please reach out to our customer support:
                  </p>
                  <p style="color: #555555; font-size: 14px;">
                    Email: <a href="mailto:support@shopease.com" style="color: #3498db; text-decoration:none;">support@shopease.com</a><br>
                    Phone: 1-800-SHOPEASE
                  </p>
                  <p style="color: #555555; font-size: 14px; margin-top: 16px;">
                    Thank you for choosing ShopEase. We look forward to serving you in the future.
                  </p>
                  <p style="color: #2d3436; font-size: 16px; margin-top: 20px;">
                    Best regards,<br>
                    The ShopEase Team
                  </p>
                </div>
              </body>
            </html>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending cancellation email:", error);
          } else {
            console.log("Cancellation email sent:", info.response);
          }
        });
      } catch (mailError) {
        console.error("Error setting up email transporter:", mailError);
      }
    }

    return res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params; // Expecting route like /api/orders/:orderId
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const request = new sql.Request();
    request.input("orderId", sql.Int, orderId);
    const query = `
      SELECT OrderID, UserName, UserEmail, Phone, Address, Amount, Currency, PaymentStatus,
             OrderStatus, DeliveryStatus, PaymentIntentId, OrderItems, CreatedAt
      FROM Orders
      WHERE OrderID = @orderId
    `;
    const result = await request.query(query);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }
    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get orders by seller email
const getOrdersBySeller = async (req, res) => {
  try {
    const { email } = req.body;
    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);

    const query = `
  SELECT * FROM Orders 
  WHERE EXISTS (
    SELECT 1 FROM Products 
    WHERE Products.ProductID IN (
      SELECT value FROM STRING_SPLIT(
        SUBSTRING(Orders.OrderItems, 2, LEN(Orders.OrderItems) - 2),
        ','
      )
    )
    AND Products.SellerEmail = @email
  )
  ORDER BY CreatedAt DESC
`;

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  try {
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // If the seller accepts the order (processing), reduce stock for each ordered product based on its quantity.
    if (newStatus.toLowerCase() === "processing") {
      // Fetch the order to retrieve OrderItems and ItemQuantity
      const orderRequest = new sql.Request();
      orderRequest.input("orderId", sql.Int, orderId);
      const orderQuery = `
        SELECT OrderItems, ItemQuantity 
        FROM Orders 
        WHERE OrderID = @orderId
      `;
      const orderResult = await orderRequest.query(orderQuery);

      if (orderResult.recordset.length > 0) {
        const orderData = orderResult.recordset[0];
        let orderItemsArr = [];
        let quantitiesArr = [];

        // Parse OrderItems (expected to be a JSON array, e.g. "[2,6,8]")
        if (orderData.OrderItems) {
          try {
            orderItemsArr = JSON.parse(orderData.OrderItems);
            if (!Array.isArray(orderItemsArr)) orderItemsArr = [];
          } catch (e) {
            console.error(`Error parsing OrderItems for order ${orderId}:`, e);
            orderItemsArr = [];
          }
        }

        // Parse ItemQuantity (expected to be a JSON array, e.g. "[1,3,2]")
        if (orderData.ItemQuantity) {
          try {
            quantitiesArr = JSON.parse(orderData.ItemQuantity);
            if (!Array.isArray(quantitiesArr)) quantitiesArr = [];
          } catch (e) {
            console.error(
              `Error parsing ItemQuantity for order ${orderId}:`,
              e
            );
            quantitiesArr = [];
          }
        }

        // Iterate over both arrays in parallel. We assume both arrays have the same length.
        for (let i = 0; i < orderItemsArr.length; i++) {
          const productId = orderItemsArr[i];
          const quantityToReduce = quantitiesArr[i] || 1; // Default to 1 if missing
          const productRequest = new sql.Request();
          productRequest.input("productId", sql.Int, productId);
          productRequest.input("quantity", sql.Int, quantityToReduce);
          const updateStockQuery = `
            UPDATE Products 
            SET Stock = Stock - @quantity 
            WHERE ProductID = @productId
          `;
          await productRequest.query(updateStockQuery);
        }
      }
    }

    // Update the order status
    const request = new sql.Request();
    request.input("orderId", sql.Int, orderId);
    request.input("newStatus", sql.NVarChar, newStatus);
    const query = `
      UPDATE Orders
      SET DeliveryStatus = @newStatus
      WHERE OrderID = @orderId
    `;
    await request.query(query);

    // If the new status is "shipped", send a professional shipment email
    if (newStatus.toLowerCase() === "shipped") {
      // Fetch order details to get the user email and name
      const orderRequest = new sql.Request();
      orderRequest.input("orderId", sql.Int, orderId);
      const orderQuery = `
        SELECT OrderID, UserName, UserEmail, Amount, Currency, PaymentStatus, DeliveryStatus, CreatedAt, PaymentIntentId
        FROM Orders
        WHERE OrderID = @orderId
      `;
      const orderResult = await orderRequest.query(orderQuery);
      if (orderResult.recordset.length > 0) {
        const orderData = orderResult.recordset[0];
        try {
          const transporter = await createTransporter();
          const mailOptions = {
            from: '"ShopEase" <no-reply@shopease.com>',
            to: orderData.UserEmail,
            subject: "Your ShopEase Order Has Shipped!",
            html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>Order Shipped - ShopEase</title>
                </head>
                <body style="margin:0; padding:20px; background-color:#f4f4f4; font-family: Arial, sans-serif;">
                  <div style="max-width:600px; margin: auto; background:#ffffff; padding: 20px; border-radius:8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header with ShopEase logo -->
                    <div style="background-color: #2d3436; padding: 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">ShopEase</h1>
                    </div>
                    <!-- Email Body -->
                    <div style="padding: 30px;">
                      <h2 style="color: #2d3436;">Good News!</h2>
                      <p style="font-size: 16px; color: #636e72;">Dear ${
                        orderData.UserName
                      },</p>
                      <p style="font-size: 16px; color: #636e72;">
                        Your order with Order ID <strong>#${
                          orderData.OrderID
                        }</strong> has been shipped.
                      </p>
                      <p style="font-size: 16px; color: #636e72;">
                        You will receive a separate email from our shipping partner with tracking details shortly. Please allow 24-48 hours for the tracking information to update.
                      </p>
                      <p style="font-size: 16px; color: #636e72; margin-top: 20px;">
                        Thank you for choosing ShopEase. We appreciate your business and hope you enjoy your purchase.
                      </p>
                    </div>
                    <!-- Footer -->
                    <div style="background-color: #dfe6e9; padding: 15px; text-align: center; font-size: 12px; color: #636e72;">
                      <p style="margin: 0;">&copy; ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          };

          await transporter.sendMail(mailOptions);
          console.log("Shipment email sent.");
        } catch (emailError) {
          console.error("Error sending shipment email:", emailError);
        }
      }
    }

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Add to module.exports
module.exports = {
  getOrdersByEmail,
  cancelOrder,
  getOrderById,
  getOrdersBySeller,
  updateOrderStatus,
};
