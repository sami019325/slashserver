// Add Order Logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("orderPostForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("submitBtn");
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>⏳</span> Processing...`;

            try {
                const formData = {
                    tran_date: new Date().toISOString(), // Default current date
                    Status: "Pending", // Default status
                };

                for (let [key, value] of new FormData(form).entries()) {
                    // Handle numeric type
                    if (key === 'total_amount') {
                        formData[key] = parseFloat(value);
                    } else {
                        formData[key] = value;
                    }
                }

                // --- Mocking Structured Product Data and total_amount recalculation ---
                const totalAmount = formData.total_amount || 0;

                formData.product_name = [
                    {
                        "itemId": crypto.randomUUID(),
                        "itemName": `Quick Item 1`,
                        "itemPrice": totalAmount * 0.5,
                        "itemQuantity": 1,
                        "itemSubTotal": totalAmount * 0.5
                    },
                    {
                        "itemId": crypto.randomUUID(),
                        "itemName": `Quick Item 2`,
                        "itemPrice": totalAmount * 0.5,
                        "itemQuantity": 2,
                        "itemSubTotal": totalAmount * 0.5
                    }
                ];

                // Ensure total_amount matches the sum of sub_totals for consistency
                formData.total_amount = formData.product_name.reduce((acc, item) => acc + item.itemSubTotal, 0);

                // Add default metadata
                formData.currency = formData.currency || "USD";
                formData.tran_id = crypto.randomUUID(); // Mock T-ID
                // -------------------------------------------------------------------

                const res = await fetch('/api/paymentpage/init', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Order creation failed.");
                }

                alert("✅ New order created successfully!");
                form.reset();

                // Refresh order list via global function if available
                if (typeof window.loadOrders === 'function') {
                    // Reset to page 1 implicitly or explicitly we need access to 'currentPage' 
                    // helper in seeOrders.js sets global currentPage but we can't easily set it from here easily 
                    // unless we expose it. Usually loadOrders re-fetches current page.
                    // Ideally we want page 1. seeOrders.js doesn't expose a resetPage() but we can just reload.
                    await window.loadOrders();
                }

            } catch (err) {
                alert("❌ Error: " + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});
