document.addEventListener("DOMContentLoaded", async () => {
    const mainContent = document.getElementById("main-content");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    const modalContainer = document.getElementById("modal-container");
    
    // Auth UI Elements
    const loginOverlay = document.getElementById("login-overlay");
    const sidebarNav = document.getElementById("sidebar-nav");
    const mainBody = document.getElementById("main-body");
    const loginForm = document.getElementById("admin-login-form");
    const loginError = document.getElementById("login-error");

    /**
     * INITIALIZE AUTHENTICATION
     */
    async function initAuth() {
        try {
            const res = await fetch("/api/admin/check-auth");
            if (res.ok) {
                showDashboard();
            } else {
                hideDashboard();
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            hideDashboard();
        }
    }

    function showDashboard() {
        loginOverlay.classList.add("hidden");
        sidebarNav.classList.remove("hidden");
        mainBody.classList.remove("hidden");
    }

    function hideDashboard() {
        loginOverlay.classList.remove("hidden");
        sidebarNav.classList.add("hidden");
        mainBody.classList.add("hidden");
    }

    // Handle Login Form
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            loginError.classList.add("hidden");
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    showDashboard();
                } else {
                    loginError.classList.remove("hidden");
                }
            } catch (err) {
                console.error("Login request failed:", err);
                loginError.innerText = "Server Error. Try again.";
                loginError.classList.remove("hidden");
            }
        });
    }

    const navItems = {
        "nav-create-user": () => window.createUser(),
        "nav-all-reg": () => window.showUserList(),
        "nav-requested": () => window.showUserList("pending"),
        "nav-enrolled": () => window.showUserList(null, "student"),
        "nav-completed": () => window.showUserList("completed"),
        "nav-employees": () => window.showUserList(null, ["staff", "admin", "owner"]),
        "nav-cert-viewers": () => window.showCertificateViewers(),
        "nav-courses": () => window.showCourses(),
        "nav-logout": () => window.handleLogout()
    };

    // Attach click events to nav items
    Object.keys(navItems).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                // Remove active class from all
                Object.keys(navItems).forEach(k => {
                    const nav = document.getElementById(k);
                    if (nav) nav.classList.remove("bg-emerald-600/10", "text-emerald-400", "border-emerald-600/20");
                });
                // Add active class to clicked
                el.classList.add("bg-emerald-600/10", "text-emerald-400", "border-emerald-600/20");
                
                navItems[id]();
            });
        }
    });

    /**
     * Helper to render templates into main content
     */
    function render(html, title, subtitle) {
        mainContent.innerHTML = html;
        pageTitle.innerText = title;
        pageSubtitle.innerText = subtitle;
    }

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            if (result.success) return result.url;
            throw new Error(result.error || "Upload failed");
        } catch (err) {
            console.error("Upload error:", err);
            throw err;
        }
    }

    /**
     * SHARED USER FETCH & RENDER
     */
    window.fetchAndRenderUsers = async (search = "", statusFilter = null, typeFilter = null) => {
        const tbody = document.getElementById("user-list-tbody");
        if (!tbody) return;

        try {
            const res = await fetch("/api/admin/users");
            let users = await res.json();

            // Client-side Filter
            let filteredList = users;
            if (search) {
                const term = search.toLowerCase();
                filteredList = filteredList.filter(u => u.name.toLowerCase().includes(term) || u.phone.includes(term));
            }
            if (statusFilter) {
                filteredList = filteredList.filter(u => u.status === statusFilter);
            }
            if (typeFilter) {
                const filters = Array.isArray(typeFilter) ? typeFilter : [typeFilter];
                filteredList = filteredList.filter(u => filters.includes(u.typeOfUser));
            }

            if (filteredList.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400 font-medium whitespace-nowrap">Empty registry.</td></tr>`;
                return;
            }

            tbody.innerHTML = filteredList.map(user => `
                <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                                ${user.Image ? `<img src="${user.Image}" class="w-full h-full object-cover">` : `<i class="fa-solid fa-user text-slate-200"></i>`}
                            </div>
                            <div class="flex flex-col">
                                <p class="font-black text-slate-800 text-xs">${user.name}</p>
                                <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">${user.phone}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <p class="text-[10px] font-black text-slate-700 uppercase tracking-tight line-clamp-1 mb-1.5">${user.course || 'Unassigned'}</p>
                        <div class="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                            <div class="bg-emerald-500 h-full rounded-full transition-all" style="width: ${user.progress || 0}%"></div>
                        </div>
                    </td>
                    <td class="px-6 py-4 uppercase text-[9px] font-black tracking-widest text-slate-400">
                        ${user.typeOfUser}
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border
                            ${user.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              user.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                              user.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              'bg-slate-50 text-slate-600 border-slate-200'}">
                            ${user.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex gap-2 justify-end">
                            ${user.status === 'completed' ? `
                                <button onclick="window.generateCertificate('${user._id}')" class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all group/btn" title="Download Certificate">
                                    <i class="fa-solid fa-file-arrow-down text-lg group-hover/btn:scale-110 transition-transform"></i>
                                </button>
                            ` : ''}
                            <button onclick="window.editUser('${user._id}')" class="p-2 text-slate-400 hover:text-slate-900 transition-all" title="Edit Profile">
                                <i class="fa-solid fa-pen-nib"></i>
                            </button>
                            <button onclick="window.deleteUser('${user._id}')" class="p-2 text-slate-200 hover:text-red-500 transition-all" title="Purge Record">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

        } catch (err) {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-red-400">Telemetry failure.</td></tr>`;
        }
    };

    /**
     * CREATE NEW USER VIEW
     */
    /**
     * CREATE NEW USER VIEW
     */
    window.createUser = async () => {
        let courseOptions = "";
        try {
            const res = await fetch("/api/admin/courses");
            const courses = await res.json();
            courseOptions = courses.map(c => `<option value="${c.courseName || c.topic}">${c.courseName || c.topic}</option>`).join('');
        } catch (err) { console.error(err); }

        const template = `
            <div class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm animate-in slide-in-from-bottom-8 duration-500">
                <form id="create-user-form" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                        <input type="text" name="name" required placeholder="John Doe"
                            class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone String</label>
                        <input type="text" name="phone" required placeholder="+8801..."
                            class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Credentials (Password)</label>
                        <input type="password" name="password" required placeholder="••••••••"
                            class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City/Area</label>
                        <input type="text" name="address" required placeholder="Dhanmondi, Dhaka"
                            class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Assigned Track</label>
                        <select name="course" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                            <option value="">-- No Course Selected --</option>
                            ${courseOptions}
                        </select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Access Level</label>
                        <select name="typeOfUser" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                            <option value="student">Student Account</option>
                            <option value="customer">Customer Feed</option>
                            <option value="staff">Staff Portal</option>
                            <option value="admin">System Admin</option>
                            <option value="owner">Executive Access (Owner)</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Payment/Ref ID</label>
                        <input type="text" name="payment" placeholder="Transaction ID..."
                            class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Identification Photo</label>
                        <input type="file" name="imageFile" accept="image/*"
                            class="w-full bg-amber-50/10 border border-amber-200/30 rounded-2xl px-5 py-3 text-xs font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 transition-all">
                    </div>
                    <div class="md:col-span-2 mt-4 pt-8 border-t border-slate-100 flex justify-end gap-3">
                        <button type="reset" class="px-8 py-3 rounded-xl border border-slate-200 text-slate-400 font-bold hover:bg-slate-50 transition-all uppercase text-[10px] tracking-widest">Clear Input</button>
                        <button type="submit" id="create-submit-btn" class="px-10 py-3 rounded-xl bg-slate-900 text-white font-black shadow-lg hover:bg-slate-800 active:scale-95 transition-all uppercase text-[10px] tracking-widest">Confirm Registration</button>
                    </div>
                </form>
            </div>
        `;
        render(template, "Member Enrollment", "Register a new participant into the SCA ecosystem.");
        
        document.getElementById("create-user-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("create-submit-btn");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Syncing Record...";
            submitBtn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const imageFile = formData.get("imageFile");

            try {
                if (imageFile && imageFile.size > 0) {
                    submitBtn.innerText = "Branding Photo...";
                    data.Image = await uploadImage(imageFile);
                }
                delete data.imageFile;

                const res = await fetch("/api/admin/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                
                if (res.ok) {
                    alert("Account provisioned successfully!");
                    e.target.reset();
                } else {
                    const err = await res.json();
                    alert("Failure: " + err.error);
                }
            } catch (err) {
                console.error(err);
                alert("Critical System Error: " + err.message);
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * USER LIST VIEW (Searchable)
     */
    /**
     * USER LIST VIEW (Searchable)
     */
    window.showUserList = async (statusFilter = null, typeFilter = null) => {
        const template = `
            <div class="flex flex-col gap-6 animate-in fade-in duration-500">
                <!-- Search & Filters -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                    <div class="relative flex-1 min-w-[300px]">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 font-black top-2/5 -translate-y-1/2 text-slate-300"></i>
                        <input type="text" id="user-search" placeholder="Search parameters..." 
                            class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-bold">
                    </div>
                    <div id="filter-badges" class="flex gap-2">
                        ${statusFilter ? `<span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-200">State: ${statusFilter}</span>` : ''}
                        ${typeFilter ? `<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-wider border border-blue-200">Role: ${typeFilter}</span>` : ''}
                    </div>
                </div>

                <!-- Users Table -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Curriculum Progress</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Standing</th>
                                <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Command</th>
                            </tr>
                        </thead>
                        <tbody id="user-list-tbody">
                            <tr><td colspan="5" class="p-10 text-center text-slate-400 font-medium">Booting records...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        render(template, "User Records", "Monitor and manage system participants.");

        const searchInput = document.getElementById("user-search");
        searchInput.addEventListener("input", (e) => {
            window.fetchAndRenderUsers(e.target.value, statusFilter, typeFilter);
        });

        // Initial fetch
        window.fetchAndRenderUsers("", statusFilter, typeFilter);
    }

    /**
     * GENERATE CERTIFICATE
     */
    window.generateCertificate = async (userId) => {
        try {
            // 1. Fetch user data (get fresh data for serial if exists)
            const res = await fetch(`/api/admin/users`);
            const users = await res.json();
            const user = users.find(u => u._id === userId);
            if (!user) return alert("User not found");

            // 2. Handle Serial Number
            let serial = user.certificateId;
            if (!serial) {
                const year = new Date().getFullYear();
                const random = Math.floor(1000 + Math.random() * 9000);
                serial = `SCA-${year}-${random}`;
                
                // Save to DB
                await fetch(`/api/admin/users/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ certificateId: serial })
                });
            }

            // 3. Populate template
            const template = document.getElementById("certificate-template");
            document.getElementById("cert-user-name").innerText = user.name.toUpperCase();
            document.getElementById("cert-course-name").innerText = (user.course || "Professional Training").toLowerCase();
            document.getElementById("cert-serial").innerText = serial;
            
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const yearShort = String(now.getFullYear()).slice(-2);
            document.getElementById("cert-date").innerText = `${day}/${month}/${yearShort}`;

            // 4. Render to Image
            const dataUrl = await htmlToImage.toPng(template, {
                quality: 1,
                pixelRatio: 3, // Higher resolution for pixel perfection
                backgroundColor: "#ffffff"
            });

            // 5. Convert to PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [1000, 750]
            });

            pdf.addImage(dataUrl, "PNG", 0, 0, 1000, 750);
            pdf.save(`Cert_${user.name.replace(/\s+/g,'_')}.pdf`);

        } catch (err) {
            console.error("Certificate generation error:", err);
            alert("Failed to generate certificate: " + err.message);
        }
    };

    /**
     * EDIT USER ACTION (Dynamic Course Dropdown)
     */
    window.editUser = async (id) => {
        try {
            const userRes = await fetch(`/api/admin/users`);
            const users = await userRes.json();
            const user = users.find(u => u._id === id);
            if (!user) return;

            const courseRes = await fetch("/api/admin/courses");
            const courses = await courseRes.json();
            const courseOptions = courses.map(c => `
                <option value="${c.courseName || c.topic}" ${user.course === (c.courseName || c.topic) ? 'selected' : ''}>
                    ${c.courseName || c.topic}
                </option>
            `).join('');

            modalContainer.innerHTML = `
                <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
                    <div class="p-8 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-white">
                        <div>
                            <h3 class="text-xl font-bold">Member Analytics & Config</h3>
                            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">ID: ${user._id}</p>
                        </div>
                        <button onclick="window.closeModal()" class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                    <form id="edit-user-form" class="p-10 grid grid-cols-2 gap-6 bg-white overflow-y-auto max-h-[80vh]">
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                            <input type="text" name="name" value="${user.name}"
                                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</label>
                            <input type="text" name="phone" value="${user.phone}"
                                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</label>
                            <input type="text" name="address" value="${user.address || ''}"
                                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Curriculum Select</label>
                            <select name="course" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                                <option value="">No Active Track</option>
                                ${courseOptions}
                            </select>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Update Password</label>
                            <input type="password" name="password" placeholder="••••••••"
                                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">User Status</label>
                            <select name="status" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                                <option value="pending" ${user.status === 'pending' ? 'selected' : ''}>Pending Verification</option>
                                <option value="approved" ${user.status === 'approved' ? 'selected' : ''}>Active / Approved</option>
                                <option value="completed" ${user.status === 'completed' ? 'selected' : ''}>Finished Curriculum</option>
                                <option value="rejected" ${user.status === 'rejected' ? 'selected' : ''}>Inactive / Rejected</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Role</label>
                            <select name="typeOfUser" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                                <option value="student" ${user.typeOfUser === 'student' ? 'selected' : ''}>Student Account</option>
                                <option value="customer" ${user.typeOfUser === 'customer' ? 'selected' : ''}>Customer Feed</option>
                                <option value="staff" ${user.typeOfUser === 'staff' ? 'selected' : ''}>Staff Portal</option>
                                <option value="admin" ${user.typeOfUser === 'admin' ? 'selected' : ''}>System Admin</option>
                                <option value="owner" ${user.typeOfUser === 'owner' ? 'selected' : ''}>Executive Access (Owner)</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Progress Metrics (%)</label>
                            <input type="number" name="progress" value="${user.progress || 0}"
                                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Photo</label>
                            <input type="file" name="imageFile" accept="image/*"
                                class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800 text-xs">
                        </div>
                        <div class="md:col-span-2 pt-8 border-t border-slate-100 flex justify-end gap-3">
                            <button type="submit" id="edit-submit-btn" class="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all text-sm uppercase tracking-widest">
                                Sync Database
                            </button>
                        </div>
                    </form>
                </div>
            `;
            
            modalContainer.classList.remove("hidden");
            modalContainer.classList.add("flex");
            
            document.getElementById("edit-user-form").addEventListener("submit", async (e) => {
                e.preventDefault();
                const submitBtn = document.getElementById("edit-submit-btn");
                submitBtn.innerText = "Syncing...";
                submitBtn.disabled = true;

                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                const imageFile = formData.get("imageFile");

                if (!data.password) delete data.password;

                try {
                    if (imageFile && imageFile.size > 0) {
                        data.Image = await uploadImage(imageFile);
                    }
                    delete data.imageFile;

                    const updateRes = await fetch(`/api/admin/users/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data)
                    });
                    
                    if (updateRes.ok) {
                        alert("Record synchronized!");
                        window.closeModal();
                        window.fetchAndRenderUsers();
                    } else {
                        const err = await updateRes.json();
                        alert("Sync Failure: " + err.error);
                    }
                } catch (err) {
                    console.error(err);
                    alert("Critical Error during sync.");
                } finally {
                    submitBtn.innerText = "Sync Database";
                    submitBtn.disabled = false;
                }
            });

        } catch (err) {
            console.error(err);
        }
    };

    window.closeModal = () => {
        modalContainer.classList.add("hidden");
        modalContainer.classList.remove("flex");
        modalContainer.innerHTML = "";
    };

    window.deleteUser = async (id) => {
        if (!confirm("Confirm Record Purge? This action is irreversible.")) return;
        
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("Record purged successfully.");
                fetchAndRenderUsers();
            } else {
                const err = await res.json();
                alert("Purge Failure: " + err.error);
            }
        } catch (err) {
            console.error(err);
            alert("Critical Error during purge.");
        }
    };

    /**
     * CERTIFICATE VIEWERS LOG
     */
    window.showCertificateViewers = async () => {
        const template = `
            <div class="flex flex-col gap-6 animate-in fade-in duration-500">
                <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Viewer Identity</th>
                                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hash/Serial Searched</th>
                                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody id="viewer-table-body">
                            <tr><td colspan="4" class="p-10 text-center text-slate-400 font-medium">Booting logs...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        render(template, "Verification Protocol Logs", "Monitoring third-party certificate validation attempts.");

        try {
            const res = await fetch("/api/admin/certificate-viewers");
            const logs = await res.json();
            const tbody = document.getElementById("viewer-table-body");

            if (logs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-20 text-center text-slate-400 font-medium">No verification telemetry recorded.</td></tr>`;
                return;
            }

            tbody.innerHTML = logs.map(log => `
                <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td class="px-8 py-6 font-black text-slate-800 uppercase text-xs">${log.name}</td>
                    <td class="px-8 py-6 font-bold text-slate-500 uppercase text-[10px] tracking-wider">${log.organization}</td>
                    <td class="px-8 py-6 font-black text-emerald-600 uppercase tracking-[0.2em] text-[11px]">${log.serial}</td>
                    <td class="px-8 py-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        ${new Date(log.date).toLocaleString('en-US', { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                        })}
                    </td>
                </tr>
            `).join('');

        } catch (err) {
            console.error(err);
            document.getElementById("viewer-table-body").innerHTML = `<tr><td colspan="4" class="p-10 text-center text-red-400">Telemetry failure.</td></tr>`;
        }
    }

    /**
     * LOGOUT SEQUENCE
     */
    window.handleLogout = async () => {
        if (!confirm("Initialize Logout Sequence?")) return;
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Protocol Violation: Logout Failed.");
        }
    };
     /**
     * COURSE MANAGEMENT VIEW
     */
    window.showCourses = async () => {
        const template = `
            <div class="flex flex-col gap-6 animate-in fade-in duration-500">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-slate-800 tracking-tight">Curriculum Categories</h3>
                    <button onclick="window.showCourseEditor()" class="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2 active:scale-[0.98]">
                        <i class="fa-solid fa-plus"></i>
                        <span>Create New Topic/Course</span>
                    </button>
                </div>

                <div id="course-list-sections" class="space-y-12">
                    <div class="p-10 text-center text-slate-400 font-medium">Loading courses...</div>
                </div>
            </div>
        `;

        render(template, "Course Management", "Organize curriculum by topics and specific courses.");

        try {
            const res = await fetch("/api/admin/courses");
            const courses = await res.json();
            const container = document.getElementById("course-list-sections");

            if (courses.length === 0) {
                container.innerHTML = `<div class="p-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                    <i class="fa-solid fa-book-open text-4xl text-slate-200 mb-4"></i>
                    <p class="text-slate-400 font-medium">No courses created yet.</p>
                </div>`;
                return;
            }

            // Group by Topic (Category)
            const grouped = courses.reduce((acc, c) => {
                const t = c.topic || "Uncategorized";
                if (!acc[t]) acc[t] = [];
                acc[t].push(c);
                return acc;
            }, {});

            container.innerHTML = Object.entries(grouped).map(([topic, items]) => `
                <div class="space-y-4">
                    <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">${topic}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${items.map(course => `
                            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                <div class="h-40 bg-slate-100 relative overflow-hidden">
                                    ${course.image ? `<img src="${course.image}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-slate-300 text-4xl"><i class="fa-solid fa-image"></i></div>`}
                                    <div class="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                                        Term: ${Array.isArray(course.type) ? course.type.join(', ') : course.type}
                                    </div>
                                </div>
                                <div class="p-5">
                                    <h4 class="font-bold text-slate-800 mb-1 uppercase tracking-tight line-clamp-1">${course.courseName || course.topic || 'Untitled Course'}</h4>
                                    <p class="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">${course.lessons?.length || 0} Lessons Block</p>
                                    
                                    <div class="flex gap-2">
                                        <button onclick="window.showCourseEditor('${course._id}')" class="flex-1 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all uppercase tracking-widest">
                                            Edit Content
                                        </button>
                                        <button onclick="window.deleteCourse('${course._id}')" class="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-all border border-red-100">
                                            <i class="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error(err);
            document.getElementById("course-list-sections").innerHTML = `<div class="p-10 text-center text-red-400">Failed to load courses.</div>`;
        }
    }

    /**
     * COURSE EDITOR MODAL
     */
    window.showCourseEditor = async (courseId = null) => {
        let courseData = {
            topic: "General",
            courseName: "",
            image: "",
            type: ["student"],
            language: "English",
            serial: 0,
            lessons: [{ class: [{ title: "" }], quiz: [] }]
        };

        let existingTopics = [];
        try {
            const res = await fetch("/api/admin/courses");
            const courses = await res.json();
            existingTopics = [...new Set(courses.map(c => c.topic))].filter(Boolean);
            if (courseId) {
                const found = courses.find(c => c._id === courseId);
                if (found) courseData = JSON.parse(JSON.stringify(found));
                
                // Normalize type to always be an array for easy checkbox handling
                if (courseData.type && !Array.isArray(courseData.type)) {
                    courseData.type = [courseData.type];
                } else if (!courseData.type) {
                    courseData.type = [];
                }
            }
        } catch (err) { console.error(err); }

        const renderEditor = () => {
            modalContainer.innerHTML = `
                <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
                    <!-- Header -->
                    <div class="px-8 py-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                        <div>
                            <h3 class="text-xl font-bold">${courseId ? 'Update Curriculum' : 'New Course Assembly'}</h3>
                            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">${courseId ? 'Editing Record' : 'Drafting Stage'}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <button id="save-course-btn" class="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                                ${courseId ? 'Sync Updates' : 'Publish Course'}
                            </button>
                            <button onclick="closeModal()" class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
                                <i class="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Scrollable Area -->
                    <div class="flex-1 overflow-y-auto p-8 bg-slate-50">
                        <div class="max-w-4xl mx-auto space-y-10">
                            
                            <!-- Topic (Category) & Title Section -->
                            <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                                <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
                                    <div class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center"><i class="fa-solid fa-folder-tree"></i></div>
                                    <h5 class="font-bold text-slate-800 uppercase tracking-wider text-sm text-[10px]">Classification</h5>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topic (Category)</label>
                                        <div class="relative">
                                            <input type="text" id="edit-topic" list="topics-list" value="${courseData.topic}" placeholder="Select or type category..." 
                                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 font-bold text-slate-800 focus:ring-2 ring-emerald-500/10 focus:border-emerald-500 transition-all">
                                            <datalist id="topics-list">
                                                ${existingTopics.map(t => `<option value="${t}">`).join('')}
                                            </datalist>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Name</label>
                                        <input type="text" id="edit-courseName" value="${courseData.courseName || ''}" placeholder="e.g. SCA Barista Skills Foundation" 
                                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 font-bold text-slate-800 focus:ring-2 ring-emerald-500/10 focus:border-emerald-500 transition-all">
                                    </div>
                                    <div class="space-y-3">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visibility Level (Select Multiple)</label>
                                        <div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                            ${['student', 'public', 'stuff', 'admin'].map(type => `
                                                <label class="flex items-center gap-3 cursor-pointer group">
                                                    <div class="relative flex items-center">
                                                        <input type="checkbox" name="visibility-type" value="${type}" 
                                                            ${courseData.type?.includes(type) ? 'checked' : ''}
                                                            class="w-5 h-5 rounded-lg text-emerald-500 focus:ring-emerald-500/20 border-slate-300 transition-all cursor-pointer">
                                                    </div>
                                                    <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                                                        ${type === 'stuff' ? 'Staff Access' : 
                                                          type === 'student' ? 'Students' : 
                                                          type === 'public' ? 'Public' : 'Admins Only'}
                                                    </span>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Language</label>
                                        <select id="edit-language" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 font-bold text-slate-800 focus:ring-2 ring-emerald-500/10 focus:border-emerald-500 transition-all">
                                            <option value="English" ${courseData.language === 'English' ? 'selected' : ''}>English</option>
                                            <option value="Bangla" ${courseData.language === 'Bangla' ? 'selected' : ''}>Bangla</option>
                                        </select>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Serial Number (Sort Order)</label>
                                        <input type="number" id="edit-serial" value="${courseData.serial || 0}" placeholder="e.g. 1" 
                                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 font-bold text-slate-800 focus:ring-2 ring-emerald-500/10 focus:border-emerald-500 transition-all">
                                    </div>
                                    <div class="md:col-span-1 space-y-2">
                                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cover Branding</label>
                                        <div class="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            <div id="cover-preview" class="w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                ${courseData.image ? `<img src="${courseData.image}" class="w-full h-full object-cover">` : `<i class="fa-solid fa-image text-slate-200 text-sm"></i>`}
                                            </div>
                                            <input type="file" id="edit-cover-file" accept="image/*" class="text-xs font-bold text-slate-500">
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Curriculum Design Area -->
                            <div class="space-y-6">
                                <div class="flex justify-between items-center border-b border-slate-200 pb-4">
                                    <h5 class="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
                                        <span class="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">03</span>
                                        Instructional Architecture
                                    </h5>
                                    <button onclick="addLesson()" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                                        Add Content Block
                                    </button>
                                </div>

                                <div id="lessons-container" class="space-y-8">
                                    ${courseData.lessons.map((lesson, lIdx) => `
                                        <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:border-emerald-200 transition-all">
                                            <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-6 h-6 rounded bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">${lIdx + 1}</div>
                                                    <span class="text-[10px] font-black tracking-widest text-slate-400 uppercase">Lesson Partition</span>
                                                </div>
                                                <button onclick="removeLesson(${lIdx})" class="text-slate-300 hover:text-red-500 transition-colors">
                                                    <i class="fa-solid fa-trash-can text-sm"></i>
                                                </button>
                                            </div>
                                            
                                            <div class="p-6 space-y-8">
                                                <!-- Classes Section -->
                                                <div class="space-y-4">
                                                    <div class="flex justify-between items-center">
                                                        <h6 class="text-[10px] font-black text-slate-800 uppercase tracking-widest">Modules / Classes</h6>
                                                        <button onclick="addClassToLesson(${lIdx})" class="text-[9px] font-black text-emerald-600 uppercase tracking-[0.1em] hover:text-emerald-700">Add Module</button>
                                                    </div>
                                                    <div class="space-y-4">
                                                        ${lesson.class.map((cls, cIdx) => `
                                                            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 relative group/class">
                                                                <div class="flex justify-between items-start">
                                                                    <div class="flex-1">
                                                                        <input type="text" placeholder="Module Title..." value="${cls.title || ''}"
                                                                            onchange="updateClassTitle(${lIdx}, ${cIdx}, this.value)"
                                                                            class="w-full bg-transparent border-none p-0 text-md font-black text-slate-800 focus:ring-0 placeholder:text-slate-300">
                                                                    </div>
                                                                    <button onclick="removeClassFromLesson(${lIdx}, ${cIdx})" class="text-slate-200 group-hover/class:text-red-300 hover:!text-red-500 transition-all ml-2">
                                                                        <i class="fa-solid fa-rectangle-xmark text-lg"></i>
                                                                    </button>
                                                                </div>

                                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div class="space-y-2">
                                                                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">YouTube Stream</label>
                                                                        <input type="text" placeholder="Video ID or URL" value="${cls.video || ''}"
                                                                            onchange="updateClassProp(${lIdx}, ${cIdx}, 'video', this.value)"
                                                                            class="w-full text-[11px] font-bold p-2.5 bg-white border border-slate-200 rounded-lg">
                                                                    </div>
                                                                    <div class="space-y-2">
                                                                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">SoundCloud Stream</label>
                                                                        <input type="text" placeholder="Track Link..." value="${cls.audio || ''}"
                                                                            onchange="updateClassProp(${lIdx}, ${cIdx}, 'audio', this.value)"
                                                                            class="w-full text-[11px] font-bold p-2.5 bg-white border border-slate-200 rounded-lg">
                                                                    </div>
                                                                    <div class="md:col-span-2 space-y-2">
                                                                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Detailed Methodology</label>
                                                                        <textarea placeholder="Instructional steps..." onchange="updateClassProp(${lIdx}, ${cIdx}, 'text1', this.value)"
                                                                            class="w-full text-[11px] font-medium p-3 bg-white border border-slate-200 rounded-lg h-24 leading-relaxed">${cls.text1 || ''}</textarea>
                                                                    </div>
                                                                    
                                                                    <div class="md:col-span-2 flex flex-wrap gap-2 items-center">
                                                                        <span class="text-[9px] font-black text-slate-400 uppercase mr-2">Media Assets:</span>
                                                                        ${[1, 2, 3, 4].map(idx => {
                                                                            const imgProp = 'image' + (idx === 1 ? '' : idx);
                                                                            const isSet = !!cls[imgProp];
                                                                            return `
                                                                            <div class="relative group/media">
                                                                                <div class="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center text-slate-200 relative">
                                                                                    ${isSet ? `<img src="${cls[imgProp]}" class="w-full h-full object-cover">` : `<i class="fa-solid fa-images text-[10px]"></i>`}
                                                                                </div>
                                                                                <input type="file" accept="image/*" onchange="uploadClassMedia(${lIdx}, ${cIdx}, '${imgProp}', this.files[0])"
                                                                                    title="${isSet ? 'Change Image' : 'Upload Image'}"
                                                                                    class="absolute inset-0 opacity-0 cursor-pointer z-0">
                                                                                ${isSet ? `
                                                                                    <button type="button" onclick="removeClassMedia(${lIdx}, ${cIdx}, '${imgProp}')" title="Remove Image" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 shadow-sm text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover/media:opacity-100 transition-all z-10 cursor-pointer">
                                                                                        <i class="fa-solid fa-xmark"></i>
                                                                                    </button>
                                                                                ` : ''}
                                                                            </div>
                                                                            `;
                                                                        }).join('')}
                                                                        <div class="relative group/media ml-auto">
                                                                            <div class="h-10 px-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-[10px] font-black ${cls.pdf ? 'text-emerald-500' : 'text-slate-300'} relative">
                                                                                <i class="fa-solid fa-file-pdf"></i> PDF UNIT
                                                                            </div>
                                                                            <input type="file" accept=".pdf" onchange="uploadClassMedia(${lIdx}, ${cIdx}, 'pdf', this.files[0])"
                                                                                title="${cls.pdf ? 'Change PDF' : 'Upload PDF'}"
                                                                                class="absolute inset-0 opacity-0 cursor-pointer z-0">
                                                                            ${cls.pdf ? `
                                                                                <button type="button" onclick="removeClassMedia(${lIdx}, ${cIdx}, 'pdf')" title="Remove PDF" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 shadow-sm text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover/media:opacity-100 transition-all z-10 cursor-pointer">
                                                                                    <i class="fa-solid fa-xmark"></i>
                                                                                </button>
                                                                            ` : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                </div>

                                                <!-- Quizzes Section -->
                                                <div class="bg-amber-50/20 p-6 rounded-3xl border border-amber-100/30 space-y-4">
                                                    <div class="flex justify-between items-center">
                                                        <h6 class="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                                                            <div class="w-5 h-5 bg-amber-500 text-white rounded flex items-center justify-center"><i class="fa-solid fa-bolt text-[8px]"></i></div>
                                                            Knowledge Validation
                                                        </h6>
                                                        <button onclick="addQuizToLesson(${lIdx})" class="text-[9px] font-black text-amber-600 uppercase tracking-widest">Assign Question</button>
                                                    </div>
                                                    <div class="space-y-4">
                                                        ${lesson.quiz.map((qz, qIdx) => `
                                                            <div class="bg-white p-5 rounded-2xl border border-amber-100/50 shadow-sm relative group/quiz">
                                                                <div class="flex justify-between items-start mb-4">
                                                                    <div class="flex-1 space-y-1">
                                                                        <span class="text-[8px] font-black uppercase text-amber-500 tracking-[0.2em]">Validated Q.${qIdx + 1}</span>
                                                                        <input type="text" placeholder="Formulate question..." value="${qz.question || ''}"
                                                                            onchange="updateQuizProp(${lIdx}, ${qIdx}, 'question', this.value)"
                                                                            class="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:ring-0">
                                                                    </div>
                                                                    <button onclick="removeQuizFromLesson(${lIdx}, ${qIdx})" class="text-slate-200 group-hover/quiz:text-amber-200 hover:!text-red-400 transition-all ml-2">
                                                                        <i class="fa-solid fa-trash-can text-xs"></i>
                                                                    </button>
                                                                </div>
                                                                
                                                                <div class="grid grid-cols-2 gap-3 mb-4">
                                                                    ${[0, 1, 2, 3].map(optIdx => `
                                                                        <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                                            <label class="relative flex items-center cursor-pointer">
                                                                                <input type="checkbox" ${qz.options[optIdx]?.correct ? 'checked' : ''} 
                                                                                    onchange="updateQuizOption(${lIdx}, ${qIdx}, ${optIdx}, 'correct', this.checked)"
                                                                                    class="w-4 h-4 rounded-full text-emerald-500 focus:ring-emerald-500 border-slate-300">
                                                                            </label>
                                                                            <input type="text" placeholder="Option..." value="${qz.options[optIdx]?.option || ''}"
                                                                                onchange="updateQuizOption(${lIdx}, ${qIdx}, ${optIdx}, 'option', this.value)"
                                                                                class="flex-1 bg-transparent border-none p-0 text-[10px] font-black text-slate-700 focus:ring-0">
                                                                        </div>
                                                                    `).join('')}
                                                                </div>

                                                                <div class="space-y-2">
                                                                    <label class="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1">Logic/Explanation</label>
                                                                    <textarea placeholder="Reasoning..." onchange="updateQuizProp(${lIdx}, ${qIdx}, 'explanation', this.value)"
                                                                        class="w-full text-[10px] font-medium p-3 bg-slate-50 border border-slate-100 rounded-xl h-16 resize-none focus:bg-white transition-all">${qz.explanation || ''}</textarea>
                                                                </div>
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            `;

            // Wait for DOM to attach events
            setTimeout(() => {
                document.getElementById("save-course-btn").addEventListener("click", async (e) => {
                    const btn = e.target;
                    const originalText = btn.innerText;
                    btn.innerText = "Processing Pipeline...";
                    btn.disabled = true;

                    try {
                        // Data from DOM
                        courseData.topic = document.getElementById("edit-topic").value || "General";
                        courseData.courseName = document.getElementById("edit-courseName").value || "Untitled Course";
                        
                        // Collect all checked visibility levels
                        const checkedTypes = Array.from(document.querySelectorAll('input[name="visibility-type"]:checked'))
                            .map(cb => cb.value);
                        courseData.type = checkedTypes;

                        courseData.language = document.getElementById("edit-language").value;
                        courseData.serial = parseInt(document.getElementById("edit-serial").value) || 0;
                        
                        // Cover Upload
                        const coverFile = document.getElementById("edit-cover-file").files[0];
                        if (coverFile) {
                            btn.innerText = "Branding Assets...";
                            courseData.image = await uploadImage(coverFile);
                        }

                        // API Update
                        const method = courseId ? "PUT" : "POST";
                        const url = courseId ? `/api/admin/courses/${courseId}` : "/api/admin/courses";
                        
                        const res = await fetch(url, {
                            method,
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(courseData)
                        });

                        if (res.ok) {
                            alert("Academy structure updated!");
                            window.closeModal();
                            window.showCourses();
                        } else {
                            const err = await res.json();
                            alert("Sync Error: " + err.error);
                        }
                    } catch (err) {
                        alert("Critical Failure: " + err.message);
                    } finally {
                        btn.innerText = originalText;
                        btn.disabled = false;
                    }
                });
            }, 0);
        };

        // Internal Helpers for dynamic rendering
        window.addLesson = () => { courseData.lessons.push({ class: [{ title: "" }], quiz: [] }); renderEditor(); };
        window.removeLesson = (idx) => { courseData.lessons.splice(idx, 1); renderEditor(); };
        window.addClassToLesson = (lIdx) => { courseData.lessons[lIdx].class.push({ title: "" }); renderEditor(); };
        window.removeClassFromLesson = (lIdx, cIdx) => { courseData.lessons[lIdx].class.splice(cIdx, 1); renderEditor(); };
        window.updateClassTitle = (lIdx, cIdx, val) => { courseData.lessons[lIdx].class[cIdx].title = val; };
        window.updateClassProp = (lIdx, cIdx, prop, val) => { courseData.lessons[lIdx].class[cIdx][prop] = val; };
        
        window.uploadClassMedia = async (lIdx, cIdx, prop, file) => {
            if (!file) return;
            try {
                const url = await uploadImage(file);
                courseData.lessons[lIdx].class[cIdx][prop] = url;
                renderEditor();
            } catch (err) { alert("Media sync failed"); }
        };

        window.removeClassMedia = (lIdx, cIdx, prop) => {
            courseData.lessons[lIdx].class[cIdx][prop] = "";
            renderEditor();
        };

        window.addQuizToLesson = (lIdx) => {
            courseData.lessons[lIdx].quiz.push({
                question: "",
                options: [{ option: "", correct: false }, { option: "", correct: false }, { option: "", correct: false }, { option: "", correct: false }],
                explanation: ""
            });
            renderEditor();
        };
        window.removeQuizFromLesson = (lIdx, qIdx) => { courseData.lessons[lIdx].quiz.splice(qIdx, 1); renderEditor(); };
        window.updateQuizProp = (lIdx, qIdx, prop, val) => { courseData.lessons[lIdx].quiz[qIdx][prop] = val; };
        window.updateQuizOption = (lIdx, qIdx, optIdx, prop, val) => { courseData.lessons[lIdx].quiz[qIdx].options[optIdx][prop] = val; };

        renderEditor();
        modalContainer.classList.remove("hidden");
        modalContainer.classList.add("flex");
    };

    window.deleteCourse = async (id) => {
        if (!confirm("Permanently scrap this course track?")) return;
        try {
            const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
            if (res.ok) window.showCourses();
        } catch (err) { console.error(err); }
    };

    // Initialize Auth on load
    await initAuth();
});
