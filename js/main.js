/*INDEX.HTML*/
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Outfit"', "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#006CA5",
          darkblue: "#004C74",
          yellow: "#FFC20E",
          gold: "#D4A000",
          gray: "#f1f5f9",
        },
      },
      animation: {
        "pulse-custom":
          "pulse-glow 2.5s infinite cubic-bezier(0.33, 1, 0.68, 1)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(255, 194, 14, 0.4)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 20px 0 rgba(255, 194, 14, 0.7)",
          },
        },
      },
    },
  },
};
// Sistema de controle do preloader
document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.getElementById("preloader");
  const logoPath = document.getElementById("logo-path");

  // Verificar se já vimos o preloader nesta sessão
  // Usamos sessionStorage que dura apenas durante a sessão do navegador
  // Se recarregar a página, a animação aparece novamente
  // Mas se navegar para outra página e voltar, não aparece

  const hasSeenPreloader = sessionStorage.getItem("preloaderShown");
  const isPageRefresh = performance.navigation.type === 1; // 1 = página recarregada

  // Se for um refresh ou primeira visita, mostrar o preloader
  // Se for navegação entre páginas (voltar/avançar), não mostrar
  if (isPageRefresh || !hasSeenPreloader) {
    // Mostrar preloader
    preloader.classList.remove("hidden");
    document.body.classList.add("preloader-active");

    // Função para easing suave
    function customEase(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // Calcular o comprimento do traço
    const pathLength = logoPath.getTotalLength();
    logoPath.style.strokeDasharray = pathLength;
    logoPath.style.strokeDashoffset = pathLength;

    // Adicionar classe de animação ao contorno
    logoPath.classList.add("animating");

    // Configurações da animação
    const drawDuration = 2800;
    const fillDelay = 300;
    const fillDuration = 1800;

    let startTime = null;

    function animatePreloader(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / drawDuration, 1);

      // Aplicar easing personalizado
      const easedProgress = customEase(progress);

      // Atualizar stroke-dashoffset
      const dashOffset = pathLength - pathLength * easedProgress;
      logoPath.style.strokeDashoffset = dashOffset;

      if (progress < 1) {
        requestAnimationFrame(animatePreloader);
      } else {
        // Remover classe de animação do contorno
        logoPath.classList.remove("animating");

        // Iniciar animação de preenchimento após um breve delay
        setTimeout(() => {
          // Adicionar classe para animação de preenchimento
          logoPath.classList.add("filling");

          // Após a animação, remover o preloader
          setTimeout(() => {
            preloader.classList.add("hidden");
            document.body.classList.remove("preloader-active");

            // Marcar que o preloader já foi mostrado nesta sessão
            sessionStorage.setItem("preloaderShown", "true");

            // Ativar animações de scroll após o preloader
            if (typeof observer !== "undefined") {
              document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
                observer.observe(el);
              });
            }
          }, fillDuration + 300);
        }, fillDelay);
      }
    }

    // Iniciar animação
    requestAnimationFrame(animatePreloader);

    // Fallback: remover preloader após 5 segundos
    setTimeout(() => {
      if (!preloader.classList.contains("hidden")) {
        preloader.classList.add("hidden");
        document.body.classList.remove("preloader-active");
        sessionStorage.setItem("preloaderShown", "true");
      }
    }, 5000);
  } else {
    // Se já vimos o preloader, apenas ativar as animações de scroll
    setTimeout(() => {
      if (typeof observer !== "undefined") {
        document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
          observer.observe(el);
        });
      }
    }, 100);
  }
});

// Tema Dark/Light
if (localStorage.theme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleBtnMobile = document.getElementById("theme-toggle-mobile");
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;
const themeIconMobile = themeToggleBtnMobile
  ? themeToggleBtnMobile.querySelector("i")
  : null;
const html = document.documentElement;

function updateIcon() {
  if (html.classList.contains("dark")) {
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    }
    if (themeIconMobile) {
      themeIconMobile.classList.remove("fa-moon");
      themeIconMobile.classList.add("fa-sun");
    }
  } else {
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
    if (themeIconMobile) {
      themeIconMobile.classList.remove("fa-sun");
      themeIconMobile.classList.add("fa-moon");
    }
  }
}

updateIcon();

function toggleTheme() {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.theme = "dark";
  } else {
    localStorage.theme = "light";
  }
  updateIcon();
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

if (themeToggleBtnMobile) {
  themeToggleBtnMobile.addEventListener("click", toggleTheme);
}

// Menu Mobile
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    const icon = mobileMenuToggle.querySelector("i");
    if (mobileMenu.classList.contains("open")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });

  // Fechar menu ao clicar em um link
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      const icon = mobileMenuToggle.querySelector("i");
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    });
  });
}

const canvas = document.getElementById("header-canvas");
const ctx = canvas.getContext("2d");
let particlesArray;

function setCanvasSize() {
  const header = document.querySelector("header");
  canvas.width = window.innerWidth;
  canvas.height = header.offsetHeight;
}

window.addEventListener("resize", () => {
  setCanvasSize();
  initParticles();
});
setCanvasSize();

let mouse = {
  x: null,
  y: null,
  radius: 100,
};

window.addEventListener("mousemove", function (event) {
  const headerRect = document.querySelector("header").getBoundingClientRect();
  if (event.y <= headerRect.height) {
    mouse.x = event.x;
    mouse.y = event.y;
  } else {
    mouse.x = null;
    mouse.y = null;
  }
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#FFFFFF";
    ctx.globalAlpha = 0.3;
    ctx.fill();
  }
  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 10;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 10;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 10;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 10;
        }
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function initParticles() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 3 + 1;
    let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 1 - 0.5;
    let directionY = Math.random() * 1 - 0.5;

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, "#FFFFFF"),
    );
  }
}

function animateParticles() {
  requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connectParticles();
}

function connectParticles() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);

      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        ctx.strokeStyle = "rgba(255, 255, 255," + opacityValue * 0.15 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

initParticles();
animateParticles();

const progressBar = document.getElementById("reading-progress");
window.addEventListener("scroll", () => {
  const windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  progressBar.style.width = scrolled + "%";
});

const backToTopButton = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar elementos de animação
setTimeout(() => {
  document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}, 100);

/*PROJETOS.HTML*/
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Outfit"', "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#006CA5",
          darkblue: "#004C74",
          yellow: "#FFC20E",
          gold: "#D4A000",
          gray: "#f8fafc",
        },
      },
    },
  },
};
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

/*EQUIPE.HTML*/
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Outfit"', "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#006CA5",
          darkblue: "#004C74",
          yellow: "#FFC20E",
          gold: "#D4A000",
          gray: "#f8fafc",
        },
      },
    },
  },
};

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
