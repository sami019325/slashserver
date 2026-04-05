// Add Article Logic
document.addEventListener('DOMContentLoaded', () => {
    const addContentBtn = document.getElementById('addContentBtn');
    const fileContentImg = document.getElementById('fileContentImg');
    const contentPreview = document.getElementById('contentPreview');
    const contentLoader = document.getElementById('contentLoader');
    const contentImgInput = document.getElementById('contentImg');

    if (fileContentImg) {
        fileContentImg.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            contentLoader.classList.remove('hidden');
            contentLoader.classList.add('flex');

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
                    contentPreview.innerHTML = `<img src="${data.url}" class="w-full h-full object-cover" /><div id="contentLoader" class="absolute inset-0 bg-white/80 hidden items-center justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>`;
                    contentImgInput.value = data.url;
                } else {
                    alert('Upload failed');
                }
            } catch (err) {
                console.error('Upload error:', err);
                alert('Error uploading image');
            } finally {
                contentLoader.classList.add('hidden');
                contentLoader.classList.remove('flex');
            }
        });
    }

    if (addContentBtn) {
        addContentBtn.addEventListener('click', async () => {
            try {
                const CONTENT_API = 'api/content'; // defined locally to avoid dependency issues if loaded out of order
                const newContent = {
                    img: contentImgInput.value.trim(),
                    heading: document.getElementById('contentHeading').value.trim(),
                    subHeading: document.getElementById('contentSubHeading').value.trim(),
                    details: document.getElementById('contentDetails').value.trim(),
                    search_Key: document.getElementById('contentHeading').value.trim() + document.getElementById('contentSubHeading').value.trim(),
                    productId: document.getElementById('contentProductId').value.trim()
                };
                await fetch(CONTENT_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newContent)
                });
                alert('contain posted');
                contentImgInput.value = '';
                document.getElementById('contentHeading').value = '';
                document.getElementById('contentSubHeading').value = '';
                document.getElementById('contentDetails').value = '';
                document.getElementById('contentProductId').value = '';
                contentPreview.innerHTML = `<span class="text-xs text-gray-400">Article Image</span><div id="contentLoader" class="absolute inset-0 bg-white/80 hidden items-center justify-center"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>`;

                if (typeof window.loadContent === 'function') {
                    await window.loadContent();
                }
            } catch (err) {
                console.error('addContent error:', err);
                alert('Failed to add content');
            }
        });
    }
});
