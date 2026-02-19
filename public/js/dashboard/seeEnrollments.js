// ============================================
// ACADEMY ENROLLED — Dashboard Section
// ============================================

(function () {
    const enrollmentTableBody = document.getElementById('enrollmentTable');
    const enrollSearchInput = document.getElementById('enrollSearch');
    const enrollReloadBtn = document.getElementById('enrollReloadBtn');

    let allEnrollments = [];

    // Fetch and render enrollments
    async function loadEnrollments() {
        if (!enrollmentTableBody) return;
        enrollmentTableBody.innerHTML = `
            <tr><td colspan="7" class="text-center py-8 text-gray-400">
                <div class="animate-spin inline-block w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mb-2"></div>
                <p>Loading enrollments...</p>
            </td></tr>`;

        try {
            const res = await fetch('/api/enroll', { credentials: 'include' });
            const result = await res.json();

            if (result.success && Array.isArray(result.data)) {
                allEnrollments = result.data;
                renderTable(allEnrollments);
            } else {
                enrollmentTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-red-500">Failed to load data</td></tr>`;
            }
        } catch (err) {
            console.error('Enrollment fetch error:', err);
            enrollmentTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-red-500">Network error</td></tr>`;
        }
    }

    function renderTable(data) {
        if (!data || data.length === 0) {
            enrollmentTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No enrollments found</td></tr>`;
            return;
        }

        enrollmentTableBody.innerHTML = data.map((e, i) => {
            const date = e.timestamp ? new Date(e.timestamp).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            }) : '—';

            return `
                <tr class="hover:bg-green-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}">
                    <td class="px-4 py-3 font-medium text-gray-800">${escapeHtml(e.C_Name)}</td>
                    <td class="px-4 py-3 text-gray-600">${escapeHtml(e.itemName)}</td>
                    <td class="px-4 py-3 text-gray-600">${escapeHtml(e.C_Phone1)}</td>
                    <td class="px-4 py-3 text-gray-600">${escapeHtml(e.C_Email)}</td>
                    <td class="px-4 py-3 text-gray-500 text-xs">${date}</td>
                    <td class="px-4 py-3 text-gray-500 text-xs font-mono">${escapeHtml(e.order_id)}</td>
                    <td class="px-4 py-3 text-center">
                        <button onclick="showEnrollDetail('${e._id}')" 
                            class="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition">
                            View
                        </button>
                    </td>
                </tr>`;
        }).join('');
    }

    // Search filter
    if (enrollSearchInput) {
        enrollSearchInput.addEventListener('input', () => {
            const q = enrollSearchInput.value.toLowerCase();
            const filtered = allEnrollments.filter(e =>
                (e.C_Name && e.C_Name.toLowerCase().includes(q)) ||
                (e.itemName && e.itemName.toLowerCase().includes(q)) ||
                (e.C_Phone1 && e.C_Phone1.includes(q)) ||
                (e.C_Email && e.C_Email.toLowerCase().includes(q)) ||
                (e.order_id && e.order_id.toLowerCase().includes(q))
            );
            renderTable(filtered);
        });
    }

    // Reload button
    if (enrollReloadBtn) {
        enrollReloadBtn.addEventListener('click', loadEnrollments);
    }

    // Detail modal
    window.showEnrollDetail = function (id) {
        const e = allEnrollments.find(x => x._id === id);
        if (!e) return;

        const modal = document.getElementById('enrollDetailModal');
        const content = document.getElementById('enrollDetailContent');
        if (!modal || !content) return;

        const date = e.timestamp ? new Date(e.timestamp).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : '—';

        content.innerHTML = `
            <div class="space-y-1">
                ${detailRow('Name', e.C_Name)}
                ${detailRow('Course', e.itemName)}
                ${detailRow('Phone 1', e.C_Phone1)}
                ${detailRow('Phone 2', e.C_Phone2)}
                ${detailRow('Email', e.C_Email)}
                ${detailRow('Location', e.C_S_Location)}
                ${detailRow('Order ID', e.order_id)}
                ${detailRow('Enrolled On', date)}
                ${e.message ? `
                    <div class="mt-3 pt-3 border-t border-gray-100">
                        <p class="text-xs font-bold text-gray-500 uppercase mb-1">Message</p>
                        <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">${escapeHtml(e.message)}</p>
                    </div>` : ''}
            </div>`;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.closeEnrollDetail = function () {
        const modal = document.getElementById('enrollDetailModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    function detailRow(label, value) {
        return `
            <div class="flex justify-between py-2 border-b border-gray-50">
                <span class="text-sm font-medium text-gray-500">${label}</span>
                <span class="text-sm font-semibold text-gray-800">${escapeHtml(value) || 'N/A'}</span>
            </div>`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Auto-load on page ready
    loadEnrollments();
})();
