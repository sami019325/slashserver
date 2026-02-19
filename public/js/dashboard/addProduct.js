// Add Product Logic
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const categorySelect = document.getElementById('newCategory');
    const coffeeBeansFields = document.getElementById('coffeeBeansFields');
    const merchandiseFields = document.getElementById('merchandiseFields');

    // Toggle Fields based on category
    const toggleFields = () => {
        if (categorySelect) {
            const selectedCategory = categorySelect.value;

            // Coffee Beans Logic
            if (selectedCategory === 'coffee beans' && coffeeBeansFields) {
                coffeeBeansFields.classList.remove('hidden');
            } else if (coffeeBeansFields) {
                coffeeBeansFields.classList.add('hidden');
            }

            // Merchandise Logic
            if (selectedCategory === 'merchandise products' && merchandiseFields) {
                merchandiseFields.classList.remove('hidden');
            } else if (merchandiseFields) {
                merchandiseFields.classList.add('hidden');
            }
        }
    };

    // Listen for category changes
    if (categorySelect) {
        categorySelect.addEventListener('change', toggleFields);
        toggleFields();
    }

    // --- Image Upload Logic ---
    const handleFileUpload = async (index) => {
        const fileInput = document.getElementById(`fileImg1`); // Wait, this needs careful indexing
        // I'll rewrite this part to be more robust
    };

    // Better way: loop through 1, 2, 3
    [1, 2, 3].forEach(idx => {
        const fileInput = document.getElementById(`fileImg${idx}`);
        const previewDiv = document.getElementById(`preview${idx}`);
        const loader = document.getElementById(`loader${idx}`);
        const hiddenInput = document.getElementById(`newImg${idx}`);

        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Re-select loader to avoid stale reference if HTML was updated
                const currentLoader = previewDiv.querySelector(`[id^="loader"]`);
                if (currentLoader) {
                    currentLoader.classList.remove('hidden');
                    currentLoader.classList.add('flex');
                }

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
                        // Update preview while preserving loader structure
                        previewDiv.innerHTML = `
                            <img src="${data.url}" class="w-full h-full object-cover" />
                            <div id="loader${idx}" class="absolute inset-0 bg-white/80 hidden items-center justify-center">
                                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                            </div>`;
                        // Update hidden input
                        hiddenInput.value = data.url;
                        console.log(`✅ Image ${idx} uploaded:`, data.url);
                    } else {
                        alert(`Upload failed for image ${idx}`);
                    }
                } catch (err) {
                    console.error('Upload error:', err);
                    alert(`Error uploading image ${idx}`);
                } finally {
                    const finalLoader = previewDiv.querySelector(`[id^="loader"]`);
                    if (finalLoader) {
                        finalLoader.classList.add('hidden');
                        finalLoader.classList.remove('flex');
                    }
                }
            });
        }
    });

    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            console.log("CLICKED");
            try {
                let name = document.getElementById('newName').value.trim() || "Unnamed Product";

                // If coffee beans, append bean attributes to name for filtering
                const category = document.getElementById('newCategory').value;
                if (category === 'coffee beans') {
                    const beanType = document.getElementById('newBeanType')?.value || '';
                    const blend = document.getElementById('newBlend')?.value || '';
                    const origin = document.getElementById('newOrigin')?.value || '';
                    const grindSize = document.getElementById('newGrindSize')?.value || '';

                    // Build attribute suffix
                    const attributes = [];
                    if (beanType) attributes.push(beanType);
                    if (blend) attributes.push(blend);
                    if (origin) attributes.push(origin);
                    if (grindSize) attributes.push(grindSize);

                    // Append to name if not already included
                    const nameLower = name.toLowerCase();
                    attributes.forEach(attr => {
                        if (!nameLower.includes(attr.toLowerCase())) {
                            name += ` - ${attr}`;
                        }
                    });
                }

                // If Merchandise, append type to name 
                if (category === 'merchandise products') {
                    const merchType = document.getElementById('newMerchType')?.value || '';
                    if (merchType && !name.toLowerCase().includes(merchType.toLowerCase())) {
                        name += ` || ${merchType}`;
                    }
                }

                const newProduct = {
                    img1: document.getElementById('newImg1').value.trim(),
                    img2: document.getElementById('newImg2').value.trim(),
                    img3: document.getElementById('newImg3').value.trim(),
                    name,
                    price: parseFloat(document.getElementById('newPrice').value) || 0,
                    quantity: document.getElementById('newQuantity').value.trim(),
                    details1: document.getElementById('newDetails1').value.trim(),
                    details2: document.getElementById('newDetails2').value.trim(),
                    details3: document.getElementById('newDetails3').value.trim(),
                    menufacturer: document.getElementById('newManufacturer').value.trim(),
                    menufactured_country: document.getElementById('newManufacturedCountry').value.trim(),
                    key_points1: document.getElementById('newKey1').value.trim(),
                    key_points2: document.getElementById('newKey2').value.trim(),
                    key_points3: document.getElementById('newKey3').value.trim(),
                    key_points4: document.getElementById('newKey4').value.trim(),
                    key_points5: document.getElementById('newKey5').value.trim(),
                    category: document.getElementById('newCategory').value,
                    available: document.getElementById('newAvailable').value
                };
                console.log('newProduct', newProduct)
                await fetch("/api/products", {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct)
                });
                // clear form (small UX nicety)
                document.getElementById('newName').value = '';
                document.getElementById('newImg1').value = '';
                document.getElementById('newImg2').value = '';
                document.getElementById('newImg3').value = '';
                document.getElementById('newPrice').value = '';
                document.getElementById('newDetails1').value = '';
                document.getElementById('newDetails2').value = '';
                document.getElementById('newDetails3').value = '';
                document.getElementById('newManufacturer').value = '';
                document.getElementById('newManufacturedCountry').value = '';
                document.getElementById('newKey1').value = '';
                document.getElementById('newKey2').value = '';
                document.getElementById('newKey3').value = '';
                document.getElementById('newKey4').value = '';
                document.getElementById('newKey5').value = '';
                document.getElementById('newQuantity').value = '';

                // Reset coffee bean fields
                if (document.getElementById('newBeanType')) document.getElementById('newBeanType').value = '';
                if (document.getElementById('newBlend')) document.getElementById('newBlend').value = '';
                if (document.getElementById('newOrigin')) document.getElementById('newOrigin').value = '';
                if (document.getElementById('newGrindSize')) document.getElementById('newGrindSize').value = '';

                // Reset Merchandise fields
                if (document.getElementById('newMerchType')) document.getElementById('newMerchType').value = '';

                // Reset Image Previews
                [1, 2, 3].forEach(idx => {
                    const previewDiv = document.getElementById(`preview${idx}`);
                    const spanText = idx === 1 ? 'Primary Image' : (idx === 2 ? 'Secondary Image' : 'Tertiary Image');
                    previewDiv.innerHTML = `
                        <span class="text-xs text-gray-400">${spanText}</span>
                        <div id="loader${idx}" class="absolute inset-0 bg-white/80 hidden items-center justify-center">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                        </div>
                    `;
                    document.getElementById(`newImg${idx}`).value = '';
                    document.getElementById(`fileImg${idx}`).value = '';
                });

                alert('New product is successfully added');

                // Refresh product list if function exists
                if (typeof window.loadProducts === 'function') {
                    await window.loadProducts();
                }
            } catch (err) {
                console.error('Add product error:', err);
                alert('Failed to add product.');
            }
        });
    }
});
