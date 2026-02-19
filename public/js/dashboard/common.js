// Auth Check
async function checkAuth() {
    try {
        const res = await fetch('/api/admin/check-auth', { credentials: 'include' });
        if (res.status === 401) window.location.href = '/admin.html';
    } catch (err) {
        window.location.href = '/admin.html';
    }
}
checkAuth();

// Logout & Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    // Logout Handler (Class-based for multiple buttons)
    const logoutBtns = document.querySelectorAll('.logout-trigger');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent default link behavior if it's an anchor
            try {
                await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
            } catch (e) { /* ignore */ }
            window.location.href = '/admin.html';
        });
    });

    // Mobile Menu Handler
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        // Toggle menu on button click
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
        });

        // Close menu when clicking a link
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
        });
    }
});
// Image Compression Utility
async function compressImage(file, { maxWidth = 800, maxHeight = 800, quality = 0.6 } = {}) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    // Create a new File object from the blob to preserve original name
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
        };
    });
}
