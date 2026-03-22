
function welcomePage() {
    const container = document.getElementById("mainContent");
    console.log(container, 'dd');
    // Remove padding from container to allow section to take full width
    // container.className = "w-full bg-white p-0 m-0";

    container.innerHTML = `
            <section id="welcomeSection" class="w-full lg:w-[500px] relative overflow-hidden bg-[#FDFBFA] font-sans">
                <!-- Top Section -->
               <div class="w-full h-screen flex item-center justify-center flex-col bg-green-800">
                   <div 
onclick="document.getElementById('courses')?.scrollIntoView({behavior: 'smooth'})"
class="  w-full  h-5/12 bg-white shadow-xl overflow-hidden 
cursor-pointer active:scale-[0.98] transition-all duration-300">

    <!-- Image -->
    <div class="relative">
        <img src="./resources/learning_coffee.png"
            class="w-full h-44 object-cover"
            alt="Learn Coffee">
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        <h2 class="absolute bottom-4 left-4 right-4 text-white bg-green-950/50 p-1  text-xl font-bold leading-snug">
            Learn Coffee Skills<br>
            <span class="text-[#6EE7B7]">100% Free</span>
        </h2>
    </div>

    <!-- Content -->
    <div class="p-5 space-y-4">

        <p class="text-gray-600 text-sm leading-relaxed">
            Discover brewing secrets, coffee beans, and barista tricks. 
            Start learning today without paying anything.
        </p>

        <div class="flex items-center justify-between">

            <span class="text-[#10B981] font-semibold text-sm">
                Free Coffee Classes
            </span>

            <div class="bg-[#10B981] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                Start →
            </div>

        </div>

    </div>

</div>
<img src="./resources/Change_the_bg_into_coffee_color_and_add_the_logo_o_5010e174c4.jpeg" class="w-full h-7/12 object-fill" alt="Learn Coffee">
    
</div>
        
               </div>
                        
                        

                                        

                                    </div>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                </div>

                <!-- Fallback for Mobile (No complex cloth rolling) -->
                <div class=" px-6 py-6 bg-white">
                    <div class="text-center">
                        <img src="./resources/barista_3d.png" class="h-48 object-contain mx-auto mb-6" alt="Barista">
                        <h3 class="text-3xl font-bold text-[#064E3B] ">Master The Art</h3>
                        <div class="w-20 h-1 bg-[#10B981] mx-auto rounded-full"></div>
                    </div>
                     
                </div>

                <!-- Spacer to make scrolling smooth -->
                <div class="h-32 bg-white hidden md:block"></div>
           
<!-- Header Carousel/Grid -->
            <div class=" text-black max-w-7xl mx-auto px-6 rounded-3xl  mt-0">

                <!-- Mission & Values Sections -->
                <div class="grid  gap-16">
                    <div class="space-y-12">
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-green-900" data-t="v1Title">Barista Training &
                                Skill
                                Development</h3>
                            <p class="text-gray-700 leading-relaxed mb-4 text-lg" data-t="v1Desc1">Slash Coffee
                                Academy
                                works to create the next generation of professional baristas. Students here learn
                                Espresso Extraction, Milk Steaming, Brewing Science, and Latte Art — the foundation
                                of
                                making extraordinary coffee.</p>
                            <p class="text-gray-700 leading-relaxed text-lg" data-t="v1Desc2">The training is
                                completely
                                hands-on and practical, using cafe-grade equipment under the supervision of
                                experienced
                                trainers.</p>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-green-900" data-t="v2Title">Student Success
                                Stories
                            </h3>
                            <p class="text-gray-700 leading-relaxed text-lg" data-t="v2Desc">Recently, many trainees
                                have secured opportunities in cafes in various countries like Saudi Arabia after
                                completing our courses — manifesting our success beyond the classroom.</p>
                        </div>
                    </div>
                    <div class="space-y-12">
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-green-900" data-t="v3Title">Association with
                                Slash
                                Coffee</h3>
                            <p class="text-gray-700 leading-relaxed text-lg" data-t="v3Desc">The academy is directly
                                linked with the Slash Coffee brand, giving students the chance to apply their skills
                                in
                                a real cafe environment.</p>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold mb-4 text-green-900" data-t="v4Title">Why We Are Different
                            </h3>
                            <ul class="space-y-4 text-gray-700 text-lg">
                                <li class="flex items-start"><i
                                        class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                    <div><span class="font-bold text-black" data-t="f1Title">Real Experience:</span>
                                        <span data-t="f1Desc">Train on professional espresso machines and cafe
                                            workflows.</span>
                                    </div>
                                </li>
                                <li class="flex items-start"><i
                                        class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                    <div><span class="font-bold text-black" data-t="f2Title">Career Path:</span>
                                        <span data-t="f2Desc">Skills that open doors locally and
                                            internationally.</span>
                                    </div>
                                </li>
                                <li class="flex items-start"><i
                                        class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                    <div><span class="font-bold text-black" data-t="f3Title">Community &
                                            Culture:</span>
                                        <span data-t="f3Desc">Become part of a genuine coffee culture and build a
                                            strong
                                            technical foundation.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- Core Philosophy Quote -->
                <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                    <p class="text-2xl italic text-green-800 font-light" data-t="footerQuote">“We don't just teach
                        coffee. We build confidence, personal style, and successful careers.”</p>
                </div>
            </div>

            <!-- Hero Section -->
            <section
                class="relative bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center h-screen flex items-center mt-20">
                <div class="absolute inset-0 bg-black/75"></div>
                <div class="container mx-auto px-6 relative z-10 text-center text-white">
                    <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight" data-t="heroTitle">
                        Master the Art of <span class="accent-text">Coffee</span>
                    </h1>
                    <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed" data-t="heroSub">
                        From raw bean to the perfect cup, start your journey today with professional barista
                        training in
                        Dhaka.
                    </p>
                    <div class="flex flex-col md:flex-row justify-center gap-5">
                        <a href="#courses" data-t="viewCourses"
                            class="bg-transparent border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-bold py-4 px-10 rounded-full transition duration-300">
                            View Courses
                        </a>
                        <a href="#enroll" data-t="startLearning"
                            class="bg-[#10B981] text-white hover:bg-[#059669] font-bold py-4 px-10 rounded-full transition duration-300 shadow-xl">
                            Start Learning
                        </a>
                    </div>
                </div>
            </section>

            <!-- Features Grid -->
            <section class="py-24 bg-white">
                <div class="container mx-auto px-6">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl md:text-5xl font-bold text-[#064E3B] mb-6" data-t="whyTitle">Why Choose
                            Slash Coffee Academy?</h2>
                        <div class="w-24 h-1.5 bg-[#10B981] mx-auto rounded-full"></div>
                    </div>
                    <div class="grid gap-10">
                        <div
                            class="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                            <div class="text-[#10B981] text-5xl mb-6 group-hover:scale-110 transition-transform"><i
                                    class="fas fa-seedling"></i></div>
                            <h3 class="text-2xl font-bold mb-3 text-green-900" data-t="w1Title">Bean to Cup Journey
                            </h3>
                            <p class="text-gray-600 leading-relaxed" data-t="w1Desc">Learn about the entire
                                lifecycle of
                                coffee, from the farm to perfect extraction.</p>
                        </div>
                        <div
                            class="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                            <div class="text-[#10B981] text-5xl mb-6 group-hover:scale-110 transition-transform"><i
                                    class="fas fa-blender"></i></div>
                            <h3 class="text-2xl font-bold mb-3 text-green-900" data-t="w2Title">Advanced Skills</h3>
                            <p class="text-gray-600 leading-relaxed" data-t="w2Desc">Master Latte Art, V60 Brewing,
                                Syphon, French Press, and Modern Mixology.</p>
                        </div>
                        <div
                            class="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                            <div class="text-[#10B981] text-5xl mb-6 group-hover:scale-110 transition-transform"><i
                                    class="fas fa-briefcase"></i></div>
                            <h3 class="text-2xl font-bold mb-3 text-green-900" data-t="w3Title">Professional Growth
                            </h3>
                            <p class="text-gray-600 leading-relaxed" data-t="w3Desc">Gain essential skills like POS
                                handling, hygiene, inventory management, and costing.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Curriculum Section -->
            <section id="courses" class="py-24 coffee-light">
                <div class="container mx-auto px-6">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl md:text-5xl font-bold text-[#064E3B] mb-6" data-t="curriculumTitle">Our
                            Curriculum</h2>
                        <p class="text-gray-600 max-w-3xl mx-auto text-lg" data-t="curriculumSub">Choose the right
                            path
                            for your career goals. From foundation to advanced professional skills.</p>
                    </div>

                    <div class="grid  gap-8" id="coursesGrid">
                        <!-- Foundation Card -->
                        <div
                            class="bg-white rounded-2xl shadow-lg border-t-8 border-[#34D399] p-8 hover:-translate-y-2 transition duration-300">
                            <h3 class="text-2xl font-bold text-[#064E3B]" data-t="c1Title">Foundation</h3>
                            <div class="text-4xl font-extrabold text-[#10B981] my-4" data-t="c1Price">৳4,999</div>
                            <p class="text-xs font-black uppercase text-gray-400 tracking-widest mb-6"
                                data-t="c1Duration">Duration: 4 Days</p>
                            <ul class="space-y-4 text-gray-700">
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c1L1">History & Culture of Coffee</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c1L2">Espresso Machine Operation</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c1L3">Cleaning & Maintenance</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c1L4">Bean to Cup Basics</span></li>
                            </ul>
                        </div>

                        <!-- Basic Card -->
                        <div
                            class="bg-white rounded-2xl shadow-lg border-t-8 border-[#10B981] p-8 hover:-translate-y-2 transition duration-300">
                            <h3 class="text-2xl font-bold text-[#064E3B]" data-t="c2Title">Basic</h3>
                            <div class="text-4xl font-extrabold text-[#10B981] my-4" data-t="c2Price">৳8,999</div>
                            <p class="text-xs font-black uppercase text-gray-400 tracking-widest mb-6"
                                data-t="c2Duration">Duration: 7 Days</p>
                            <ul class="space-y-4 text-gray-700">
                                <li class="flex items-center"><i
                                        class="fas fa-plus-circle text-green-500 mr-3"></i><span
                                        data-t="c2L1">Everything in Foundation +</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c2L2">Perfect Espresso Shot</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c2L3">Tamping & Extraction Time</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c2L4">Intro to Calibration</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c2L5">Intro to Latte Art</span></li>
                            </ul>
                        </div>

                        <!-- Intermediate Card -->
                        <div
                            class="bg-white rounded-2xl shadow-xl border-t-8 border-[#059669] p-8 hover:-translate-y-2 transition duration-300 border-2 border-green-50 relative">
                            <div class="absolute -top-4 right-6 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce"
                                data-t="c3Popular">Popular</div>
                            <h3 class="text-2xl font-bold text-[#064E3B]" data-t="c3Title">Intermediate</h3>
                            <div class="text-4xl font-extrabold text-[#10B981] my-4" data-t="c3Price">৳11,999</div>
                            <p class="text-xs font-black uppercase text-gray-400 tracking-widest mb-6"
                                data-t="c3Duration">Duration: 10 Days</p>
                            <ul class="space-y-4 text-gray-700">
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c3L1">Mastery in Calibration</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c3L2">Milk Texturing Techniques</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c3L3">Steps to Latte Art</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c3L4">Intro to V60 Brewing</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c3L5">Customer Service Skills</span></li>
                            </ul>
                        </div>

                        <!-- Professional Card -->
                        <div
                            class="bg-white rounded-2xl shadow-lg border-t-8 border-[#047857] p-8 hover:-translate-y-2 transition duration-300">
                            <h3 class="text-2xl font-bold text-[#064E3B]" data-t="c4Title">Professional</h3>
                            <div class="text-4xl font-extrabold text-[#10B981] my-4" data-t="c4Price">৳19,999</div>
                            <p class="text-xs font-black uppercase text-gray-400 tracking-widest mb-6"
                                data-t="c4Duration">Duration: 15 Days</p>
                            <ul class="space-y-4 text-gray-700">
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c4L1">Advanced Latte Art</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c4L2">Hot V60 Brewing</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c4L3">Iced Coffee & Frappes</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c4L4">Refreshment Drinks</span></li>
                                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span
                                        data-t="c4L5">POS Handling & Hygiene</span></li>
                            </ul>
                        </div>

                        <!-- Advance Professional Card (Expanded) -->
                        <div
                            class="bg-white rounded-2xl shadow-2xl border-t-8 border-[#064E3B] p-8 hover:-translate-y-2 transition duration-300 relative overflow-hidden">
                            <div class="absolute top-0 right-0 bg-[#064E3B] text-white text-xs font-bold px-5 py-2 rounded-bl-2xl shadow-lg"
                                data-t="c5Offer">Best Offer</div>
                            <div class="grid gap-10">
                                <div>
                                    <h3 class="text-3xl font-bold text-[#064E3B] mb-2" data-t="c5Title">Advance
                                        Professional</h3>
                                    <div class="text-5xl font-black text-[#10B981] mb-2" data-t="c5Price">৳29,999
                                    </div>
                                    <p class="text-sm font-bold uppercase text-gray-400 tracking-widest mb-6"
                                        data-t="c5Duration">Duration: 26 Days</p>
                                    <p class="text-gray-600 leading-relaxed mb-6" data-t="c5Desc">The ultimate
                                        career
                                        transformation course. Master everything from roasting to inventory costing.
                                    </p>
                                </div>
                                <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <h4 class="font-bold text-green-900 mb-4 flex items-center"><i
                                            class="fas fa-award mr-2 text-yellow-500"></i><span
                                            data-t="c5ModTitle">Advanced Modules:</span></h4>
                                    <ul class="space-y-3 text-gray-700 text-sm">
                                        <li class="flex items-center"><i
                                                class="fas fa-star text-[#10B981] mr-3"></i><span data-t="c5Mod1">Brewed
                                                Coffee: V60, Syphon, AeroPress</span></li>
                                        <li class="flex items-center"><i
                                                class="fas fa-star text-[#10B981] mr-3"></i><span
                                                data-t="c5Mod2">Roasting Methods & Cupping Wheel</span></li>
                                        <li class="flex items-center"><i
                                                class="fas fa-star text-[#10B981] mr-3"></i><span
                                                data-t="c5Mod3">Inventory Management & Costing</span></li>
                                        <li class="flex items-center"><i
                                                class="fas fa-star text-[#10B981] mr-3"></i><span data-t="c5Mod4">Elite
                                                Level Latte Art</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Enrollment Form Section -->
            <section id="enroll" class="py-24 coffee-bg">
                <div class="container mx-auto px-6">
                    <div id="enrollmentFormContainer"
                        class="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div class="grid ">
                            <div class=" bg-green-950 p-10 text-white flex flex-col justify-center">
                                <h2 class="text-3xl font-bold mb-6" data-t="enrollTitle">Enroll Now</h2>
                                <p class="text-green-100 mb-8 leading-relaxed" data-t="enrollSub">Secure your seat
                                    at
                                    Dhaka's premier Coffee Academy. Professional certification awaits.</p>
                                <div class="space-y-4 text-sm opacity-80">
                                    <div class="flex items-center gap-3"><i
                                            class="fas fa-map-marker-alt"></i><span>Kuril Bishwaroad, Dhaka</span>
                                    </div>
                                    <div class="flex items-center gap-3"><i class="fas fa-phone"></i><span>+880
                                            1645-640801</span></div>
                                    <div class="flex items-center gap-3"><i
                                            class="fas fa-envelope"></i><span>academy@slashcoffee.com</span></div>
                                </div>
                            </div>
                            <div class=" p-10">
                                <form id="enrollmentForm" class="space-y-6">
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2"
                                            data-t="formCourse">Course</label>
                                        <select id="courseSelect"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] outline-none bg-gray-50 transition">
                                            <option value="Foundation course" data-t="opt1">Foundation - ৳4,999
                                            </option>
                                            <option value="Basic course" data-t="opt2">Basic - ৳8,999</option>
                                            <option value="Intermediate course" data-t="opt3">Intermediate - ৳11,999
                                            </option>
                                            <option value="Professional course" data-t="opt4">Professional - ৳19,999
                                            </option>
                                            <option value="AdvanceProfessional course" data-t="opt5">Advance
                                                Professional - ৳29,999</option>
                                        </select>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2"
                                                data-t="formName">Name</label>
                                            <input type="text" id="PcustomerName"
                                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] outline-none"
                                                placeholder="Full Name" required>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2"
                                                data-t="formEmail">Email</label>
                                            <input type="email" id="PemailAddress"
                                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] outline-none"
                                                placeholder="Email" required>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4">
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2"
                                                data-t="formPhone1">Phone 1</label>
                                            <input type="tel" id="PcontactNumber1"
                                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] outline-none"
                                                placeholder="Active Phone" required>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-2"
                                                data-t="formPhone2">Phone 2</label>
                                            <input type="tel" id="PcontactNumber2"
                                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] outline-none"
                                                placeholder="Optional">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2"
                                            data-t="formAddress">Address</label>
                                        <textarea id="PshippingAddress" rows="2"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10B981] outline-none"
                                            placeholder="Location" required></textarea>
                                    </div>
                                    <button type="button" onclick="checkoutHandlerAcademy()" data-t="submitBtn"
                                        class="w-full bg-[#10B981] hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg transition transform hover:scale-[1.01] active:scale-95 text-lg">
                                        Complete Enrollment
                                    </button>
                                    <p class="text-[10px] text-center text-gray-400 mt-4 leading-relaxed"
                                        data-t="formTerms">By enrolling, you agree to our terms of service regarding
                                        course attendance and payments.</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="bg-green-950 text-gray-400 py-16">
            <div class="container mx-auto px-6 text-center">
                <img src="https://slashcoffeebd.com/native_resources/logo_wth_white_bg.png" alt="Logo"
                    class="h-16 mx-auto mb-8 opacity-60">
                <p class="mb-4 text-white font-bold" data-t="footerCopy">&copy; 2026 Slash Coffee Academy. All
                    Rights
                    Reserved.</p>
                <p class="text-sm max-w-md mx-auto" data-t="footerAddr">Kuril Bishwaroad, Pragati Sarani, Dhaka
                    (Beside
                    Jamuna Future Park)</p>
                <div class="flex justify-center gap-8 mt-10">
                    <a href="#" class="hover:text-[#10B981] transition text-2xl"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="hover:text-[#10B981] transition text-2xl"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="hover:text-[#10B981] transition text-2xl"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </footer>
     
            </section>
        `;

    // Setting up the scroll listener for the rolling cloth effect
    const section = document.getElementById('baristaScrollSection');
    const cloth = document.getElementById('magicCloth');
    const clothContent = document.getElementById('magicClothContent');

    if (section && cloth) {
        // max height of the cloth is 800px
        const maxClothHeight = 800;
        clothContent.style.height = maxClothHeight + "px";

        const onScroll = () => {
            const rect = section.getBoundingClientRect();
            // How far we've scrolled into the section in pixels
            const scrollY = -rect.top;

            // Max scroll is the total height of the section minus the viewport height
            const maxScroll = section.offsetHeight - window.innerHeight;

            let scrollProgress = scrollY / maxScroll;

            if (scrollProgress < 0) scrollProgress = 0;
            if (scrollProgress > 1) scrollProgress = 1;

            // Instruction: "As the user scrolls down, the content will roll up smoothly."
            // Rolling UP means height DECREASES from maxClothHeight down to 0.
            const currentHeight = maxClothHeight * (1 - scrollProgress);

            cloth.style.height = currentHeight + "px";
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // Initial call
        onScroll();
    }
}

const serverHost = window.location.origin;
let currentLang = 'en';

const translations = {
    en: {
        mainTitle: "Slash Coffee Academy", navTitle: "Slash Coffee Academy", navEnroll: "Enroll Now",
        v1Title: "Barista Training & Skill Development", v1Desc1: "Slash Coffee Academy works to create the next generation of professional baristas. Students here learn Espresso Extraction, Milk Steaming, Brewing Science, and Latte Art — the foundation of making extraordinary coffee.", v1Desc2: "The training is completely hands-on and practical, using cafe-grade equipment under the supervision of experienced trainers.",
        v2Title: "Student Success Stories", v2Desc: "Recently, many trainees have secured opportunities in cafes in various countries like Saudi Arabia after completing our courses — manifesting our success beyond the classroom.",
        v3Title: "Association with Slash Coffee", v3Desc: "The academy is directly linked with the Slash Coffee brand, giving students the chance to apply their skills in a real cafe environment.",
        v4Title: "Why We Are Different", f1Title: "Real Experience:", f1Desc: "Train on professional espresso machines and cafe workflows.", f2Title: "Career Path:", f2Desc: "Skills that open doors locally and internationally.", f3Title: "Community & Culture:", f3Desc: "Become part of a genuine coffee culture and build a strong technical foundation.",
        footerQuote: "“We don't just teach coffee. We build confidence, personal style, and successful careers.”",
        heroTitle: "Master the Art of <span class='accent-text'>Coffee</span>", heroSub: "From raw bean to the perfect cup, start your journey today with professional barista training in Dhaka.",
        viewCourses: "View Courses", startLearning: "Start Learning",
        whyTitle: "Why Choose Slash Coffee Academy?",
        w1Title: "Bean to Cup Journey", w1Desc: "Learn about the entire lifecycle of coffee, from the farm to perfect extraction.",
        w2Title: "Advanced Skills", w2Desc: "Master Latte Art, V60 Brewing, Syphon, French Press, and Modern Mixology.",
        w3Title: "Professional Growth", w3Desc: "Gain essential industry skills like POS handling, hygiene, inventory management, and costing.",
        curriculumTitle: "Our Curriculum", curriculumSub: "Choose the right path for your career goals. From foundation to advanced professional skills.",
        enrollTitle: "Enroll Now", enrollSub: "Secure your seat at Slash Coffee Academy.",
        formCourse: "Select Course", opt1: "Foundation - ৳4,999", opt2: "Basic - ৳8,999", opt3: "Intermediate - ৳11,999", opt4: "Professional - ৳19,999", opt5: "Advance Professional - ৳29,999",
        formName: "Full Name", phName: "e.g. Kawsar Ahmed", formEmail: "Email Address", phEmail: "kawsar@gmail.com", formPhone1: "Phone 1", formPhone2: "Phone 2", formAddress: "Address / Location", phAddress: "K-56/1, Kazi Tower...",
        submitBtn: "Complete Enrollment", formTerms: "By enrolling, you agree to our terms of service regarding course attendance and payments.",
        footerCopy: "&copy; 2026 Slash Coffee Academy. All Rights Reserved.", footerAddr: "Kuril Bishwaroad, Pragati Sarani, Dhaka (Beside Jamuna Future Park)",
        alertFill: "Please fill in all required fields.", successTitle: "Enrollment Successful!", successSub: "Thank you, your enrollment is complete. Order ID:",
        successNote: "Our team will contact you within 24 hours.", downloadBtn: "Download Invoice", homeBtn: "Back to Home",
        pdfHeader: "Enrollment Confirmation", pdfStudent: "Student Info:", pdfCourse: "Course Info:", pdfMsg: "Thank you for joining Slash Coffee Academy!",
        pdfLoc: "Our Location:", pdfLocDetail: "Kuril Bishwaroad, Pragati Sarani, Dhaka", pdfSystem: "Slash Coffee Academy Automated System",
        c1Title: "Foundation", c1Price: "৳4,999", c1Duration: "Duration: 4 Days", c1L1: "History & Culture", c1L2: "Espresso Machine Op.", c1L3: "Maintenance", c1L4: "Bean Basics",
        c2Title: "Basic", c2Price: "৳8,999", c2Duration: "Duration: 7 Days", c2L1: "Foundation +", c2L2: "Perfect Shot", c2L3: "Tamping", c2L4: "Calibration", c2L5: "Intro Art",
        c3Title: "Intermediate", c3Price: "৳11,999", c3Duration: "Duration: 10 Days", c3Popular: "Popular", c3L1: "Master Calibration", c3L2: "Texturing", c3L3: "Steps to Art", c3L4: "V60 Brewing", c3L5: "Service Skills",
        c4Title: "Professional", c4Price: "৳19,999", c4Duration: "Duration: 15 Days", c4L1: "Advanced Art", c4L2: "Hot V60", c4L3: "Frappes", c4L4: "Refreshments", c4L5: "POS & Hygiene",
        c5Title: "Advance Pro", c5Price: "৳29,999", c5Duration: "Duration: 26 Days", c5Offer: "Best Offer", c5Desc: "Ultimate career path course.", c5ModTitle: "Advanced Modules:", c5Mod1: "Brewing: V60, Syphon", c5Mod2: "Roasting & Cupping", c5Mod3: "Inventory & Costing", c5Mod4: "Pro Latte Art"
    },
    bn: {
        mainTitle: "স্ল্যাশ কফি একাডেমি", navTitle: "স্ল্যাশ কফি একাডেমি", navEnroll: "এখনই ভর্তি হন",
        v1Title: "বারিস্তা প্রশিক্ষণ ও দক্ষতা উন্নয়ন", v1Desc1: "স্ল্যাশ কভী একাডেমি পরবর্তী প্রজন্মের পেশাদার বারিস্তা তৈরির লক্ষ্যে কাজ করে। শিক্ষার্থীরা এখানে এসপ্রেসো এক্সট্রাকশন, মিল্ক স্টিমিং, ব্রিউইং সায়েন্স এবং ল্যাটে আর্ট শেখে — যা অসাধারণ কফি তৈরির মূল ভিত্তি।", v1Desc2: "প্রশিক্ষণটি সম্পূর্ণ হাতে-কলমে এবং ব্যবহারিক, যেখানে অভিজ্ঞ প্রশিক্ষকদের তত্ত্বাবধানে ক্যাফে-গ্রেড সরঞ্জাম ব্যবহার করা হয়।",
        v2Title: "শিক্ষার্থীদের সাফল্যের গল্প", v2Desc: "সম্প্রতি কোর্স সম্পন্ন করে প্রশিক্ষণার্থীরা সৌদি আরবের মতো বিভিন্ন দেশের ক্যাফেতে কাজ করার সুযোগ পেয়েছেন — যা আমাদের ক্লাসরুমের বাইরের সফলতার বহিঃপ্রকাশ।",
        v3Title: "স্ল্যাশ কফির সাথে সম্পৃক্ততা", v3Desc: "একাডেমিটি সরাসরি স্ল্যাশ কফি ব্র্যান্ডের সাথে যুক্ত, যা শিক্ষার্থীদের সত্যিকারের ক্যাফে পরিবেশে দক্ষতা প্রয়োগের সুযোগ দেয়।",
        v4Title: "কেন এটি ব্যতিক্রম", f1Title: "বাস্তব অভিজ্ঞতা:", f1Desc: "পেশাদার এসপ্রেসো মেশিন এবং ক্যাফে ওয়ার্কফ্লোতে প্রশিক্ষণ নিন।", f2Title: "ক্যারিয়ারের পথ:", f2Desc: "এমন দক্ষতা যা স্থানীয় এবং আন্তর্জাতিক উভয় ক্ষেত্রে কাজের সুযোগ খুলে দেয়।", f3Title: "কমিউনিটি ও সংস্কৃতি:", f3Desc: "একটি খাঁটি কফি সংস্কৃতির অংশ হয়ে উঠুন এবং শক্তিশালী টেকনিক্যাল ভিত্তি গড়ে তুলুন।",
        footerQuote: "“আমরা শুধু কফি শেখাই না। আমরা আত্মবিশ্বাস, নিজস্ব শৈলী এবং সফল ক্যারিয়ার গড়ে তুলি।”",
        heroTitle: "কফির শিল্পে <span class='accent-text'>পারদর্শী</span> হয়ে উঠুন", heroSub: "কাঁচা বিন থেকে শুরু করে নিঁখুত কাপ পর্যন্ত, ঢাকাতে বারিস্তা হওয়ার যাত্রা আজই শুরু করুন।",
        viewCourses: "কোর্সগুলো দেখুন", startLearning: "শেখা শুরু করুন",
        whyTitle: "কেন স্ল্যাশ কফি একাডেমি?",
        w1Title: "বিন থেকে কাপের যাত্রা", w1Desc: "কফির খামার থেকে নিঁখুত এক্সট্রাকশন পর্যন্ত পুরো জীবনচক্র সম্পর্কে জানুন।",
        w2Title: "উন্নত দক্ষতা", w2Desc: "ল্যাটে আর্ট, V60 ব্রিউইং, সাইফন, ফ্রেঞ্চ প্রেস এবং মডার্ন মিক্সোলজিতে দক্ষ হয়ে উঠুন।",
        w3Title: "পেশাদার উন্নতি", w3Desc: "ইন্ডাস্ট্রির প্রয়োজনীয় দক্ষতা যেমন POS হ্যান্ডলিং, হাইজিন এবং ইনভেন্টরি ম্যানেজমেন্ট শিখুন।",
        curriculumTitle: "আমাদের শিক্ষাক্রম", curriculumSub: "আপনার ক্যারিয়ারের লক্ষ্য অনুযায়ী সঠিক পথটি বেছে নিন। প্রাথমিক থেকে উন্নত পেশাদার দক্ষতা অর্জন করুন।",
        enrollTitle: "এখনই ভর্তি হন", enrollSub: "স্ল্যাশ কফি একাডেমিতে আপনার আসন নিশ্চিত করুন।",
        formCourse: "কোর্স", opt1: "ফাউন্ডেশন - ৪,৯৯৯ টাকা", opt2: "বেসিক - ৮,৯৯৯ টাকা", opt3: "ইন্টারমিডিয়েট - ১১,৯৯৯ টাকা", opt4: "প্রফেশনাল - ১৯,৯৯৯ টাকা", opt5: "অ্যাডভান্স প্রফেশনাল - ২৯,৯৯৯ টাকা",
        formName: "নাম", phName: "যেমন: কাওসার আহমেদ", formEmail: "ইমেল", phEmail: "kawsar@gmail.com", formPhone1: "ফোন ১", formPhone2: "ফোন ২", formAddress: "ঠিকানা / অবস্থান", phAddress: "ক-৫৬/১, কাজী টাওয়ার...",
        submitBtn: "ভর্তি সম্পন্ন করুন", formTerms: "ভর্তির মাধ্যমে, আপনি আমাদের কোর্স সংক্রান্ত শর্তাবলীতে সম্মতি দিচ্ছেন।",
        footerCopy: "&copy; ২০২৬ স্ল্যাশ কফি একাডেমি। সর্বস্বত্ব সংরক্ষিত।", footerAddr: "কুড়িল বিশ্বরোড, প্রগতি সরণি, ঢাকা (যমুনা ফিউচার পার্কের পাশে)",
        alertFill: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য প্রদান করুন।", successTitle: "ভর্তি সফল হয়েছে!", successSub: "ধন্যবাদ, আপনার ভর্তি প্রক্রিয়া সম্পন্ন হয়েছে। অর্ডার আইডি:",
        successNote: "আমাদের টিম ২৪ ঘন্টার মধ্যে যোগাযোগ করবে।", downloadBtn: "ইনভয়েস ডাউনলোড", homeBtn: "হোমে ফিরুন",
        pdfHeader: "ভর্তির নিশ্চিতকরণ", pdfStudent: "শিক্ষার্থীর তথ্য:", pdfCourse: "কোর্সের তথ্য:", pdfMsg: "স্ল্যাশ কফি একাডেমি বেছে নেওয়ার জন্য ধন্যবাদ!",
        pdfLoc: "আমাদের অবস্থান:", pdfLocDetail: "কুড়িল বিশ্বরোড, ঢাকা (যমুনা ফিউচার পার্কের পাশে)", pdfSystem: "স্ল্যাশ কফি একাডেমি স্বয়ংক্রিয় সিস্টেম",
        c1Title: "ফাউন্ডেশন", c1Price: "৳৪,৯৯৯", c1Duration: "সময়: ৪ দিন", c1L1: "ইতিহাস ও সংস্কৃতি", c1L2: "মেশিন পরিচালনা", c1L3: "রক্ষণাবেক্ষণ", c1L4: "বিন এর প্রাথমিক ধাপ",
        c2Title: "বেসিক", c2Price: "৳৮,৯৯৯", c2Duration: "সময়: ৭ দিন", c2L1: "ফাউন্ডেশন +", c2L2: "নিঁখুত শট", c2L3: "ট্যাম্পিং পদ্ধতি", c2L4: "ক্যালিব্রেশন", c2L5: "আর্ট পরিচিতি",
        c3Title: "ইন্টারমিডিয়েট", c3Price: "৳১১,৯৯৯", c3Duration: "সময়: ১০ দিন", c3Popular: "জনপ্রিয়", c3L1: "মাস্টার ক্যালিব্রেশন", c3L2: "টেক্সচারিং", c3L3: "আর্টের ধাপ", c3L4: "V60 ব্রিউইং", c3L5: "সার্ভিস স্কিল",
        c4Title: "প্রফেশনাল", c4Price: "৳১৯,৯৯৯", c4Duration: "সময়: ১৫ দিন", c4L1: "উন্নত ল্যাটে আর্ট", c4L2: "হট V60 ব্রিউইং", c4L3: "ফ্র্যাপে", c4L4: "রিফ্রেশমেন্ট ড্রিংকস", c4L5: "POS ও হাইজিন",
        c5Title: "অ্যাডভান্স প্রো", c5Price: "৳২৯,৯৯৯", c5Duration: "সময়: ২৬ দিন", c5Offer: "সেরা অফার", c5Desc: "ক্যারিয়ার গড়ার সেরা কোর্স।", c5ModTitle: "উন্নত মডিউল সমূহ:", c5Mod1: "ব্রিউইং: V60, সাইফন", c5Mod2: "রোস্টিং ও কাপিং", c5Mod3: "ইনভেন্টরি ও কস্টিং", c5Mod4: "প্রো ল্যাটে আর্ট"
    }
};

function getLanguage(lang) {

    console.log(lang);
    localStorage.setItem('lang', lang);

    document.getElementById("nav").style.display = "flex";



    currentLang = lang;
    const mainContent = document.getElementById('mainContent');
    mainContent.style.opacity = '0';

    setTimeout(() => {
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });

        const pName = document.getElementById('PcustomerName');
        if (pName) pName.placeholder = translations[lang].phName;

        const pEmail = document.getElementById('PemailAddress');
        if (pEmail) pEmail.placeholder = translations[lang].phEmail;

        const pAddr = document.getElementById('PshippingAddress');
        if (pAddr) pAddr.placeholder = translations[lang].phAddress;
        document.getElementById('mainTitle').innerText = translations[lang].mainTitle;

        document.body.className = `m-0 p-0 bg-amber-950 text-gray-900 lang-${lang}`;
        const btnEn = document.getElementById('btn-en');
        if (btnEn) btnEn.className = lang === 'en' ? 'px-3 py-1 rounded-full text-xs font-bold bg-white text-green-950' : 'px-3 py-1 rounded-full text-xs font-bold hover:bg-white/10';
        const btnBn = document.getElementById('btn-bn');
        if (btnBn) btnBn.className = lang === 'bn' ? 'px-3 py-1 rounded-full text-xs font-bold bg-white text-green-950' : 'px-3 py-1 rounded-full text-xs font-bold hover:bg-white/10';

        mainContent.style.opacity = '1';
    }, 200);
}

async function checkoutHandlerAcademy() {
    const courseSelect = document.getElementById("courseSelect");
    const data = {
        C_Name: document.getElementById("PcustomerName").value.trim(),
        C_Email: document.getElementById("PemailAddress").value.trim(),
        C_Phone1: document.getElementById("PcontactNumber1").value.trim(),
        C_Phone2: document.getElementById("PcontactNumber2").value.trim() || 'N/A',
        C_S_Location: document.getElementById("PshippingAddress").value.trim(),
        itemName: courseSelect.value,
        order_id: 'sl' + Math.floor(100000 + Math.random() * 900000)
    };

    if (!data.C_Name || !data.C_Email || !data.C_Phone1 || !data.C_S_Location) {
        alert(translations[currentLang].alertFill);
        return;
    }

    try {
        const res = await fetch(`${serverHost}/api/enroll/enroll`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (res.ok) showSuccess(data);
        else throw new Error();
    } catch {
        alert('Connection error. Please try again.');
    }
}

function showSuccess(data) {
    const container = document.getElementById('enrollmentFormContainer');
    container.innerHTML = `
                <div class='bg-green-700 w-full flex flex-col items-center justify-center p-12 text-center text-white'>
                    <div class="bg-white/20 p-6 rounded-full mb-8"><i class="fas fa-check text-5xl"></i></div>
                    <h2 class='font-bold text-4xl mb-4'>${translations[currentLang].successTitle}</h2>
                    <p class="text-green-100 text-xl mb-8">${translations[currentLang].successSub} <span class="font-bold text-white">${data.order_id}</span></p>
                    <p class="mb-10 opacity-80">${translations[currentLang].successNote}</p>
                    <div class="flex flex-col  gap-4 w-full justify-center">
                        <button id="downloadPdfBtn" class='bg-white text-green-900 px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition flex items-center justify-center'><i class="fas fa-file-pdf mr-2"></i>${translations[currentLang].downloadBtn}</button>
                        <a href="/" class="bg-green-950 px-10 py-4 rounded-full font-bold border border-white/20 hover:bg-green-900 transition flex items-center justify-center">${translations[currentLang].homeBtn}</a>
                    </div>
                </div>
            `;
    document.getElementById('downloadPdfBtn').onclick = () => generatePDF(data);
    window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
}

function generatePDF(c) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const t = translations[currentLang];

    doc.setFillColor(6, 78, 59); doc.rect(0, 0, 210, 40, "F");
    doc.setFontSize(22); doc.setTextColor(255); doc.text("SLASH COFFEE ACADEMY", 105, 20, { align: "center" });
    doc.setFontSize(12); doc.text(t.pdfHeader, 105, 30, { align: "center" });

    doc.setTextColor(0); doc.setFontSize(14); doc.text(t.pdfStudent, 20, 60);
    doc.setFontSize(10); doc.text(`Name: ${c.C_Name}\nEmail: ${c.C_Email}\nPhone: ${c.C_Phone1}\nAddr: ${c.C_S_Location}`, 20, 70);

    doc.setFontSize(14); doc.text(t.pdfCourse, 120, 60);
    doc.setFontSize(10); doc.text(`Course: ${c.itemName}\nID: ${c.order_id}\nDate: ${new Date().toLocaleDateString()}`, 120, 70);

    doc.line(20, 110, 190, 110);
    doc.text(t.pdfMsg, 105, 125, { align: "center" });

    doc.setFillColor(243, 244, 246); doc.rect(20, 150, 170, 30, "F");
    doc.text(`${t.pdfLoc}\n${t.pdfLocDetail}`, 105, 162, { align: "center" });

    doc.setFontSize(8); doc.setTextColor(150); doc.text(t.pdfSystem, 105, 280, { align: "center" });
    doc.save(`Invoice_${c.order_id}.pdf`);
}