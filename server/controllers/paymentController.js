const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sql } = require("../config/db");
const createTransporter = require("../config/nodemailerConfig");

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, selectedItems, selectedQuantities } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      metadata: {
        orderItems: JSON.stringify(selectedItems), // Store product IDs
        orderQuantities: JSON.stringify(selectedQuantities), // Store corresponding quantities
      },
      // expand: ['charges'] // Uncomment to expand charges if needed
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: error.message });
  }
};

// Stripe Webhook Handler
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // Use express.raw() middleware on the webhook route to get raw body
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event when payment succeeds
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log(
      `PaymentIntent ${paymentIntent.id} for amount ${paymentIntent.amount} succeeded!`
    );

    try {
      // Retrieve charge details
      let charge;
      if (
        paymentIntent.charges &&
        paymentIntent.charges.data &&
        paymentIntent.charges.data.length > 0
      ) {
        charge = paymentIntent.charges.data[0];
      } else if (paymentIntent.latest_charge) {
        // If charges are not expanded, retrieve the charge using latest_charge
        charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      } else {
        throw new Error("No charge information available on PaymentIntent");
      }

      const billingDetails = charge.billing_details || {};

      // Get details from billing_details
      const userName = billingDetails.name || "Customer";
      const userEmail = billingDetails.email || "";
      const phone = billingDetails.phone || "Unknown";
      const addr = billingDetails.address || {};
      const addressStr = `${addr.line1 || ""}, ${addr.city || ""}, ${
        addr.country || ""
      } ${addr.postal_code || ""}`.trim();

      // Payment & order details
      const amountPaid = paymentIntent.amount / 100; // Convert from cents to currency unit
      const currency = paymentIntent.currency;
      const paymentStatus = "Paid";
      const orderStatus = "Pending"; // You can update this later as needed
      const paymentIntentId = paymentIntent.id;
      const orderItems = paymentIntent.metadata.orderItems || "";
      const orderQuantities = paymentIntent.metadata.orderQuantities || "";

      // SQL query to insert a new order into Orders table (with the new ItemQuantity column)
      const query = `
        INSERT INTO Orders (
          UserName,
          UserEmail,
          Phone,
          Address,
          Amount,
          Currency,
          PaymentStatus,
          OrderStatus,
          PaymentIntentId,
          OrderItems,
          ItemQuantity
        )
        VALUES (
          @UserName,
          @UserEmail,
          @Phone,
          @Address,
          @Amount,
          @Currency,
          @PaymentStatus,
          @OrderStatus,
          @PaymentIntentId,
          @OrderItems,
          @ItemQuantity
        )
      `;
      const request = new sql.Request();
      request.input("UserName", sql.NVarChar, userName);
      request.input("UserEmail", sql.NVarChar, userEmail);
      request.input("Phone", sql.NVarChar, phone);
      request.input("Address", sql.NVarChar, addressStr);
      request.input("Amount", sql.Decimal(10, 2), amountPaid);
      request.input("Currency", sql.NVarChar, currency);
      request.input("PaymentStatus", sql.NVarChar, paymentStatus);
      request.input("OrderStatus", sql.NVarChar, orderStatus);
      request.input("PaymentIntentId", sql.NVarChar, paymentIntentId);
      request.input("OrderItems", sql.NVarChar, orderItems);
      request.input("ItemQuantity", sql.NVarChar, orderQuantities);

      await request.query(query);
      console.log("Order saved to database.");

      // Send cancellation confirmation email
      if (userEmail) {
        const transporter = await createTransporter();
        const mailOptions = {
          from: '"ShopEase" <no-reply@yourstore.com>',
          to: userEmail,
          subject:
            "Your ShopEase Order Confirmation - Thank You for Your Purchase!",
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header with text-only logo -->
                <div style="background-color: #2d3436; padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">ShopEase</h1>
                </div>
                <!-- Email Body -->
                <div style="padding: 30px;">
                  <h2 style="color: #2d3436;">Thank You for Your Order!</h2>
                  <p style="font-size: 16px; color: #636e72;">Hello ${userName},</p>
                  <p style="font-size: 16px; color: #636e72;">We’re excited to let you know that we’ve received your order. Below are your order details:</p>
                  <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;"><strong>Order ID</strong></td>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;">${paymentIntentId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;"><strong>Amount Paid</strong></td>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;">₹${amountPaid}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;"><strong>Payment Status</strong></td>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;">${paymentStatus}</td>
                    </tr>
                    ${
                      addressStr
                        ? `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;"><strong>Billing Address</strong></td>
                      <td style="padding: 8px; border: 1px solid #dfe6e9;">${addressStr}</td>
                    </tr>`
                        : ""
                    }
                  </table>
                  <p style="font-size: 16px; color: #636e72; margin-top: 20px;">We will update you once your order is shipped. If you have any questions, feel free to contact our support team.</p>
                  <p style="font-size: 16px; color: #636e72;">Thank you for shopping with ShopEase!</p>
                </div>
                <!-- Footer -->
                <div style="background-color: #dfe6e9; padding: 15px; text-align: center; font-size: 12px; color: #636e72;">
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
                </div>
              </div>
            </div>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending confirmation email:", error);
          } else {
            console.log("Confirmation email sent:", info.response);
          }
        });
      }
    } catch (error) {
      console.error("Error saving order:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error creating order" });
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports = { createPaymentIntent, handleStripeWebhook };
