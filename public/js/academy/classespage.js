console.log("classespage.js initialized");

/**
 * ACADEMY CORE LOGIC - PROGRESS SYNCING
 */
(function () {
    const translations = {
        English: {
            yourProgress: "Your Progress",
            saveProgress: "Save your progress!",
            loginNote: "You have not logged in yet. Please login to get your exciting certificate.",
            login: "Login",
            register: "Register",
            greatJob: "Great job",
            createAccount: "Create an account to save your progress and earn rewards.",
            online: "Online",
            settings: "Settings",
            profile: "Profile",
            logout: "Logout",
            streak: "Streak",
            gems: "Gems",
            errorLoad: "Could not load courses at this time.",
            noCourses: "No academic courses available yet."
        },
        Bangla: {
            yourProgress: "আপনার অগ্রগতি",
            saveProgress: "আপনার অগ্রগতি সংরক্ষণ করুন!",
            loginNote: "আপনি এখনো লগইন করেননি। শংসাপত্র পেতে দয়া করে লগইন করুন।",
            login: "লগইন",
            register: "রেজিস্ট্রেশন",
            greatJob: "দারুণ কাজ",
            createAccount: "আপনার অগ্রগতি সংরক্ষণ করতে এবং পুরস্কার পেতে একটি অ্যাকাউন্ট তৈরি করুন।",
            online: "অনলাইন",
            settings: "সেটিংস",
            profile: "প্রোফাইল",
            logout: "লগআউট",
            streak: "স্ট্রিক",
            gems: "জেমস",
            errorLoad: "এই মুহূর্তে কোর্স লোড করা যাচ্ছে না।",
            noCourses: "এখনো কোনো কোর্স পাওয়া যায়নি।"
        }
    };

    function t(key) {
        const lang = localStorage.getItem("lang") || "English";
        return translations[lang][key] || key;
    }

    // Generate or retrieve a unique ID for guests
    let guestId = localStorage.getItem("GUEST_ID");
    if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem("GUEST_ID", guestId);
    }

    // Default local state
    if (!localStorage.getItem("USER")) localStorage.setItem("USER", "guest");
    if (!localStorage.getItem("POGRESS")) localStorage.setItem("POGRESS", "0");
    if (!localStorage.getItem("VISITED")) localStorage.setItem("VISITED", "0");

    async function syncAcademyData() {
        console.log("Starting syncAcademyData...");
        try {
            // 1. Check if user is logged in
            const authRes = await fetch("/api/academy/user-data");
            console.log("User data response status:", authRes.status);

            if (authRes.ok) {
                const userData = await authRes.json();
                console.log("Sync complete for user:", userData.name);

                localStorage.setItem("USER", userData.name);
                localStorage.setItem("POGRESS", userData.progress);
                localStorage.setItem("IS_LOGGED_IN", "true");
                localStorage.setItem("COMPLETED_ITEMS", JSON.stringify(userData.completedItems || []));

                renderUI(userData.name, userData.progress, true, userData.Image);
            } else {
                console.log("User not logged in, syncing guest...");
                const guestData = {
                    guestId: localStorage.getItem("GUEST_ID"),
                    name: localStorage.getItem("USER") || "guest",
                    progress: parseInt(localStorage.getItem("POGRESS")) || 0,
                    visited: parseInt(localStorage.getItem("VISITED")) || 0,
                    completedItems: JSON.parse(localStorage.getItem("COMPLETED_ITEMS") || "[]")
                };

                const syncRes = await fetch("/api/academy/guest-sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(guestData)
                });

                if (syncRes.ok) {
                    const result = await syncRes.json();
                    const serverGuest = result.data;
                    console.log("Guest sync complete:", serverGuest.name);

                    localStorage.setItem("USER", serverGuest.name);
                    localStorage.setItem("POGRESS", serverGuest.progress);
                    localStorage.setItem("IS_LOGGED_IN", "false");
                    localStorage.setItem("COMPLETED_ITEMS", JSON.stringify(serverGuest.completedItems || []));

                    renderUI(serverGuest.name, serverGuest.progress, false);
                } else {
                    console.warn("Guest sync failed on server");
                    renderUI(localStorage.getItem("USER"), localStorage.getItem("POGRESS"), false);
                }
            }
        } catch (err) {
            console.error("Critical Sync error:", err);
            renderUI(localStorage.getItem("USER"), localStorage.getItem("POGRESS"), false);
        }
    }

    function renderUI(name, progress, isLoggedIn, profileImg = null) {
        console.log("Rendering UI for:", name);
        const loginSection = document.getElementById("loginSection");
        if (!loginSection) {
            console.warn("loginSection element not found");
            return;
        }

        const progressPercent = parseInt(progress) || 0;
        const currentLang = localStorage.getItem("lang") || "English";

        // Update static head title
        const progressTitle = document.querySelector('#pogressSection h3');
        if (progressTitle) progressTitle.innerText = t('yourProgress');

        if (!isLoggedIn) {
            if (progressPercent === 0) {
                loginSection.innerHTML = `
                    <div class="bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
                        <div class="w-20 h-20 bg-blue-100 text-[#1cb0f6] rounded-full flex items-center justify-center text-4xl mb-2">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">${t('saveProgress')}</h2>
                        <p class="text-gray-500 font-medium mb-4 text-base">${t('loginNote')}</p>
                        <button onclick="window.location.href='/login.html'" class="w-full bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#58a700] active:border-b-0 active:translate-y-1 text-white font-bold py-3.5 px-6 rounded-2xl uppercase tracking-widest transition-all">
                            ${t('login')}
                        </button>
                        <button onclick="window.location.href='/register.html'" class="w-full bg-white text-[#1cb0f6] border-2 border-gray-200 border-b-4 hover:bg-gray-50 active:border-b-0 active:translate-y-1 font-bold py-3.5 px-6 rounded-2xl uppercase tracking-widest transition-all mt-1">
                            ${t('register')}
                        </button>
                    </div>
                `;
            } else {
                loginSection.innerHTML = `
                    <div class="bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col items-center text-center gap-4 shadow-sm">
                        <div class="w-20 h-20 bg-[#ffc800]/20 text-[#ffc800] rounded-full flex items-center justify-center text-4xl mb-2">
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">${t('greatJob')}, ${name}!</h2>
                        <p class="text-gray-500 font-medium mb-4 text-base">${t('createAccount').replace('progress', progressPercent + '% progress')}</p>
                        <button onclick="window.location.href='/register.html'" class="w-full bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#58a700] active:border-b-0 active:translate-y-1 text-white font-bold py-3.5 px-6 rounded-2xl uppercase tracking-widest transition-all">
                            ${t('register')}
                        </button>
                        <button onclick="window.location.href='/login.html'" class="w-full bg-white text-[#1cb0f6] border-2 border-gray-200 border-b-4 hover:bg-gray-50 active:border-b-0 active:translate-y-1 font-bold py-3.5 px-6 rounded-2xl uppercase tracking-widest transition-all mt-1">
                            ${t('login')}
                        </button>
                    </div>
                `;
            }
        } else {
            loginSection.innerHTML = `
                <div class="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-sm">
                    <div class="flex items-center justify-between mb-2 gap-4">
                        <div class="flex items-center gap-4">
                            <div class="relative w-16 h-16 shrink-0">
                                <div class="w-full h-full bg-[#58cc02] rounded-full border-2 border-white shadow-[0_0_0_2px_#58cc02] overflow-hidden flex items-center justify-center">
                                    ${profileImg ? `<img src="${profileImg}" class="w-full h-full object-cover">` : `<i class="fa-solid fa-user text-white text-3xl mt-2"></i>`}
                                </div>
                                <div class="absolute -bottom-1 -right-1 bg-blue-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                                    <i class="fa-solid fa-check"></i>
                                </div>
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <h2 class="font-bold text-gray-800 text-xl leading-tight truncate">${name}</h2>
                                <p class="text-[#58cc02] text-sm font-bold uppercase tracking-wide mt-1">${t('online')}</p>
                            </div>
                        </div>
                        
                        <div class="relative group shrink-0">
                            <button class="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors border-2 border-transparent">
                                <i class="fa-solid fa-gear text-xl"></i>
                            </button>
                            <select onchange="handleUserAction(this.value)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                                <option value="" disabled selected>${t('settings')}</option>
                                <option value="profile">${t('profile')}</option>
                                <option value="logout">${t('logout')}</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-5 pt-5 border-t-2 border-gray-100 grid grid-cols-2 gap-3">
                        <div class="bg-gray-50 rounded-2xl p-3 flex gap-3 items-center border-2 border-gray-100">
                            <i class="fa-solid fa-fire text-[#ff9600] text-3xl"></i>
                            <div class="flex flex-col">
                                <span class="text-gray-800 font-bold text-lg leading-tight">1</span>
                                <span class="text-xs text-gray-500 font-bold uppercase">${t('streak')}</span>
                            </div>
                        </div>
                        <div class="bg-gray-50 rounded-2xl p-3 flex gap-3 items-center border-2 border-gray-100">
                            <i class="fa-solid fa-gem text-[#1cb0f6] text-3xl"></i>
                            <div class="flex flex-col">
                                <span class="text-gray-800 font-bold text-lg leading-tight">${progressPercent * 2}</span>
                                <span class="text-xs text-gray-500 font-bold uppercase">${t('gems')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        updateProgressBar(progressPercent);
    }

    function updateProgressBar(progress) {
        const bar = document.getElementById("pogressBar");
        const val = document.getElementById("pogressValue");
        const progressPercent = Math.min(parseInt(progress) || 0, 100);
        if (bar) bar.style.width = progressPercent + "%";
        if (val) val.innerText = progressPercent;
    }

    // Language Management
    window.setLanguage = (lang) => {
        // Normalize lang to match Database values
        const dbLang = lang === 'en' || lang === 'English' ? 'English' : 'Bangla';
        localStorage.setItem("lang", dbLang);
        updateLangButtons(dbLang);
        
        // Full refresh to update all translations and courses
        syncAcademyData().finally(() => {
            fetchCourses();
        });
    };

    function updateLangButtons(activeLang) {
        const btnEn = document.getElementById("btn-en");
        const btnBn = document.getElementById("btn-bn");
        
        if (btnEn && btnBn) {
            if (activeLang === 'English') {
                btnEn.className = "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-emerald-600 shadow-sm transition-all";
                btnBn.className = "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all";
            } else {
                btnBn.className = "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-emerald-600 shadow-sm transition-all";
                btnEn.className = "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all";
            }
        }
    }

    // Initialize sync
    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM Loaded, starting initialization...");
        
        // Initial Language Setup
        const savedLang = localStorage.getItem("lang") || "English";
        const dbLang = savedLang === 'bn' || savedLang === 'Bangla' ? 'Bangla' : 'English';
        localStorage.setItem("lang", dbLang);
        updateLangButtons(dbLang);

        syncAcademyData().finally(() => {
            fetchCourses();
        });
    });

    // Global action handler
    window.handleUserAction = (value) => {
        if (value === 'logout') {
            fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
                localStorage.removeItem("IS_LOGGED_IN");
                localStorage.removeItem("COMPLETED_ITEMS");
                window.location.reload();
            });
        }
    };

    /**
     * FETCH & RENDER COURSES (Duolingo Style Path)
     */
    async function fetchCourses() {
        console.log("fetchCourses started...");
        const currentLang = localStorage.getItem("lang") || "English";
        try {
            const res = await fetch(`/api/academy/courses?lang=${currentLang}`);
            console.log("Courses response status:", res.status);
            if (!res.ok) throw new Error("Failed to fetch courses");
            const courses = await res.json();
            console.log("Fetched courses count:", courses.length);

            // Use completedItems from localStorage (filled by syncAcademyData)
            const completedItems = JSON.parse(localStorage.getItem("COMPLETED_ITEMS") || "[]");
            console.log("Using completedItems:", completedItems.length);

            renderCoursesPath(courses, completedItems);
        } catch (err) {
            console.error("Error fetching courses:", err);
            const container = document.getElementById("coursesPathContainer");
            if (container) {
                container.innerHTML = `<p class="text-gray-500 text-center py-4">${t('errorLoad')}</p>`;
            }
        }
    }

    function renderCoursesPath(courses, completedItems) {
        console.log("renderCoursesPath mapping...");
        const container = document.getElementById("coursesPathContainer");
        if (!container) {
            console.warn("coursesPathContainer not found");
            return;
        }

        if (!courses || courses.length === 0) {
            console.log("No courses found in array");
            container.innerHTML = `<p class="text-gray-500 text-center py-4">${t('noCourses')}</p>`;
            return;
        }

        let totalItemsCount = 0;
        let doneItemsCount = 0;
        let htmlContent = '';
        let firstUnfinishedNodeId = null;

        const baseColors = [
            { bg: 'bg-[#58cc02]', border: 'border-[#58a700]' }, 
            { bg: 'bg-[#ce82ff]', border: 'border-[#a552e6]' }, 
            { bg: 'bg-[#1cb0f6]', border: 'border-[#1899d6]' }, 
            { bg: 'bg-[#ffc800]', border: 'border-[#e5b400]' }, 
        ];

        const groupedByTopic = {};
        courses.forEach(course => {
            const topic = course.topic || "General";
            if (!groupedByTopic[topic]) groupedByTopic[topic] = [];
            groupedByTopic[topic].push(course);
        });

        Object.keys(groupedByTopic).forEach((topic) => {
            const topicCourses = groupedByTopic[topic];
            
            htmlContent += `
                <div class="w-full flex items-center justify-between mb-8 mt-6">
                    <div class="h-[2px] bg-gray-200 flex-1"></div>
                    <span class="px-4 text-gray-400 font-bold uppercase tracking-wider text-sm text-center">
                        ${topic}
                    </span>
                    <div class="h-[2px] bg-gray-200 flex-1"></div>
                </div>
            `;

            let nodeCounter = 0;
            const horizontalOffsets = [
                'translate-x-0', '-translate-x-6', '-translate-x-10', '-translate-x-6', 
                'translate-x-0', 'translate-x-6', 'translate-x-10', 'translate-x-6'
            ];

            topicCourses.forEach(course => {
                if (course.lessons && course.lessons.length > 0) {
                    course.lessons.forEach((lesson, lessonIndex) => {
                        totalItemsCount += (lesson.class ? lesson.class.length : 0) + (lesson.quiz && lesson.quiz.length > 0 ? 1 : 0);

                        if (lesson.class && lesson.class.length > 0) {
                            lesson.class.forEach((cls, clsIndex) => {
                                const nodeId = `${course._id}_${lessonIndex}_class_${clsIndex}`;
                                const isDone = completedItems.includes(nodeId);
                                if (isDone) doneItemsCount++;
                                if (!isDone && !firstUnfinishedNodeId) firstUnfinishedNodeId = `node-${nodeId}`;

                                const offset = horizontalOffsets[nodeCounter % horizontalOffsets.length];
                                const baseColor = baseColors[nodeCounter % baseColors.length];
                                const activeColor = isDone ? { bg: 'bg-[#58cc02]', border: 'border-[#58a700]' } : baseColor;

                                htmlContent += `
                                <div id="node-${nodeId}" class="relative w-full flex justify-center mb-6">
                                    <button onclick="window.location.href='/lesson.html?course=${course._id}&lesson=${lessonIndex}&class=${clsIndex}'" 
                                        class="relative w-24 h-24 rounded-full ${activeColor.bg} border-b-8 ${activeColor.border} flex items-center justify-center transition-all active:border-b-0 active:translate-y-2 ${offset} z-10 hover:-translate-y-1">
                                        <i class="fa-solid ${isDone ? 'fa-check' : 'fa-star'} text-white text-4xl"></i>
                                    </button>
                                </div>
                                `;
                                nodeCounter++;
                            });
                        }

                        if (lesson.quiz && lesson.quiz.length > 0) {
                            const nodeId = `${course._id}_${lessonIndex}_quiz`;
                            const isDone = completedItems.includes(nodeId);
                            if (isDone) doneItemsCount++;
                            if (!isDone && !firstUnfinishedNodeId) firstUnfinishedNodeId = `node-${nodeId}`;

                            const offset = horizontalOffsets[nodeCounter % horizontalOffsets.length];
                            
                            htmlContent += `
                            <div id="node-${nodeId}" class="relative w-full flex justify-center mb-6">
                                <button onclick="window.location.href='/quiz.html?course=${course._id}&lesson=${lessonIndex}'" 
                                    class="relative w-28 h-28 rounded-xl ${isDone ? 'bg-[#58cc02] border-[#58a700]' : 'bg-gray-200 border-gray-300'} border-b-8 flex items-center justify-center transition-all active:border-b-0 active:translate-y-2 ${offset} z-10 hover:-translate-y-1 overflow-hidden group">
                                    <div class="w-full h-full bg-[#ffc800] absolute -bottom-full group-hover:bottom-0 transition-all duration-300"></div>
                                    <i class="fa-solid fa-box-open ${isDone ? 'text-white' : 'text-gray-400'} group-hover:text-white text-5xl relative z-10 transition-colors"></i>
                                </button>
                            </div>
                            `;
                            nodeCounter++;
                        }
                    });
                }
            });
        });

        container.innerHTML = htmlContent;
        console.log("Render complete. Progress:", doneItemsCount, "/", totalItemsCount);

        const progressPercent = totalItemsCount > 0 ? (doneItemsCount / totalItemsCount) * 100 : 0;
        updateProgressBar(progressPercent);
        
        if (firstUnfinishedNodeId) {
            const el = document.getElementById(firstUnfinishedNodeId);
            if (el) {
                console.log("Scrolling to:", firstUnfinishedNodeId);
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
            }
        }
    }

})();
