// async function velidate(p) {
//     try {
//         const response = await fetch("http://localhost:5000/api/paymentpage/success", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(req.body)
//         });

//         const result = await response.json();
//         console.log("💳 Payment Gateway Response:", result.url);

//         // If your backend returns a payment gateway URL, redirect the user:
//         if (result) {
//             // window.close(result.url, "_blank");
//         } else {
//             console.error("❌ No gateway URL found:", result);
//         }

//     } catch (err) {
//         console.error("Error initializing payment:", err);
//     }
// }
// velidate();