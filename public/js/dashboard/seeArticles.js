// See Articles Logic
const CONTENT_API = 'api/content';
let currentContentId = null; // State for modal

// Load content
window.loadContent = async function () {
    const contentTable = document.getElementById('contentTable');
    if (!contentTable) return;
    try {
        const res = await fetch(CONTENT_API);
        if (!res.ok) throw new Error('Failed to fetch content');
        const contents = await res.json();
        renderContent(contents);
    } catch (err) {
        console.error('loadContent error:', err);
    }
}

function renderContent(contents) {
    const contentTable = document.getElementById('contentTable');
    if (!contentTable) return;

    contentTable.innerHTML = '';
    contents.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
    <td class="p-3"><span class="contentTitle cursor-pointer text-green-800 font-medium hover:underline"
            data-id="${c._id}">${c.heading}</span></td>
    <td class="p-3">
        <button onclick="deleteContent('${c._id}')"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow-sm text-sm">Delete</button>
    </td>
    `;
        contentTable.appendChild(tr);
    });

    attachArticleClickListeners();
}

// Delete content
window.deleteContent = async function (id) {
    if (!confirm('Are you sure?')) return;
    try {
        await fetch(`${CONTENT_API}/${id}`, { method: 'DELETE' });
        await loadContent();
    } catch (err) {
        console.error('delete content error:', err);
        alert('Failed to delete content');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadContent();

    const fileModalImg = document.getElementById('fileModalImg');
    const modalPreview = document.getElementById('modalPreview');
    const modalLoader = document.getElementById('modalLoader');
    const modalImgInput = document.getElementById('modalImg');

    if (fileModalImg) {
        fileModalImg.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            modalLoader.classList.remove('hidden');
            modalLoader.classList.add('flex');

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
                    modalPreview.innerHTML = `<img src="${data.url}" class="w-full h-full object-cover" /><div id="modalLoader" class="absolute inset-0 bg-white/80 hidden items-center justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>`;
                    modalImgInput.value = data.url;
                } else {
                    alert('Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                alert('Error uploading image');
            } finally {
                modalLoader.classList.add('hidden');
                modalLoader.classList.remove('flex');
            }
        });
    }

    const updateBtn = document.getElementById('updateContentBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', async () => {
            try {
                const updated = {
                    img: modalImgInput.value.trim(),
                    heading: document.getElementById('modalHeading').value.trim(),
                    subHeading: document.getElementById('modalSubHeading').value.trim(),
                    details: document.getElementById('modalDetails').value.trim(),
                    search_Key: document.getElementById('modalHeading').value.trim() + document.getElementById('modalSubHeading').value.trim(),
                    productId: document.getElementById('modalProductId').value.trim()
                };
                await fetch(`${CONTENT_API}/${currentContentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                });

                const modal = document.getElementById('contentModal');
                if (modal) modal.style.display = 'none';
                alert('content updated')
                await loadContent();
            } catch (err) {
                console.error('update content error:', err);
                alert('Failed to update content');
            }
        });
    }

    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('contentModal');
            if (modal) modal.style.display = 'none';
        });
    }
});

// Update title click listener to show existing image in preview
function attachArticleClickListeners() {
    document.querySelectorAll('.contentTitle').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.getAttribute('data-id');
            currentContentId = id;
            try {
                const res = await fetch(`${CONTENT_API}/${id}`);
                const data = await res.json();

                const modalImgInput = document.getElementById('modalImg');
                const modalPreview = document.getElementById('modalPreview');

                modalImgInput.value = data.img || '';
                if (data.img) {
                    modalPreview.innerHTML = `<img src="${data.img}" class="w-full h-full object-cover" /><div id="modalLoader" class="absolute inset-0 bg-white/80 hidden items-center justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>`;
                } else {
                    modalPreview.innerHTML = `<span class="text-xs text-gray-400">Current/New Image</span><div id="modalLoader" class="absolute inset-0 bg-white/80 hidden items-center justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>`;
                }

                document.getElementById('modalHeading').value = data.heading || '';
                document.getElementById('modalSubHeading').value = data.subHeading || '';
                document.getElementById('modalDetails').value = data.details || '';
                document.getElementById('modalProductId').value = data.productId || '';
                const modal = document.getElementById('contentModal');
                if (modal) modal.style.display = 'flex';
            } catch (e) { console.error(e); }
        });
    });
}
