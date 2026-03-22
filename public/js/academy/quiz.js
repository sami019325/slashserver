(function () {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("course");
    const lessonIdx = parseInt(params.get("lesson") || "0");

    const loadingEl = document.getElementById("contentLoading");
    const quizContent = document.getElementById("quizContent");
    const questionText = document.getElementById("questionText");
    const questionMedia = document.getElementById("questionMedia");
    const optionsContainer = document.getElementById("optionsContainer");
    const progressBar = document.getElementById("quizProgress");
    const btnCheck = document.getElementById("btnCheck");
    const feedbackBar = document.getElementById("feedbackBar");
    const feedbackIcon = document.getElementById("feedbackIcon");
    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackExplanation = document.getElementById("feedbackExplanation");
    const btnContinue = document.getElementById("btnContinue");

    let currentCourse = null;
    let quizQuestions = [];
    let currentQuestionIdx = 0;
    let selectedOptionIdx = null;

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
            
            const lesson = currentCourse.lessons[lessonIdx];
            if (!lesson || !lesson.quiz || lesson.quiz.length === 0) {
                alert("No quiz found for this lesson.");
                window.location.href = "/classes.html";
                return;
            }

            quizQuestions = lesson.quiz;
            renderQuestion();
        } catch (err) {
            console.error(err);
            loadingEl.innerHTML = `<p class="text-red-500 font-bold">Error loading quiz. Please try again.</p>`;
        }
    }

    function renderQuestion() {
        const question = quizQuestions[currentQuestionIdx];
        
        // Update Progress Bar
        const progress = (currentQuestionIdx / quizQuestions.length) * 100;
        progressBar.style.width = progress + "%";

        // Reset State
        selectedOptionIdx = null;
        btnCheck.disabled = true;
        feedbackBar.classList.remove("show", "bg-green-100", "bg-red-100");
        
        // Hide Question Media if empty
        questionMedia.innerHTML = "";
        if (question.image) {
            questionMedia.innerHTML = `<img src="${question.image}" class="max-h-48 rounded-2xl shadow-sm border border-gray-100" />`;
        }

        // Title
        questionText.innerText = question.question || "Select the correct answer";

        // Options
        optionsContainer.innerHTML = "";
        question.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "option-btn group";
            btn.innerHTML = `
                <div class="option-number group-hover:border-[#1cb0f6] transition-colors">${idx + 1}</div>
                <span class="flex-1">${opt.option}</span>
            `;
            btn.onclick = () => selectOption(idx, btn);
            optionsContainer.appendChild(btn);
        });

        // Show UI
        loadingEl.classList.add("hidden");
        quizContent.classList.remove("hidden");
        quizContent.classList.add("flex"); // Ensure flex is added back
        setTimeout(() => quizContent.classList.add("opacity-100"), 50);
    }

    function selectOption(idx, btn) {
        if (feedbackBar.classList.contains("show")) return; // Prevent selection after checking

        // Remove previous selection from all buttons correctly
        const allButtons = optionsContainer.querySelectorAll(".option-btn");
        allButtons.forEach(el => el.classList.remove("selected"));
        
        // Add new selection
        btn.classList.add("selected");
        selectedOptionIdx = idx;
        btnCheck.disabled = false;
    }

    btnCheck.onclick = () => {
        const question = quizQuestions[currentQuestionIdx];
        const isCorrect = question.options[selectedOptionIdx].correct;

        // Show Feedback Bar
        feedbackBar.classList.add("show");
        
        if (isCorrect) {
            feedbackBar.classList.add("bg-[#d7ffb8]");
            feedbackIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
            feedbackIcon.className = "w-14 h-14 rounded-full flex items-center justify-center bg-[#58cc02] text-white text-3xl";
            feedbackTitle.innerText = "Excellent!";
            feedbackTitle.className = "text-2xl font-black text-[#58a700]";
            btnContinue.className = "w-full md:w-auto md:min-w-[150px] bg-[#58cc02] text-white font-bold py-4 px-10 rounded-2xl uppercase tracking-widest text-lg shadow-[0_4px_0_#46a302]";
        } else {
            const correctAnswer = question.options.find(o => o.correct)?.option || "Correct Answer";
            feedbackBar.classList.add("bg-[#ffdfe0]");
            feedbackIcon.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
            feedbackIcon.className = "w-14 h-14 rounded-full flex items-center justify-center bg-[#ff4b4b] text-white text-3xl";
            feedbackTitle.innerText = "Correct solution:";
            feedbackTitle.className = "text-xl font-black text-[#ea2b2b]";
            feedbackExplanation.innerText = correctAnswer;
            btnContinue.className = "w-full md:w-auto md:min-w-[150px] bg-[#ff4b4b] text-white font-bold py-4 px-10 rounded-2xl uppercase tracking-widest text-lg shadow-[0_4px_0_#d43535]";
        }
        
        btnCheck.classList.add("opacity-0", "pointer-events-none");
    };

    btnContinue.onclick = async () => {
        btnCheck.classList.remove("opacity-0", "pointer-events-none");
        
        if (currentQuestionIdx < quizQuestions.length - 1) {
            currentQuestionIdx++;
            renderQuestion();
        } else {
            // Quiz Finished
            progressBar.style.width = "100%";
            await recordCompletion();
            window.location.href = "/classes.html";
        }
    };

    async function recordCompletion() {
        const nodeId = `${courseId}_${lessonIdx}_quiz`;
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

    init();
})();
