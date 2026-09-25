

(function () {
  "use strict";

  /* 1. COURSE DATA (each course paired with its uploaded image)       */
  
  const courses = [
    {
      id: "frontend",
      title: "Frontend Web Development",
      tag: "HTML + CSS + JavaScript",
      icon: "💻",
      image: "web_dev.jpg",
      level: "Beginner → Intermediate",
      price: 0,
      desc: "Learn to build modern, responsive and interactive websites using HTML, CSS and JavaScript — from fundamentals to a final real-world project.",
      lessons: [
        "HTML Fundamentals & Semantic HTML",
        "CSS Fundamentals, Flexbox & Grid",
        "Responsive Design",
        "JavaScript Fundamentals & DOM Manipulation",
        "Events, Functions, Arrays & Objects",
        "Modern JavaScript (ES6) & APIs",
        "Final Frontend Project"
      ]
    },
    {
      id: "python-ds",
      title: "Python for Data Science",
      tag: "Python + NumPy + Pandas + Matplotlib",
      icon: "🐍",
      image: "python.jpg",
      level: "Beginner → Intermediate",
      price: 49,
      desc: "Work with real data using Python. Master NumPy, Pandas and Matplotlib, then clean, visualize and analyze data in a final project.",
      lessons: [
        "Python Fundamentals, Variables & OOP Basics",
        "NumPy",
        "Pandas",
        "Data Cleaning",
        "Data Visualization with Matplotlib",
        "Exploratory Data Analysis",
        "Final Data Analysis Project"
      ]
    },
    {
      id: "ai-fundamentals",
      title: "Artificial Intelligence Fundamentals",
      tag: "AI Concepts + Generative AI",
      icon: "🤖",
      image: "ai_data.jpg",
      level: "Beginner → Intermediate",
      price: 59,
      desc: "Understand the core concepts of AI and Machine Learning, then explore generative AI, LLMs and prompt engineering with real-world applications.",
      lessons: [
        "What is AI? AI vs ML vs Deep Learning",
        "Neural Networks Basics",
        "Natural Language Processing",
        "Computer Vision Basics",
        "Generative AI & Large Language Models",
        "Prompt Engineering",
        "AI Project"
      ]
    },
    {
      id: "sql-db",
      title: "SQL & Database Management",
      tag: "SQL + Relational Databases",
      icon: "🗄️",
      image: "sql.jpg",
      level: "Beginner → Advanced",
      price: 49,
      desc: "Learn database fundamentals and SQL, from SELECT queries and JOINs to normalization and advanced queries, then build your own database project.",
      lessons: [
        "Database Fundamentals, Tables & Relationships",
        "SQL Basics & SELECT Queries",
        "Filtering, Sorting & JOINs",
        "Aggregate Functions & Subqueries",
        "Normalization & Database Design",
        "Advanced SQL",
        "Practical Database Project"
      ]
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity Fundamentals",
      tag: "Security + Networking + Web Security",
      icon: "🛡️",
      image: "cyber.jpg",
      level: "Beginner → Advance",
      price: 59,
      desc: "Learn the core concepts of cybersecurity — threats, networking, authentication, encryption and web security — then build a security project.",
      lessons: [
        "Cybersecurity Fundamentals & Threats",
        "Networking Basics & Authentication",
        "Password Security & Encryption Basics",
        "Web Security",
        "Common Attacks — Conceptually",
        "Security Best Practices & Risk Management",
        "Security Project"
      ]
    },
    {
      id: "cloud-computing",
      title: "Cloud Computing Fundamentals",
      tag: "Cloud + Deployment",
      icon: "☁️",
      image: "cloud.jpg",
      level: "Intermediate",
      price: 49,
      desc: "Explore the core concepts of cloud computing, major cloud services and deployment models, and build real-world cloud deployment projects.",
      lessons: [
        "What is Cloud Computing? Service & Deployment Models",
        "Servers, Storage & Virtual Machines",
        "Containers Basics",
        "Databases & APIs in Cloud",
        "Deployment Fundamentals",
        "Cloud Security Basics",
        "Practical Deployment Project"
      ]
    }
  ];

  const byId = (id) => courses.find((c) => c.id === id);
  const priceLabel = (price) => (price === 0 ? "Free" : "$" + price);

  /* 2. STATE                                                          */
  const state = {
    role: null,           // 'student' | 'parent'
    lastStep2: "step-campus", // which step-2 screen to go "back" to from interest
    selectedCourseId: null,
    cart: []              // array of course ids
  };

  /* 3. ONBOARDING WIZARD                                              */
  const dotForStep = {
    "step-role": 1,
    "step-campus": 2,
    "step-age": 2,
    "step-interest": 3,
    "step-preview": 4
  };

  function showStep(stepId) {
    document.querySelectorAll(".ob-step").forEach((el) => el.classList.remove("active"));
    const target = document.getElementById(stepId);
    if (target) target.classList.add("active");

    const activeDot = dotForStep[stepId] || 1;
    document.querySelectorAll(".dot").forEach((dot) => {
      dot.classList.toggle("active", Number(dot.dataset.dot) <= activeDot);
    });
  }

  function initOnboarding() {
    // Step 1: choose role
    document.querySelectorAll(".role-card").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".role-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        state.role = card.dataset.role;

        if (state.role === "student") {
          state.lastStep2 = "step-campus";
          showStep("step-campus");
        } else {
          state.lastStep2 = "step-age";
          showStep("step-age");
        }
      });
    });

    // Step 2a: campus pills
    const campusList = document.getElementById("campus-list");
    const campusNext = document.getElementById("campus-next");
    campusList.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill");
      if (!pill) return;
      campusList.querySelectorAll(".pill").forEach((p) => p.classList.remove("selected"));
      pill.classList.add("selected");
      campusNext.disabled = false;
    });
    campusNext.addEventListener("click", () => {
      state.lastStep2 = "step-campus";
      enterInterestStep();
    });

    // Step 2b: child age
    const childAge = document.getElementById("child-age");
    const ageNext = document.getElementById("age-next");
    childAge.addEventListener("input", () => {
      ageNext.disabled = childAge.value.trim().length === 0;
    });
    ageNext.addEventListener("click", () => {
      state.lastStep2 = "step-age";
      enterInterestStep();
    });

    // Back buttons (static targets)
    document.querySelectorAll(".ob-back[data-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const backTo = btn.id === "interest-back" ? state.lastStep2 : btn.dataset.back;
        showStep(backTo);
      });
    });

    // Step 3: build course interest grid
    buildInterestGrid();

    // Step 4: enroll button
    document.getElementById("enroll-btn").addEventListener("click", enterSite);
  }

  function enterInterestStep() {
    const heading = document.getElementById("interest-heading");
    const label = document.getElementById("interest-step-label");
    if (state.role === "parent") {
      heading.textContent = "Which course fits your child?";
    } else {
      heading.textContent = "Which course are you interested in?";
    }
    label.textContent = "Step 3 of 4";
    showStep("step-interest");
  }

  function buildInterestGrid() {
    const grid = document.getElementById("ob-course-grid");
    grid.innerHTML = courses
      .map(
        (c) => `
      <div class="ob-course" data-id="${c.id}">
        <div class="ob-course-left">
          <img class="ob-course-thumb" src="${c.image}" alt="${c.title}">
          <div>
            <div class="ob-course-name">${c.title}</div>
            <div class="ob-course-tag">${c.tag}</div>
          </div>
        </div>
        <span class="badge ${c.price === 0 ? "badge-free" : "badge-paid"}">${priceLabel(c.price)}</span>
      </div>`
      )
      .join("");

    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".ob-course");
      if (!item) return;
      grid.querySelectorAll(".ob-course").forEach((el) => el.classList.remove("selected"));
      item.classList.add("selected");
      state.selectedCourseId = item.dataset.id;
      setTimeout(() => showPreview(state.selectedCourseId), 250);
    });
  }

  function showPreview(courseId) {
    const c = byId(courseId);
    const box = document.getElementById("preview-box");
    box.innerHTML = `
      <img class="preview-thumb" src="${c.image}" alt="${c.title}">
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <ul>
        ${c.lessons.slice(0, 5).map((l) => `<li>${l}</li>`).join("")}
        <li>Price: ${priceLabel(c.price)}${c.price === 0 ? " — your first course" : ""}</li>
      </ul>
    `;
    showStep("step-preview");
  }

  function enterSite() {
    document.getElementById("onboarding").classList.add("hidden");
    document.getElementById("site").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    // Pre-select the course they previewed in the registration form
    const regSelect = document.getElementById("reg-course-select");
    if (state.selectedCourseId && regSelect) {
      regSelect.value = state.selectedCourseId;
    }
  }

  /* 4. MAIN SITE — NAVBAR                                             */

  function initNavbar() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );

    document.getElementById("hero-trial-btn").addEventListener("click", () => {
      document.getElementById("registration").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* 5. COURSES GRID + MODAL                                           */
  function renderCourseGrid() {
    const grid = document.getElementById("course-grid");
    grid.innerHTML = courses
      .map(
        (c) => `
      <div class="course-card" data-id="${c.id}">
        <img class="course-thumb" src="${c.image}" alt="${c.title}">
        <div class="course-top">
          <span class="course-icon">${c.icon}</span>
          <span class="badge ${c.price === 0 ? "badge-free" : "badge-paid"}">${priceLabel(c.price)}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="desc">${c.desc}</p>
        <p class="course-meta">${c.level} • ${c.lessons.length} modules</p>
        <div class="course-actions">
          <button class="btn btn-ghost view-btn" data-id="${c.id}">View details</button>
          <button class="btn btn-primary add-btn" data-id="${c.id}">
            ${c.price === 0 ? "Enroll Free" : "Add to cart"}
          </button>
        </div>
      </div>`
      )
      .join("");

    grid.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".view-btn");
      const addBtn = e.target.closest(".add-btn");
      if (viewBtn) openModal(viewBtn.dataset.id);
      if (addBtn) addToCart(addBtn.dataset.id);
    });
  }

  function openModal(courseId) {
    const c = byId(courseId);
    const modal = document.getElementById("course-modal");
    const body = document.getElementById("modal-body");
    body.innerHTML = `
      <img class="modal-thumb" src="${c.image}" alt="${c.title}">
      <h3>${c.title}</h3>
      <p class="price-line">${c.level} • <span class="price">${priceLabel(c.price)}</span></p>
      <p>${c.desc}</p>
      <h4>What you'll learn</h4>
      ${c.lessons
        .map(
          (l, i) => `<div class="lesson"><span>${l}</span><span class="dur">Module ${i + 1}</span></div>`
        )
        .join("")}
      <div class="course-actions" style="margin-top:1.4rem">
        <button class="btn btn-primary btn-wide modal-add-btn" data-id="${c.id}">
          ${c.price === 0 ? "Enroll Free" : "Add to cart — " + priceLabel(c.price)}
        </button>
      </div>
    `;
    body.querySelector(".modal-add-btn").addEventListener("click", () => {
      addToCart(c.id);
      closeModal();
    });
    modal.classList.add("open");
  }

  function closeModal() {
    document.getElementById("course-modal").classList.remove("open");
  }

  function initModal() {
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("course-modal").addEventListener("click", (e) => {
      if (e.target.id === "course-modal") closeModal();
    });
  }

  /* 6. CART                                                           */

  function addToCart(courseId) {
    if (state.cart.includes(courseId)) {
      openCart();
      return;
    }
    state.cart.push(courseId);
    renderCart();
    openCart();
  }

  function removeFromCart(courseId) {
    state.cart = state.cart.filter((id) => id !== courseId);
    renderCart();
  }

  function renderCart() {
    const itemsEl = document.getElementById("cart-items");
    const countEl = document.getElementById("cart-count");
    const totalEl = document.getElementById("cart-total");

    countEl.textContent = state.cart.length;

    if (state.cart.length === 0) {
      itemsEl.innerHTML = `<p class="cart-empty">Your cart is empty. Browse courses and add one to get started.</p>`;
      totalEl.textContent = "$0";
      return;
    }

    let total = 0;
    itemsEl.innerHTML = state.cart
      .map((id) => {
        const c = byId(id);
        total += c.price;
        return `
        <div class="cart-item" data-id="${c.id}">
          <span class="name">${c.title}</span>
          <span class="price">${priceLabel(c.price)}</span>
          <button class="rm" data-id="${c.id}">Remove</button>
        </div>`;
      })
      .join("");
    totalEl.textContent = "$" + total;

    itemsEl.querySelectorAll(".rm").forEach((btn) =>
      btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
    );
  }

  function openCart() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("drawer-backdrop").classList.add("open");
  }

  function closeCart() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("drawer-backdrop").classList.remove("open");
  }

  function initCart() {
    document.getElementById("cart-btn").addEventListener("click", openCart);
    document.getElementById("cart-close").addEventListener("click", closeCart);
    document.getElementById("drawer-backdrop").addEventListener("click", closeCart);

    document.getElementById("checkout-btn").addEventListener("click", () => {
      if (state.cart.length === 0) return;
      const itemsEl = document.getElementById("cart-items");
      itemsEl.innerHTML = `<p class="cart-empty">✓ Order confirmed! This is a demo checkout — no real payment was made.</p>`;
      document.getElementById("cart-total").textContent = "$0";
      state.cart = [];
      document.getElementById("cart-count").textContent = "0";
      setTimeout(closeCart, 1800);
    });

    renderCart();
  }

  /* 7. REGISTRATION + CONTACT FORMS                                   */

  function initForms() {
    const regSelect = document.getElementById("reg-course-select");
    regSelect.innerHTML =
      `<option value="">Select a course</option>` +
      courses.map((c) => `<option value="${c.id}">${c.title} — ${priceLabel(c.price)}</option>`).join("");

    document.getElementById("registration-form").addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("reg-confirm").classList.remove("hidden");
      e.target.reset();
    });

    document.getElementById("contact-form").addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("contact-confirm").classList.remove("hidden");
      e.target.reset();
    });
  }

  /* 8. INIT                                                           */
  document.addEventListener("DOMContentLoaded", () => {
    initOnboarding();
    initNavbar();
    renderCourseGrid();
    initModal();
    initCart();
    initForms();
  });
})();