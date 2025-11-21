import express from "express";
// import SSLCommerzPayment from "sslcommerz-lts";
import { OrderData } from "../models/orderdb.js";
import { Product } from "../models/Product.js";
import { isAdmin } from "./adminRoutes.js";
const router = express.Router();

const store_id = '0000'
const store_passwd = '00000';
const is_live = false;

// router.use(express.urlencoded({ extended: true }));
// router.use(express.json());

const tran_idGenerator = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // e.g. "20251109"
  const randomPart = Math.floor(Math.random() * 1000000); // random 6 digits
  return 'REF' + datePart + randomPart;
};

// Payment initialization
router.post('/init', async (req, res) => {
  console.log("Payment Gateway Request Body:", req.body);

  try {
    const reqData = req.body;

    // FIX
    const dataAfterFiltering = await itemListing({ items: reqData.items });

    const data = {
      total_amount: dataAfterFiltering.totalCost,
      currency: 'BDT',
      tran_date: new Date(),
      tran_id: tran_idGenerator(),
      shipping_method: reqData.paymentMethod,
      product_name: JSON.stringify(dataAfterFiltering.items),
      cus_name: reqData.C_Name,
      cus_email: reqData.C_Email,
      cus_phone: reqData.C_Phone1,
      cus_phone2: reqData.C_Phone2,
      ship_add1: reqData.C_S_Location,
      ship_country: 'Bangladesh',
      Status: 'Placed Order'
    };

    // Save to DB
    const savedOrder = await OrderData.create(data);

    // Send success response
    return res.status(200).json({
      status: "success",
      message: "Order Successfully Placed",
      order: savedOrder,
      product: dataAfterFiltering.items
    });

  } catch (err) {
    console.error("ERROR:", err.message);

    return res.status(500).json({
      status: "error",
      message: "Server error: " + err.message,
    });
  }
});


//   .catch(err => {
//     console.error('SSL init error:', err);
//     res.status(500).json({ message: 'Failed to init payment', error: err });
//   });
// });
const itemListing = async (data) => {
  console.log("calling from itemListing");

  try {
    const reqData = data;
    console.log("reqData:", reqData);

    // Validate input
    if (!reqData || !Array.isArray(reqData.items)) {
      throw new Error("Invalid request: items array missing");
    }

    // Fetch product details for each item
    const itemsWithDetails = await Promise.all(
      reqData.items.map(async (p) => {
        if (!p.productId) {
          throw new Error("productId missing in an item");
        }
        if (!p.quantity) {
          throw new Error("quantity missing in an item");
        }

        console.log("product id:", p.productId);

        const product = await Product.findById(p.productId);

        if (!product) {
          throw new Error(`Product not found: ${p.productId}`);
        }

        const subTotal = Number(product.price) * Number(p.quantity);

        return {
          itemId: p.productId,
          itemName: product.name,
          itemPrice: product.price,
          itemQuantity: p.quantity,
          itemSubTotal: subTotal,
        };
      })
    );

    // Calculate total cost
    const totalCost = itemsWithDetails.reduce(
      (sum, item) => sum + item.itemSubTotal,
      0
    );

    // Final order info
    const orderInfo = {
      items: itemsWithDetails,
      totalCost,
    };

    console.log("Final Order Info:", orderInfo);

    return orderInfo; // Success

  } catch (error) {
    console.error("itemListing error:", error.message);

    // Always return a safe error response instead of undefined
    return {
      error: true,
      message: error.message,
      items: [],
      totalCost: 0,
    };
  }
};


// ✅ Success callback
router.post('/success', (req, res) => {
  const successData = req.body;
  console.log("✅ Payment success callback:", successData);

  const data = {
    val_id: successData.val_id //that you go from sslcommerz response
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  sslcz.validate(data).then(data => {
    console.log("💳 Payment validation response:", data);
    // Respond with an HTML page that closes the tab
    if (data.status === 'VALID') {
      res.send(`
    <html>
      <head>
        <title>Payment Success</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f6fff8;
            color: #14532d;
          }
          .msg {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="msg">
          <h2>✅ Payment Successful!</h2>
          <p>You may now close this tab.</p>
        </div>
        <script>
          // Give user 2 seconds to see the message, then close automatically
          setTimeout(() => {
            window.close();
          }, 2000);
        </script>
      </body>
    </html>
  `
      );
      updateOrderStatus(successData.tran_id, 'Paid');
    } else {
      res.send(`
    <html>
      <head>
        <title>Payment Success</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f6fff8;
            color: #14532d;
          }
          .msg {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="msg">
          <h2>❌ Oops! We weren’t able to verify your payment.</h2>
          <p>Please check your account.</p>
        </div>
        <script>
          // Give user 2 seconds to see the message, then close automatically
          setTimeout(() => {
            window.close();
          }, 10000);
        </script>
      </body>
    </html>
    
    `)
    }
  });
});

const updateOrderStatus = async (tran_id, statusNow) => {
  try {
    const result = await OrderData.findOneAndUpdate({ tran_id: tran_id }, { Status: statusNow }, { new: true });
    console.log(`Order ${tran_id} status updated to ${statusNow}`);
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};







// Fail and cancel handlers (optional but recommended)
router.post('/fail', (req, res) => {
  console.log("❌ Payment failed:", req.body);
  res.send(`
    <html>
      <head>
        <title>Payment Success</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f6fff8;
            color: #14532d;
          }
          .msg {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="msg">
          <h2>❌ Payment failed.</h2>
          <p>The tab will close in 2 seconds.</p>
        </div>
        <script>
          // Give user 2 seconds to see the message, then close automatically
          setTimeout(() => {
            window.close();
          }, 2000);
        </script>
      </body>
    </html>
    `)
});

router.post('/cancel', (req, res) => {
  console.log("🚫 Payment cancelled:", req.body);
  res.send(`
    <html>
      <head>
        <title>Payment Success</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f6fff8;
            color: #14532d;
          }
          .msg {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="msg">
          <h2>❌ Payment cancelled.</h2>
          <p>The tab will close in 2 seconds.</p>
        </div>
        <script>
          // Give user 2 seconds to see the message, then close automatically
          setTimeout(() => {
            window.close();
          }, 2000);
        </script>
      </body>
    </html>
    `)
});




export default router;
