// See Cards Logic
const CARD_API_BASE = "/api/cards";
window.currentCards = []; // Global to be accessible by addCard.js for editing

// Helpers
const escapeHtmlCard = (str) => {
    if (!str || str === "null") return "";
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
};

function buildCardRowHTML(card) {
    const img = (card.img1 && card.img1 !== 'null') ? card.img1 : 'https://placehold.co/50x50?text=No+Img';
    const note = card.details1 || "";
    const phone = card.C_Number || "";
    const location = card.C_Location || "";
    const statusClass = card.available === 'available'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';

    return `
        <tr class="hover:bg-gray-50 transition group" data-id="${card._id}">
            <td class="px-4 py-3">
                <div class="h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                    <img src="${img}" alt="img" class="h-full w-full object-cover">
                </div>
            </td>
            <td class="px-4 py-3 font-semibold text-gray-800">${escapeHtmlCard(card.name)}</td>
            <td class="px-4 py-3 text-gray-600 w-64">
                <span
                    class="px-2 py-1 bg-gray-100 rounded-md text-xs border border-gray-200 w-48">${escapeHtmlCard(card.category)}</span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs max-w-xs truncate" title="${escapeHtmlCard(note)}">
                ${escapeHtmlCard(note)}
            </td>
            <td class="px-4 py-3 text-gray-600 text-sm">${escapeHtmlCard(phone)}</td>
            <td class="px-4 py-3 text-gray-600 text-sm">${escapeHtmlCard(location)}</td>
            <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 rounded-full text-xs font-bold ${statusClass}">
                    ${escapeHtmlCard(card.available)}
                </span>
            </td>
            <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button type="button" onclick="editCard('${card._id}')"
                        class="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition" title="Edit">
                        ✏️
                    </button>
                    <button type="button" onclick="deleteCard('${card._id}')"
                        class="p-2 rounded-lg hover:bg-red-50 text-red-600 transition" title="Delete">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
        `;
}

window.loadCards = async function (searchParams = {}) {
    const tableBody = document.getElementById("cardTable");
    if (!tableBody) return;

    tableBody.innerHTML = `<tr>
            <td colspan="8" class="p-8 text-center text-gray-500">Loading data...</td>
        </tr>`;

    try {
        let url = CARD_API_BASE;
        if (searchParams.query) {
            url = `${CARD_API_BASE}/name/${encodeURIComponent(searchParams.query)}`;
        } else if (searchParams.category) {
            url = `${CARD_API_BASE}/ctgry/${encodeURIComponent(searchParams.category)}`;
        }

        const res = await fetch(url);

        if (!res.ok) {
            if (res.status === 404) {
                tableBody.innerHTML = `<tr>
            <td colspan="8" class="p-8 text-center text-gray-400">No results found.</td>
        </tr>`;
                return;
            }
            throw new Error("Fetch failed");
        }

        const data = await res.json();
        let list = Array.isArray(data) ? data : (data.products || []);
        window.currentCards = list;

        if (list.length === 0) {
            tableBody.innerHTML = `<tr>
            <td colspan="8" class="p-8 text-center text-gray-400">No cards found.</td>
        </tr>`;
            return;
        }

        tableBody.innerHTML = list.map(buildCardRowHTML).join("");

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr>
            <td colspan="8" class="p-8 text-center text-red-500">Error loading data. Check console.</td>
        </tr>`;
    }
}

window.deleteCard = async function (id) {
    if (!confirm("Are you sure you want to delete this card? This action cannot be undone."))
        return;

    try {
        const res = await fetch(`${CARD_API_BASE}/${id}`, { method: "DELETE" });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                throw new Error("Unauthorized: You must be an Admin to delete.");
            }
            throw new Error("Delete failed");
        }

        alert("✅ Card deleted.");
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) row.remove();
        window.currentCards = window.currentCards.filter(c => c._id !== id);

    } catch (err) {
        alert("❌ Error: " + err.message);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Only init if table exists
    if (document.getElementById('cardTable')) {
        loadCards();

        const cardReloadBtn = document.getElementById("cardReloadBtn");
        if (cardReloadBtn) {
            cardReloadBtn.addEventListener("click", () => {
                const search = document.getElementById("cardSearch");
                const filter = document.getElementById("cardFilterCat");
                if (search) search.value = "";
                if (filter) filter.value = "";
                loadCards();
            });
        }

        const cardSearch = document.getElementById("cardSearch");
        const cardFilterCat = document.getElementById("cardFilterCat");

        const runSearch = () => {
            const q = cardSearch ? cardSearch.value.trim() : "";
            const c = cardFilterCat ? cardFilterCat.value.trim() : "";
            loadCards({ query: q, category: c });
        };

        if (cardSearch) cardSearch.addEventListener("change", runSearch);
        if (cardFilterCat) cardFilterCat.addEventListener("change", runSearch);
    }
});
