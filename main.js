document.addEventListener("DOMContentLoaded", function () {
  
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.1 };
  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  

  let backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) {
    backToTopBtn = document.createElement("button");
    backToTopBtn.id = "back-to-top";
    backToTopBtn.className = "back-to-top";
    backToTopBtn.innerText = "↑";
    document.body.appendChild(backToTopBtn);
  }

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  
  let toggleBtn = document.getElementById("dark-mode-toggle");
  if (!toggleBtn) {
    toggleBtn = document.createElement("button");
    toggleBtn.id = "dark-mode-toggle";
    toggleBtn.className = "toggle-dark";
    document.body.appendChild(toggleBtn);
  }

  function setDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add("dark-mode");
      toggleBtn.innerText = "☀️";
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      toggleBtn.innerText = "🌙";
      localStorage.setItem("darkMode", "disabled");
    }
  }


  const savedMode = localStorage.getItem("darkMode");
  setDarkMode(savedMode === "enabled");

  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    setDarkMode(!isDark);
  });


  const welcomeMessages = [
    "Welcome to my portfolio!",
    "Hello! Glad you're here.",
    "Explore my projects and skills.",
    "Let's build something amazing!",
    "Passionate about data and tech."
  ];
  const welcomeEl = document.getElementById("welcome-message");
  let currentMsgIndex = 0;

  function typeEffect(text, element, speed = 50, callback) {
    let i = 0;
    element.textContent = "";
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) callback();
    }
    type();
  }

  function rotateWelcomeMessage() {
    if (!welcomeEl) return;
    typeEffect(welcomeMessages[currentMsgIndex], welcomeEl, 50, () => {
      setTimeout(() => {
        welcomeEl.textContent = "";
        currentMsgIndex = (currentMsgIndex + 1) % welcomeMessages.length;
        rotateWelcomeMessage();
      }, 2500);
    });
  }
  rotateWelcomeMessage();

  // --- فلترة المشاريع ---
  const filters = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      cards.forEach(card => {
        card.style.display = (type === "all" || card.classList.contains(type)) ? "block" : "none";
      });
    });
  });


  const allFloatables = document.querySelectorAll(".project-card, .experience-block, .experience-item");
  allFloatables.forEach(el => {
    if (!el.querySelector("p[data-auto-desc]")) {
      const desc = el.getAttribute("data-desc") || "";
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc;
        p.setAttribute("data-auto-desc", "true");
        p.style.marginTop = "10px";
        p.style.fontStyle = "italic";
        p.style.color = "#555";
        el.appendChild(p);
      }
    }
  });

 
  const floatElements = document.querySelectorAll(".project-card, .experience-block, .dashboard-card");
  floatElements.forEach(el => {
    el.style.animation = "floatCard 4s ease-in-out infinite";
    el.style.transition = "transform 0.4s ease";
    el.addEventListener("mouseenter", () => {
      el.style.animationPlayState = "paused";
      el.style.transform = "scale(1.05)";
      el.style.zIndex = "10";
      el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.animationPlayState = "running";
      el.style.transform = "none";
      el.style.zIndex = "0";
      el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.07)";
    });
  });


  cards.forEach(card => {
    card.addEventListener("click", e => {
      e.stopPropagation();
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      if (document.querySelector(".modal")) return;

      const modal = document.createElement("div");
      modal.className = "modal";

      const title = card.querySelector("h3")?.innerText || "Project";
      const desc = card.querySelector("p")?.innerText || "";
      const link = card.querySelector("a")?.outerHTML || "";

      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <h3>${title}</h3>
          <p>${desc}</p>
          ${link}
        </div>`;

      document.body.appendChild(modal);

      modal.querySelector(".close").onclick = () => modal.remove();
      modal.addEventListener("click", e => {
        if (e.target === modal) modal.remove();
      });
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".project-card")) {
      cards.forEach(c => c.classList.remove("active"));
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll("#hackathon-slider .hackathon-slide");
  const prevBtn = document.getElementById("prev-hackathon");
  const nextBtn = document.getElementById("next-hackathon");
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });


  showSlide(currentIndex);
});

document.addEventListener("DOMContentLoaded", () => {
  const hackathons = [
    {
      title: "DATA X App – NASA Space Apps",
      description: "Second place winning project using Earth Observation data for sustainability.",
      img: "files/datax-app.jpg",
      pdf: "files/datax-app.pdf"
    },
    {
      title: "SpaceUp Application Hackathon – Data World App",
      description: "Developed an analytics platform using EO and IoT to monitor afforestation and support the Saudi Green Initiative.",
      img: "files/spaceup.jpg",
      pdf: "files/spaceup.pdf"
    },
    {
      title: "Google Hackathon – Distance in Education",
      description: "Presented a solution for transforming distance learning during the Covid-19 pandemic.",
      img: "files/google-education.jpg",
      pdf: "files/google-education.pdf"
    },
    {
      title: "DaVita – Anomaly Detection for Hemodialysis IoT Data",
      description: "Built a system to detect anomalies in IoT data from hemodialysis machines to improve patient safety.",
      img: "files/davita-anomaly.jpg",
      pdf: "files/davita-anomaly.pdf"
    }
  ];

  let currentIndex = 0;

  const hackathonCard = document.querySelector(".hackathon-card");
  const imgEl = hackathonCard.querySelector("img");
  const titleEl = hackathonCard.querySelector("h3");
  const descEl = hackathonCard.querySelector("p");
  const downloadBtn = hackathonCard.querySelector(".download-btn");

  function showHackathon(index) {
    const hackathon = hackathons[index];
    imgEl.src = hackathon.img;
    imgEl.alt = hackathon.title;
    titleEl.textContent = hackathon.title;
    descEl.textContent = hackathon.description;
    downloadBtn.href = hackathon.pdf;
  }

  document.getElementById("prev-btn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + hackathons.length) % hackathons.length;
    showHackathon(currentIndex);
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % hackathons.length;
    showHackathon(currentIndex);
  });

  showHackathon(currentIndex);
});

const hackathons = [
  {
    title: "DATA X App – NASA Space Apps",
    date: "October 2024",
    description: "Second place winning project that utilizes Earth Observation (EO) data to support smart decision-making aligned with sustainability goals.",
    image: "files/datax-app.jpg",
    file: "files/datax-app.pdf"
  },
  {
    title: "SpaceUp Application Hackathon – Data World App",
    date: "May 2025",
    description: "Developed an analytics platform using EO and IoT to monitor afforestation and support the Saudi Green Initiative through real-time insights.",
    image: "files/spaceup.jpg",
    file: "files/spaceup.pdf"
  },
  {
    title: "Google Hackathon – Distance in Education",
    date: "May 2024",
    description: "Presented a solution for transforming distance learning during the Covid-19 pandemic to ensure safety and continuity in education.",
    image: "files/google-education.jpg",
    file: "files/google-education.pdf"
  },
  {
    title: "DaVita – Anomaly Detection for Hemodialysis IoT Data",
    date: "May 2024",
    description: "Built a system to detect anomalies in IoT data from hemodialysis machines to improve patient safety and treatment accuracy.",
    image: "files/davita-anomaly.jpg",
    file: "files/davita-anomaly.pdf"
  }
];

let currentIndex = 0;

const container = document.getElementById("hackathon-cards-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

function renderHackathon(index) {
  const hackathon = hackathons[index];
  container.innerHTML = `
    <div class="hackathon-card">
      <img src="${hackathon.image}" alt="${hackathon.title}" />
      <h3>${hackathon.title}</h3>
      <p><em>${hackathon.date}</em></p>
      <p>${hackathon.description}</p>
      <a href="${hackathon.file}" download class="download-btn">Download.pdf</a>
    </div>
  `;
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + hackathons.length) % hackathons.length;
  renderHackathon(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % hackathons.length;
  renderHackathon(currentIndex);
});


renderHackathon(currentIndex);