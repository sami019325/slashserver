(function () {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("course");
    const lessonIdx = parseInt(params.get("lesson") || "0");
    const classIdx = parseInt(params.get("class") || "0");

    const loadingEl = document.getElementById("contentLoading");
    const contentEl = document.getElementById("lessonContent");
    const titleEl = document.getElementById("lessonTitle");
    const mediaEl = document.getElementById("mediaContainer");
    const textEl = document.getElementById("textContainer");
    const audioEl = document.getElementById("audioContainer");
    const progressBar = document.getElementById("lessonProgress");
    const btnContinue = document.getElementById("btnContinue");

    let currentCourse = null;

    async function init() {
        if (!courseId) {
            alert("No course selected.");
            window.location.href = "/classes.html";
            return;
        }

        try {
            const res = await fetch(`/api/academy/courses/${courseId}`);
            if (!res.ok) throw new Error("Course not found");
            currentCourse = await res.json();
            renderContent();
        } catch (err) {
            console.error(err);
            loadingEl.innerHTML = `<p class="text-red-500 font-bold">Error loading lesson. Please try again.</p>`;
        }
    }

    function renderContent() {
        const lesson = currentCourse.lessons[lessonIdx];
        if (!lesson || !lesson.class[classIdx]) {
            window.location.href = "/classes.html";
            return;
        }

        const data = lesson.class[classIdx];

        // 1. Title
        titleEl.innerText = data.title || "Lesson Content";

        // 2. Clear previous
        mediaEl.innerHTML = "";
        textEl.innerHTML = "";
        audioEl.innerHTML = "";

        // 3. Media (Video/Images)
        if (data.video) {
            const videoId = data.video.includes("v=") ? data.video.split("v=")[1].split("&")[0] : null;
            if (videoId) {
                mediaEl.innerHTML += `
                    <div class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                `;
            } else {
                mediaEl.innerHTML += `
                    <video controls src="${data.video}" class="w-full rounded-2xl shadow-lg border-2 border-gray-100 bg-black"></video>
                `;
            }
        }

        // Add up to 4 images
        [data.image, data.image2, data.image3, data.image4].forEach(img => {
            if (img) {
                mediaEl.innerHTML += `
                    <div class="w-full">
                        <img src="${img}" class="w-full h-auto object-cover rounded-2xl shadow-sm border-2 border-gray-50" alt="Lesson Visual">
                    </div>
                `;
            }
        });

        // 4. Texts
        [data.text1, data.text2, data.text3, data.text4, data.text5].forEach(txt => {
            if (txt) {
                textEl.innerHTML += `<p class="text-gray-600 text-lg leading-relaxed">${txt}</p>`;
            }
        });

        // 5. Audio
        [data.audio, data.audio2, data.audio3, data.audio4].forEach((aud, idx) => {
            if (aud) {
                audioEl.innerHTML += `
                    <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                        <div class="w-10 h-10 bg-[#1cb0f6] text-white rounded-xl flex items-center justify-center">
                            <i class="fa-solid fa-volume-high"></i>
                        </div>
                        <audio controls src="${aud}" class="flex-1 h-10"></audio>
                    </div>
                `;
            }
        });

        // 6. Update progress bar (%)
        const totalClassesInLesson = lesson.class.length;
        const totalSteps = totalClassesInLesson + (lesson.quiz?.length ? 1 : 0);
        const progressPercent = ((classIdx + 1) / totalSteps) * 100;
        progressBar.style.width = progressPercent + "%";

        // Show content
        loadingEl.classList.add("hidden");
        contentEl.classList.remove("hidden");
        contentEl.classList.add("flex"); // Ensure flex is added back
        setTimeout(() => contentEl.classList.add("opacity-100"), 50);
    }

    async function recordCompletion() {
        const nodeId = `${courseId}_${lessonIdx}_class_${classIdx}`;
        let completedItems = JSON.parse(localStorage.getItem("COMPLETED_ITEMS") || "[]");
        
        if (!completedItems.includes(nodeId)) {
            completedItems.push(nodeId);
            localStorage.setItem("COMPLETED_ITEMS", JSON.stringify(completedItems));
            
            try {
                const isLoggedIn = localStorage.getItem("IS_LOGGED_IN") === "true";
                const endpoint = isLoggedIn ? "/api/academy/update-progress" : "/api/academy/guest-sync";
                const body = isLoggedIn 
                    ? { completedItems } 
                    : { guestId: localStorage.getItem("GUEST_ID"), completedItems };

                await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
            } catch (err) {
                console.warn("Completion sync failed", err);
            }
        }
    }

    btnContinue.onclick = async () => {
        const lesson = currentCourse.lessons[lessonIdx];
        
        // Mark current class as done
        await recordCompletion();

        // Go to next class if available
        if (lesson.class[classIdx + 1]) {
            window.location.href = `/lesson.html?course=${courseId}&lesson=${lessonIdx}&class=${classIdx + 1}`;
        } 
        // Else go to quiz if available
        else if (lesson.quiz && lesson.quiz.length > 0) {
            window.location.href = `/quiz.html?course=${courseId}&lesson=${lessonIdx}`;
        }
        // Else back to classes path
        else {
            window.location.href = "/classes.html";
        }
    };

    init();
})();
