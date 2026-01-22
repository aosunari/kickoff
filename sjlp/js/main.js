// ヒーロー背景スライダー
function initHeroSlider() {
  const backgrounds = document.querySelectorAll(".hero-bg");
  let currentBg = 0;

  function changeBackground() {
    backgrounds[currentBg].classList.remove("active");
    currentBg = (currentBg + 1) % backgrounds.length;
    backgrounds[currentBg].classList.add("active");
  }

  // 2秒ごとに切り替え
  setInterval(changeBackground, 2000);
}

// 銘柄スライダー
function initBrandSlider() {
  const slider = document.querySelector(".brand-slider");
  const slides = document.querySelectorAll(".brand-slide");
  const prevBtn = document.querySelector(".slider-nav.prev");
  const nextBtn = document.querySelector(".slider-nav.next");
  const dotsContainer = document.querySelector(".slider-dots");

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slidesPerView = window.innerWidth > 768 ? 2 : 1;
  const maxSlide = totalSlides - slidesPerView;

  // ドットを作成
  function createDots() {
    dotsContainer.innerHTML = "";
    const dotsCount = Math.ceil(totalSlides / slidesPerView);
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add("slider-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i * slidesPerView));
      dotsContainer.appendChild(dot);
    }
  }

  // スライド移動
  function updateSlider() {
    const slideWidth = 100 / slidesPerView;
    slider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    updateDots();
  }

  // ドット更新
  function updateDots() {
    const dots = document.querySelectorAll(".slider-dot");
    dots.forEach((dot, index) => {
      dot.classList.remove("active");
      if (index === Math.floor(currentSlide / slidesPerView)) {
        dot.classList.add("active");
      }
    });
  }

  // 特定のスライドへ移動
  function goToSlide(slideIndex) {
    currentSlide = Math.min(Math.max(slideIndex, 0), maxSlide);
    updateSlider();
  }

  // 次へ
  function nextSlide() {
    if (currentSlide < maxSlide) {
      currentSlide++;
    } else {
      currentSlide = 0;
    }
    updateSlider();
  }

  // 前へ
  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = maxSlide;
    }
    updateSlider();
  }

  // イベントリスナー
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // ウィンドウリサイズ時の処理
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      location.reload(); // シンプルにリロード
    }, 250);
  });

  // 初期化
  createDots();
  updateSlider();
}

// FAQアコーディオン
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";

      // 全てのFAQを閉じる
      faqItems.forEach((otherItem) => {
        const otherQuestion = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        otherQuestion.setAttribute("aria-expanded", "false");
        otherAnswer.classList.remove("open");
      });

      // クリックされたFAQを開く（すでに開いている場合は閉じたまま）
      if (!isOpen) {
        question.setAttribute("aria-expanded", "true");
        answer.classList.add("open");
      }
    });
  });
}

// スクロールアニメーション
function initScrollAnimation() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    },
  );

  fadeElements.forEach((element) => {
    observer.observe(element);
  });
}

// スムーズスクロール
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", () => {
  initHeroSlider();
  initBrandSlider();
  initFAQ();
  initScrollAnimation();
  initSmoothScroll();
});
