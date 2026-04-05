// See Products Logic
const PRODUCT_API_URL = '/api/products'; // Renamed to avoid conflicts if global, though keeping it const here is fine if not redeclared
let productTableBody;

// Load products
window.loadProducts = async function () {
    productTableBody = document.getElementById('productTable');
    if (!productTableBody) return;

    try {
        const res = await fetch(PRODUCT_API_URL);
        if (!res.ok) throw new Error('Failed to fetch products');
        const products = await res.json();
        renderProducts(products);
        // Re-apply filters if they exist
        if (typeof applyFilters === 'function') applyFilters();
    } catch (err) {
        console.error('loadProducts error:', err);
        productTableBody.innerHTML = `<tr><td colspan="14" class="p-4 text-red-600">Failed to load products</td></tr>`;
    }
};

// Render products
function renderProducts(products) {
    if (!productTableBody) return;
    productTableBody.innerHTML = '';

    products.forEach(p => {
        const tr = document.createElement('tr');

        // sanitize values
        const img1 = p.img1 || '';
        const img2 = p.img2 || '';
        const img3 = p.img3 || '';

        tr.innerHTML = `
    <tr class="hover:bg-emerald-50/50 transition-colors group">
        <td class="px-3 py-2 align-top text-center w-[300px]">
            <div class="flex flex-col items-center w-52">
                <div id="preview-${p._id}-img1" class="w-44 h-44 bg-gray-50 rounded-lg mb-2 border border-gray-200 flex items-center justify-center overflow-hidden relative group/img">
                    ${img1 ? `<img src="${img1}" class="w-full h-full object-cover" />` : '<span class="text-[10px] text-gray-400">No Image</span>'}
                    <div id="loader-${p._id}-img1" class="absolute inset-0 bg-white/80 hidden items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    </div>
                </div>
                <div class="relative w-44">
                    <input type="file" accept="image/*" 
                        onchange="uploadInlineImage(this, '${p._id}', 'img1')"
                        class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <button type="button" class="w-full py-1.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded border border-gray-300 hover:bg-gray-200 transition-colors">
                        Choose File
                    </button>
                    <input type="hidden" value="${img1}" data-id="${p._id}" data-field="img1" id="input-${p._id}-img1" />
                </div>
            </div>
        </td>

        <td class="px-3 py-2 align-top text-center w-[300px]">
            <div class="flex flex-col items-center w-52">
                <div id="preview-${p._id}-img2" class="w-44 h-44 bg-gray-50 rounded-lg mb-2 border border-gray-200 flex items-center justify-center overflow-hidden relative group/img">
                    ${img2 ? `<img src="${img2}" class="w-full h-full object-cover" />` : '<span class="text-[10px] text-gray-400">No Image</span>'}
                    <div id="loader-${p._id}-img2" class="absolute inset-0 bg-white/80 hidden items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    </div>
                </div>
                <div class="relative w-44">
                    <input type="file" accept="image/*" 
                        onchange="uploadInlineImage(this, '${p._id}', 'img2')"
                        class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <button type="button" class="w-full py-1.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded border border-gray-300 hover:bg-gray-200 transition-colors">
                        Choose File
                    </button>
                    <input type="hidden" value="${img2}" data-id="${p._id}" data-field="img2" id="input-${p._id}-img2" />
                </div>
            </div>
        </td>

        <td class="px-3 py-2 align-top text-center w-[300px]">
            <div class="flex flex-col items-center w-52">
                <div id="preview-${p._id}-img3" class="w-44 h-44 bg-gray-50 rounded-lg mb-2 border border-gray-200 flex items-center justify-center overflow-hidden relative group/img">
                    ${img3 ? `<img src="${img3}" class="w-full h-full object-cover" />` : '<span class="text-[10px] text-gray-400">No Image</span>'}
                    <div id="loader-${p._id}-img3" class="absolute inset-0 bg-white/80 hidden items-center justify-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    </div>
                </div>
                <div class="relative w-44">
                    <input type="file" accept="image/*" 
                        onchange="uploadInlineImage(this, '${p._id}', 'img3')"
                        class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <button type="button" class="w-full py-1.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded border border-gray-300 hover:bg-gray-200 transition-colors">
                        Choose File
                    </button>
                    <input type="hidden" value="${img3}" data-id="${p._id}" data-field="img3" id="input-${p._id}-img3" />
                </div>
            </div>
        </td>

        <td class="px-3 py-2 align-top w-[250px]">
            <textarea data-id="${p._id}" data-field="name"
                class=" w-[250px] text-base font-semibold text-gray-800 border border-gray-200 rounded p-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all shadow-sm"
                rows="3">${p.name || ''}</textarea>
            <div class="mt-2 text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded p-1.5 truncate"
                title="Product ID: ${p._id}">
                ID: ${p._id}
            </div>
        </td>

        <td class="px-3 py-2 align-top w-[300px]">
            <select data-id="${p._id}" data-field="category"
                class="w-[300px] border border-gray-200 rounded p-2 text-sm bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all">
                <option value="">-- select --</option>
                <option value="coffee beans" ${p.category === 'coffee beans' ? 'selected' : ''}>coffee beans
                </option>
                <option value="merchandise products" ${p.category === 'merchandise products' ? 'selected' : ''}>
                    merchandise products</option>
                <option value="cake and pastry" ${p.category === 'cake and pastry' ? 'selected' : ''}>cake
                    and pastry</option>
                <option value="Barista Training" ${p.category === 'Barista Training' ? 'selected' : ''}>
                    Barista Training</option>
            </select>
        </td>

        <td class="px-3 py-2 align-top w-[150px]">
            <input type="number" value="${p.price != null ? p.price : ''}" data-id="${p._id}" data-field="price"
                class="w-full border border-gray-200 rounded p-2 text-sm font-mono text-right focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                placeholder="0.00" />
        </td>
        <td class="px-3 py-2 align-top w-[200px]">
            <input type="text" value="${p.quantity != null ? p.quantity : ''}" data-id="${p._id}" data-field="quantity"
                class="w-full border border-gray-200 rounded p-2 text-sm font-mono text-right focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                placeholder="kg/ g/ pcs" />
        </td>

        <td class="px-3 py-2 align-top w-[401px] ">
            <input value="${p.menufacturer || ''}" data-id="${p._id}" data-field="menufacturer"
                class="w-[401px] border border-gray-200 rounded p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                placeholder="Company" />
        </td>
        <td class="px-3 py-2 align-top w-[150px]">
            <input value="${p.menufactured_country || ''}" data-id="${p._id}" data-field="menufactured_country"
                class="w-[150px] border border-gray-200 rounded p-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                placeholder="Country" />
        </td>

        <td class="px-3 py-2 align-top min-w-[300px] max-w-[350px]">
            <textarea data-id="${p._id}" data-field="details1" rows="5"
                class="min-w-[300px] max-w-[350px] h-40 border border-gray-200 rounded p-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all">${p.details1 || ''}</textarea>
        </td>
        <td class="px-3 py-2 align-top min-w-[300px] max-w-[350px]">
            <textarea data-id="${p._id}" data-field="details2" rows="5"
                class="min-w-[300px] max-w-[350px] h-40 border border-gray-200 rounded p-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all">${p.details2 || ''}</textarea>
        </td>
        <td class="px-3 py-2 align-top min-w-[300px] max-w-[350px]">
            <textarea data-id="${p._id}" data-field="details3" rows="5"
                class="min-w-[300px] max-w-[350px] h-40 border border-gray-200 rounded p-2 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all">${p.details3 || ''}</textarea>
        </td>

        <td class="px-3 py-2 align-top min-w-[350px] max-w-[450px]">
            <div class="flex flex-col space-y-1 min-w-[350px] max-w-[450px]">
                <input value="${p.key_points1 || ''}" data-id="${p._id}" data-field="key_points1"
                    class="w-full border border-gray-200 rounded p-1.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                    placeholder="Point 1" />
                <input value="${p.key_points2 || ''}" data-id="${p._id}" data-field="key_points2"
                    class="w-full border border-gray-200 rounded p-1.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                    placeholder="Point 2" />
                <input value="${p.key_points3 || ''}" data-id="${p._id}" data-field="key_points3"
                    class="w-full border border-gray-200 rounded p-1.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                    placeholder="Point 3" />
                <input value="${p.key_points4 || ''}" data-id="${p._id}" data-field="key_points4"
                    class="w-full border border-gray-200 rounded p-1.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                    placeholder="Point 4" />
                <input value="${p.key_points5 || ''}" data-id="${p._id}" data-field="key_points5"
                    class="w-full border border-gray-200 rounded p-1.5 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all"
                    placeholder="Point 5" />
            </div>
        </td>

        <td class="px-3 py-2 align-top w-[120px]">
            <select data-id="${p._id}" data-field="available"
                class="w-full border border-gray-200 rounded p-2 text-sm bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all">
                <option value="available" ${p.available === 'available' ? 'selected' : ''}>Available</option>
                <option value="not available" ${p.available === 'not available' ? 'selected' : ''}>Not
                    Available</option>
            </select>
        </td>

        <td
            class="px-3 py-2 text-center align-top w-[150px] sticky right-0 bg-white shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.02)] group-hover:bg-emerald-50/50 transition-colors">
            <div class="flex flex-col gap-2 justify-center">
                <button onclick="updateProduct('${p._id}')"
                    class="bg-emerald-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition text-sm shadow-md">Update</button>
                <button onclick="deleteProduct('${p._id}')"
                    class="bg-red-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-600 transition text-sm shadow-md">Delete</button>
            </div>
        </td>
    </tr>
    `;
        productTableBody.appendChild(tr);
    });
}

// Inline image upload for product table
window.uploadInlineImage = async function (input, productId, field) {
    const file = input.files[0];
    if (!file) return;

    const loader = document.getElementById(`loader-${productId}-${field}`);
    const preview = document.getElementById(`preview-${productId}-${field}`);
    const hiddenInput = document.getElementById(`input-${productId}-${field}`);

    loader.classList.remove('hidden');
    loader.classList.add('flex');

    try {
        // Compress image before upload
        const compressedFile = await compressImage(file);

        const formData = new FormData();
        formData.append('image', compressedFile);
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            preview.innerHTML = `<img src="${data.url}" class="w-full h-full object-cover" /><div id="loader-${productId}-${field}" class="absolute inset-0 bg-white/80 hidden items-center justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>`;
            hiddenInput.value = data.url;
            console.log(`✅ ${field} uploaded for product ${productId}:`, data.url);
        } else {
            alert('Upload failed');
        }
    } catch (err) {
        console.error('Upload error:', err);
        alert('Error uploading image');
    } finally {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
};

// Update product
window.updateProduct = async function (id) {
    try {
        const fields = document.querySelectorAll(`[data-id="${id}"]`);
        const updatedData = {};
        fields.forEach(f => {
            const field = f.getAttribute('data-field');
            if (!field) return;
            updatedData[field] = f.value;
        });
        if (updatedData.price) updatedData.price = parseFloat(updatedData.price);
        await fetch(`${PRODUCT_API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });
        alert('product updated')
        await loadProducts();
    } catch (err) {
        console.error('updateProduct error:', err);
        alert('Failed to update product.');
    }
}

// Delete product
window.deleteProduct = async function (id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        await fetch(`${PRODUCT_API_URL}/${id}`, { method: 'DELETE' });
        alert('product deleted')
        await loadProducts();
    } catch (err) {
        console.error('deleteProduct error:', err);
        alert('Failed to delete product.');
    }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Search filter initialization
    const searchInput = document.getElementById('quickSearch');
    const categoryFilter = document.getElementById('filterCategory');
    const productTableBodyLocal = document.getElementById('productTable');

    // Coffee Bean Filters
    const beanFiltersDiv = document.getElementById('beanFilters');
    const filterBeanType = document.getElementById('filterBeanType');
    const filterBlend = document.getElementById('filterBlend');
    const filterOrigin = document.getElementById('filterOrigin');
    const filterGrind = document.getElementById('filterGrind');

    // Toggle Bean Filters visibility based on category
    const toggleBeanFilters = () => {
        if (!categoryFilter || !beanFiltersDiv) return;
        const selectedCategory = categoryFilter.value.toLowerCase().trim();

        if (selectedCategory === 'coffee beans') {
            beanFiltersDiv.classList.remove('hidden');
            beanFiltersDiv.classList.add('flex');
        } else {
            beanFiltersDiv.classList.add('hidden');
            beanFiltersDiv.classList.remove('flex');
            // Reset bean filters when hiding
            if (filterBeanType) filterBeanType.value = '';
            if (filterBlend) filterBlend.value = '';
            if (filterOrigin) filterOrigin.value = '';
            if (filterGrind) filterGrind.value = '';
        }
    };

    // Make applyFilters available to loadProducts
    window.applyFilters = () => {
        if (!searchInput || !categoryFilter || !productTableBodyLocal) return;

        const searchText = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value.toLowerCase().trim();

        // Bean-specific filters
        const beanType = filterBeanType ? filterBeanType.value.toLowerCase().trim() : '';
        const blend = filterBlend ? filterBlend.value.toLowerCase().trim() : '';
        const origin = filterOrigin ? filterOrigin.value.toLowerCase().trim() : '';
        const grind = filterGrind ? filterGrind.value.toLowerCase().trim() : '';

        const rows = productTableBodyLocal.querySelectorAll('tr');

        rows.forEach(row => {
            // Assuming Name is at column index 3 and Category is at column index 4
            // Be careful if column order changes in HTML
            const nameCell = row.cells[3];
            const categoryCell = row.cells[4];

            if (!nameCell || !categoryCell) {
                // Skip row if structure is unexpected
                row.style.display = 'table-row';
                return;
            }

            const productName = nameCell.textContent.toLowerCase().trim();
            // Get category from the select element's value, not textContent
            const categorySelect = categoryCell.querySelector('select');
            const productCategory = categorySelect ? categorySelect.value.toLowerCase().trim() : '';

            let matchesSearch = true;
            let matchesCategory = true;
            let matchesBeanFilters = true;

            // 1. Name/Search Filtering
            if (searchText) {
                matchesSearch = productName.includes(searchText);
            }

            // 2. Category Filtering (only if a specific category is selected)
            if (selectedCategory) {
                matchesCategory = productCategory === selectedCategory;
            }

            // 3. Bean-Specific Filtering (only applies if coffee beans category)
            if (selectedCategory === 'coffee beans' && matchesCategory) {
                // Check Type
                if (beanType && !productName.includes(beanType)) {
                    matchesBeanFilters = false;
                }
                // Check Blend
                if (blend && !productName.includes(blend.replace(' blend', ''))) {
                    matchesBeanFilters = false;
                }
                // Check Origin (extract first word, e.g., "Brazil" from "Brazil (Arabica)")
                if (origin) {
                    const originKey = origin.split(' ')[0];
                    if (!productName.includes(originKey)) {
                        matchesBeanFilters = false;
                    }
                }
                // Check Grind
                if (grind && !productName.includes(grind)) {
                    matchesBeanFilters = false;
                }
            }

            // Show or hide the row based on all filters
            if (matchesSearch && matchesCategory && matchesBeanFilters) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            toggleBeanFilters();
            applyFilters();
        });
        // Initial toggle on page load
        toggleBeanFilters();
    }

    // Bean filter change listeners
    if (filterBeanType) filterBeanType.addEventListener('change', applyFilters);
    if (filterBlend) filterBlend.addEventListener('change', applyFilters);
    if (filterOrigin) filterOrigin.addEventListener('change', applyFilters);
    if (filterGrind) filterGrind.addEventListener('change', applyFilters);
});
