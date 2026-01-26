// パフォーマンス最適化のための設定
let ticking = false;
let lastScrollY = 0;

// ヒーロー背景スライダー
function initHeroSlider() {
    const backgrounds = document.querySelectorAll('.hero-bg');
    let currentBg = 0;

    function changeBackground() {
        // スムーズな切り替えのためにrequestAnimationFrameを使用
        requestAnimationFrame(() => {
            backgrounds[currentBg].classList.remove('active');
            currentBg = (currentBg + 1) % backgrounds.length;
            backgrounds[currentBg].classList.add('active');
        });
    }

    setInterval(changeBackground, 3500);
}

// 銘柄スライダー
function initBrandSlider() {
    const slider = document.querySelector('.brand-slider');
    const slides = document.querySelectorAll('.brand-slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slidesPerView = window.innerWidth > 768 ? 2 : 1;
    const maxSlide = totalSlides - slidesPerView;

    // ドットを作成
    function createDots() {
        dotsContainer.innerHTML = '';
        const dotsCount = Math.ceil(totalSlides / slidesPerView);
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i * slidesPerView));
            dotsContainer.appendChild(dot);
        }
    }

    // スライド移動（requestAnimationFrameを使用）
    function updateSlider() {
        requestAnimationFrame(() => {
            const slideWidth = 100 / slidesPerView;
            slider.style.transform = `translateX(-${currentSlide * slideWidth}%) translateZ(0)`;
            updateDots();
        });
    }

    // ドット更新
    function updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === Math.floor(currentSlide / slidesPerView)) {
                dot.classList.add('active');
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
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 初期化
    createDots();
    updateSlider();
}

// FAQアコーディオン
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';

            // requestAnimationFrameを使用してスムーズに
            requestAnimationFrame(() => {
                // 全てのFAQを閉じる
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('open');
                });

                // クリックされたFAQを開く（すでに開いている場合は閉じたまま）
                if (!isOpen) {
                    question.setAttribute('aria-expanded', 'true');
                    answer.classList.add('open');
                }
            });
        });
    });
}

// スクロールアニメーション（最適化版）
function initScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');

    // Intersection Observer APIを使用（パフォーマンス最適化）
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // requestAnimationFrameを使用してスムーズに
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
                // 一度表示されたら監視を解除（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// スムーズスクロール
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                // スムーズスクロール
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// スクロールイベントの最適化（throttle）
function optimizeScroll() {
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // ここでスクロール関連の処理を実行
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 初期化処理
    initHeroSlider();
    initBrandSlider();
    initFAQ();
    initScrollAnimation();
    initSmoothScroll();
    optimizeScroll();

    // ページ読み込み完了後の最適化
    window.addEventListener('load', () => {
        // すべてのリソースが読み込まれた後に実行
        document.body.style.opacity = '1';
    });
});