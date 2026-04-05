// See Orders Logic
const ORDER_API_BASE = "/api/adminpanel1";
window.currentOrders = [];
let currentPage = 1;
const limitValue = 10;
let totalPages = 1;

// Helpers
const escapeHtmlOrder = (str) => {
    if (str === null || str === undefined) return "N/A";
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
};

const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusClasses = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Processing': return 'bg-blue-100 text-blue-800';
        case 'Shipped': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-700';
    }
};

function buildOrderRowHTML(order) {
    const statusClass = getStatusClasses(order.Status);
    const displayId = order.tran_id ? `(${order.tran_id.slice(0, 8)})` : order._id.slice(0, 8);

    let productDisplay = 'N/A';
    if (Array.isArray(order.product_name) && order.product_name.length > 0) {
        const count = order.product_name.length;
        const firstItem = order.product_name[0].itemName || 'Item';
        productDisplay = escapeHtmlOrder(firstItem);
        if (count > 1) {
            productDisplay += ` (+${count - 1} more)`;
        }
    } else if (typeof order.product_name === 'string') {
        productDisplay = escapeHtmlOrder(order.product_name);
    }

    return `
        <tr class="hover:bg-gray-50 transition" data-id="${order._id}">
            <td class="px-4 py-3 font-mono text-xs text-gray-500">${displayId}</td>
            <td class="px-4 py-3 text-gray-600">${formatDate(order.tran_date)}</td>
            <td class="px-4 py-3 font-semibold text-gray-800">${escapeHtmlOrder(order.cus_name)}</td>
            <td class="px-4 py-3 text-gray-600">${escapeHtmlOrder(order.cus_phone)}</td>
            <td class="px-4 py-3 text-gray-500">${productDisplay}</td>
            <td class="px-4 py-3 text-right font-bold text-green-800">${escapeHtmlOrder(order.currency || "USD")} ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</td>
            <td class="px-4 py-3 text-center">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass}">
                    ${escapeHtmlOrder(order.Status)}
                </span>
            </td>
            <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button type="button" onclick="showDetailsModal('${order._id}')"
                        class="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition" title="View All Details">
                        👁️
                    </button>
                    <button type="button" onclick="showUpdateModal('${order._id}', '${order.Status}')"
                        class="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition" title="Update Status & Note">
                        📝
                    </button>
                    <button type="button" onclick="deleteOrder('${order._id}')"
                        class="p-2 rounded-lg hover:bg-red-50 text-red-600 transition" title="Delete Order">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function updatePaginationControls(total, page, pages) {
    const current = document.getElementById("currentPageDisplay");
    const totalP = document.getElementById("totalPagesDisplay");
    const totalI = document.getElementById("totalItemsDisplay");
    const prev = document.getElementById("prevPageBtn");
    const next = document.getElementById("nextPageBtn");

    if (current) current.innerText = page;
    if (totalP) totalP.innerText = pages;
    if (totalI) totalI.innerText = total;

    if (prev) prev.disabled = page <= 1;
    if (next) next.disabled = page >= pages;
    currentPage = page;
    totalPages = pages;
}

window.loadOrders = async function () {
    const tableBody = document.getElementById("orderTable");
    if (!tableBody) return;
    tableBody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-500">Loading data...</td></tr>`;

    const dateFilter = document.getElementById("dateFilter");
    const phoneFilter = document.getElementById("phoneFilter");

    const date = dateFilter ? dateFilter.value : "";
    const phone = phoneFilter ? phoneFilter.value.trim() : "";

    let url = `${ORDER_API_BASE}?limit=${limitValue}&page=${currentPage}`;

    if (date) url += `&date=${encodeURIComponent(date)}`;
    if (phone) url += `&phone=${encodeURIComponent(phone)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch orders");
        }

        const list = (data.data || []).map(order => {
            // Mock structured data if needed (copied from original)
            if (!Array.isArray(order.product_name) || order.product_name.length === 0) {
                order.product_name = [
                    {
                        "itemId": crypto.randomUUID(),
                        "itemName": `Mock Product A`,
                        "itemPrice": 49.99,
                        "itemQuantity": 1,
                        "itemSubTotal": 49.99
                    },
                    {
                        "itemId": crypto.randomUUID(),
                        "itemName": `Mock Item B`,
                        "itemPrice": 25.00,
                        "itemQuantity": 2,
                        "itemSubTotal": 50.00
                    }
                ];
            }
            return order;
        });

        const total = data.total || 0;
        const page = data.page || 1;
        const pages = data.pages || 1;

        window.currentOrders = list;

        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-400">No orders found matching the criteria.</td></tr>`;
        } else {
            tableBody.innerHTML = list.map(buildOrderRowHTML).join("");
        }
        updatePaginationControls(total, page, pages);

    } catch (err) {
        console.error("Load Orders Error:", err);
        tableBody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-red-500">❌ Error loading data: ${err.message}</td></tr>`;
        updatePaginationControls(0, 1, 1);
    }
}

// Delete functionality
window.deleteOrder = async function (id) {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone."))
        return;

    try {
        const res = await fetch(`${ORDER_API_BASE}/${id}`, { method: "DELETE" });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Delete failed");
        }

        alert("✅ Order deleted.");
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();

        const tableBody = document.getElementById("orderTable");
        if (tableBody && tableBody.children.length === 0 && currentPage > 1) {
            currentPage--;
        }
        loadOrders();

    } catch (err) {
        alert("❌ Error: " + err.message);
    }
};

// Update Modal Functions
window.showUpdateModal = function (id, currentStatus) {
    const modal = document.getElementById("updateModal");
    const orderIdSpan = document.getElementById("modalOrderId");
    const idInput = document.getElementById("modalIdInput");
    const form = document.getElementById("updateStatusForm");

    if (orderIdSpan) orderIdSpan.innerText = id;
    if (idInput) idInput.value = id;
    if (form) {
        form.elements['Status'].value = currentStatus;
        form.elements['Order_note'].value = "";
    }
    if (modal) modal.style.display = 'flex';
};

window.closeUpdateModal = function () {
    const modal = document.getElementById("updateModal");
    if (modal) modal.style.display = 'none';
};

// Details Modal Functions
function detailItem(label, value) {
    const displayValue = escapeHtmlOrder(value) || 'N/A';
    return `<div class="flex justify-between py-2 border-b border-gray-100">
        <span class="text-sm font-medium text-gray-500">${label}</span>
        <span class="text-sm font-semibold text-gray-800 max-w-xs truncate">${displayValue}</span>
    </div>`;
}

function detailNote(label, value) {
    const displayValue = escapeHtmlOrder(value) || 'No note provided.';
    return `<div class="pt-2">
        <span class="block text-sm font-medium text-gray-700 mb-1">${label}</span>
        <p class="text-xs p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">${displayValue}</p>
    </div>`;
}

function buildProductListHTML(products) {
    if (!Array.isArray(products) || products.length === 0) {
        return `<p class="text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">No product details available.</p>`;
    }

    const rows = products.map((item) => `
        <tr class="border-b last:border-b-0">
            <td class="p-2 text-xs font-mono text-gray-500">${escapeHtmlOrder(item.itemId ? item.itemId.slice(-6) : 'N/A')}</td>
            <td class="p-2 text-sm font-medium text-gray-800">
                ${escapeHtmlOrder(item.itemName)}
                ${item.customNote ? `<p class="text-[11px] italic text-amber-700 mt-1">📝 ${escapeHtmlOrder(item.customNote)}</p>` : ''}
                ${item.customImageUrl ? `<a href="${escapeHtmlOrder(item.customImageUrl)}" target="_blank" class="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 mt-1">🖼️ Reference Image</a>` : ''}
            </td>
            <td class="p-2 text-right text-sm text-gray-600">${item.itemQuantity || 0}</td>
            <td class="p-2 text-right text-sm text-gray-600">$${item.itemPrice ? item.itemPrice.toFixed(2) : '0.00'}</td>
            <td class="p-2 text-right text-sm font-semibold text-green-700">$${item.itemSubTotal ? item.itemSubTotal.toFixed(2) : '0.00'}</td>
        </tr>
    `).join('');

    return `
        <div class="overflow-x-auto shadow rounded-lg border border-gray-100">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                        <th class="p-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                        <th class="p-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Qty</th>
                        <th class="p-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                        <th class="p-2 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Subtotal</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

window.showDetailsModal = function (id) {
    const order = window.currentOrders.find(o => o._id === id);

    if (!order) {
        alert("Error: Order data not found in current cache. Please reload the table.");
        return;
    }

    const detailOrderId = document.getElementById("detailOrderId");
    if (detailOrderId) detailOrderId.innerText = order._id;

    const content = document.getElementById("detailsContent");
    if (!content) return;
    content.innerHTML = '';

    const statusClass = getStatusClasses(order.Status);

    let html = `
        <div class="p-3 rounded-lg flex items-center justify-between font-bold text-lg ${statusClass}">
            <span>Current Status:</span>
            <span>${escapeHtmlOrder(order.Status)}</span>
        </div>
        
        <h4 class="font-bold text-lg text-green-700 mt-4 border-b pb-1">Transaction & Amount</h4>
        ${detailItem('Total Amount', `${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}`)}
        ${detailItem('Currency', order.currency)}
        ${detailItem('Transaction Date', formatDate(order.tran_date))}
        ${detailItem('Transaction ID', order.tran_id)}
        ${detailItem('Order ID', order.order_id)}
        
        <h4 class="font-bold text-lg text-green-700 mt-4 border-b pb-1">Product Details (${Array.isArray(order.product_name) ? order.product_name.length : 0} Items)</h4>
        ${buildProductListHTML(order.product_name)}

        <h4 class="font-bold text-lg text-green-700 mt-4 border-b pb-1">Customer Information</h4>
        ${detailItem('Customer Name', order.cus_name)}
        ${detailItem('Customer Email', order.cus_email)}
        ${detailItem('Phone (Primary)', order.cus_phone)}
        ${detailItem('Phone (Secondary)', order.cus_phone2)}
        
        <h4 class="font-bold text-lg text-green-700 mt-4 border-b pb-1">Shipping Details</h4>
        ${detailItem('Shipping Method', order.shipping_method)}
        ${detailItem('Shipping Address', order.ship_add1)}
        ${detailItem('Shipping Country', order.ship_country)}

        <h4 class="font-bold text-lg text-green-700 mt-4 border-b pb-1">Notes & Attachments</h4>
        ${detailItem('Customer Attachment', order.Customer_Attach)}
        ${detailNote('Customer Note', order.Customer_Note)}
        ${detailNote('Internal Order Note', order.Order_note)}
    `;

    content.innerHTML = html;
    const modal = document.getElementById("detailsModal");
    if (modal) modal.style.display = 'flex';
};

window.closeDetailsModal = function () {
    const modal = document.getElementById("detailsModal");
    if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('orderTable')) return;

    // Initial Load
    loadOrders();

    const updateForm = document.getElementById("updateStatusForm");
    if (updateForm) {
        updateForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const modalUpdateBtn = document.getElementById("modalUpdateBtn");
            const originalText = modalUpdateBtn.innerHTML;

            modalUpdateBtn.disabled = true;
            modalUpdateBtn.innerHTML = `<span>⏳</span> Updating...`;

            try {
                const form = e.target;
                const formData = {};
                for (let [key, value] of new FormData(form).entries()) {
                    formData[key] = value;
                }

                const orderId = formData.id;
                if (!orderId) throw new Error("Missing Order ID for update.");

                const updateBody = {
                    Status: formData.Status,
                    Order_note: formData.Order_note
                };

                const res = await fetch(`${ORDER_API_BASE}/${orderId}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateBody)
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Status update failed.");
                }

                alert("✅ Order status and note updated successfully!");
                closeUpdateModal();
                loadOrders();

            } catch (err) {
                alert("❌ Error: " + err.message);
            } finally {
                modalUpdateBtn.disabled = false;
                modalUpdateBtn.innerHTML = originalText;
            }
        });
    }

    // Pagination
    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");
    if (prevBtn) prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadOrders();
        }
    });
    if (nextBtn) nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadOrders();
        }
    });

    // Filtering
    const reloadBtn = document.getElementById("reloadBtn");
    const runFilter = () => {
        currentPage = 1;
        loadOrders();
    };

    if (reloadBtn) reloadBtn.addEventListener("click", runFilter);
    const dateFilter = document.getElementById("dateFilter");
    const phoneFilter = document.getElementById("phoneFilter");
    if (dateFilter) dateFilter.addEventListener("change", runFilter);
    if (phoneFilter) phoneFilter.addEventListener("change", runFilter);

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeUpdateModal();
            closeDetailsModal();
        }
    });
});
