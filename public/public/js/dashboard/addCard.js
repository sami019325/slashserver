// Add/Edit Card Logic
let editingCardId = null; // Local state for edit mode

function resetCardForm() {
    const form = document.getElementById("adminPostForm");
    if (form) form.reset();
    editingCardId = null;

    const title = document.getElementById("formTitleAction");
    const btnText = document.getElementById("btnText");
    const cancelBtn = document.getElementById("cancelUpdateBtn");
    const formSection = document.getElementById("addCardForm");

    if (title) title.innerText = "📌 Add New";
    if (btnText) btnText.innerText = "Publish Card";
    if (cancelBtn) cancelBtn.classList.add("hidden");
    if (formSection) formSection.classList.remove("ring-2", "ring-green-500");
}

window.editCard = function (id) {
    if (!window.currentCards) return;
    const card = window.currentCards.find(c => c._id === id);
    if (!card) return;

    editingCardId = id;

    const form = document.getElementById("adminPostForm");
    if (!form) return;

    form.elements['name'].value = card.name || "";
    form.elements['category'].value = card.category || "";
    form.elements['phone'].value = card.C_Number || "";
    form.elements['location'].value = card.C_Location || "";
    form.elements['note'].value = card.details1 || "";
    form.elements['available'].value = card.available || "available";

    const title = document.getElementById("formTitleAction");
    const btnText = document.getElementById("btnText");
    const cancelBtn = document.getElementById("cancelUpdateBtn");
    const formSection = document.getElementById("addCardForm");

    if (title) title.innerText = "✏️ Edit";
    if (btnText) btnText.innerText = "Update Card";
    if (cancelBtn) cancelBtn.classList.remove("hidden");
    if (formSection) {
        formSection.classList.add("ring-2", "ring-green-500");
        formSection.scrollIntoView({ behavior: "smooth" });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("adminPostForm");
    const cancelBtn = document.getElementById("cancelUpdateBtn");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("submitBtn");
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>⏳</span> Processing...`;

            try {
                const formData = new FormData(form);
                const API_BASE = "/api/cards"; // Redefined here or import if module

                const isUpdate = !!editingCardId;
                const url = isUpdate ? `${API_BASE}/${editingCardId}` : API_BASE;
                const method = isUpdate ? "PUT" : "POST";

                const res = await fetch(url, {
                    method: method,
                    body: formData
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        throw new Error("Unauthorized: You must be an Admin to perform this action.");
                    }
                    const errData = await res.json();
                    throw new Error(errData.error || "Operation failed");
                }

                alert(isUpdate ? "✅ Card updated successfully!" : "✅ Card created successfully!");

                resetCardForm();
                if (typeof window.loadCards === 'function') {
                    window.loadCards();
                }

            } catch (err) {
                alert("❌ Error: " + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", resetCardForm);
    }
});
