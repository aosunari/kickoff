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

// 制作実績スライダー（スワイプ対応版）
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

    // スワイプ用の変数
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTransform = 0;

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

    // スライド移動
    function updateSlider(smooth = true) {
        requestAnimationFrame(() => {
            const slideWidth = 100 / slidesPerView;
            if (smooth) {
                slider.style.transition = 'transform 0.5s ease';
            } else {
                slider.style.transition = 'none';
            }
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

    // タッチスタート
    function handleTouchStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        startTransform = currentSlide;
        slider.style.transition = 'none';
    }

    // タッチムーブ
    function handleTouchMove(e) {
        // タッチムーブ（改善版）
let initialMoveX = null;
let initialMoveY = null;
let isHorizontalSwipe = null;

function handleTouchStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    startTransform = currentSlide;

    // 初期化
    initialMoveX = null;
    initialMoveY = null;
    isHorizontalSwipe = null;
}

function handleTouchMove(e) {
    if (!isDragging) return;

    currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const currentY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;

    // 最初の移動で方向を判定
    if (initialMoveX === null) {
        initialMoveX = currentX;
        initialMoveY = currentY;
        return;
    }

    // 方向判定（一度だけ）
    if (isHorizontalSwipe === null) {
        const diffX = Math.abs(startX - currentX);
        const diffY = Math.abs(e.touches[0].clientY - initialMoveY);

        // 横移動が縦移動より大きければ横スワイプと判定
        isHorizontalSwipe = diffX > diffY;

        // 縦スクロールの場合はドラッグをキャンセル
        if (!isHorizontalSwipe) {
            isDragging = false;
            return;
        }
    }

    // 横スワイプの場合のみ処理
    if (isHorizontalSwipe) {
        e.preventDefault(); // 横スワイプ時のみスクロール防止

        const diff = startX - currentX;
        const slideWidth = slider.offsetWidth / slidesPerView;
        const movePercent = (diff / slideWidth) * 100 / slidesPerView;

        requestAnimationFrame(() => {
            const newTransform = -(startTransform * 100 / slidesPerView + movePercent);
            slider.style.transform = `translateX(${newTransform}%) translateZ(0)`;
        });
    }
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    // 横スワイプだった場合のみスライド切り替え
    if (isHorizontalSwipe) {
        const diff = startX - currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSlide < maxSlide) {
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                currentSlide--;
            }
        }
    }

    updateSlider();

    // リセット
    isHorizontalSwipe = null;
}
    }

    // タッチエンド
    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const diff = startX - currentX;
        const threshold = 50; // スワイプ判定の閾値（ピクセル）

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSlide < maxSlide) {
                // 左スワイプ（次へ）
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                // 右スワイプ（前へ）
                currentSlide--;
            }
        }

        updateSlider();
    }

    // イベントリスナー（ボタン）
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // イベントリスナー（スワイプ - タッチデバイス）
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });

    // イベントリスナー（スワイプ - マウス）
    slider.addEventListener('mousedown', handleTouchStart);
    slider.addEventListener('mousemove', handleTouchMove);
    slider.addEventListener('mouseup', handleTouchEnd);
    slider.addEventListener('mouseleave', handleTouchEnd);

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