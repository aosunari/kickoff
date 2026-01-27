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

// 制作実績スライダー
function initBrandSlider() {
    const slider = document.querySelector('.brand-slider');
    const slides = document.querySelectorAll('.brand-slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slidesPerView = window.innerWidth > 768 ? 2 : 1;
    let maxSlide = totalSlides - slidesPerView;

  function createDots() {
    dotsContainer.innerHTML = '';
    // slidesPerViewに応じてドット数を計算
    const dotsCount = Math.ceil(totalSlides / slidesPerView);
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i * slidesPerView));
        dotsContainer.appendChild(dot);
    }
}

    function updateSlider() {
        requestAnimationFrame(() => {
            const slideWidth = 100 / slidesPerView;
            // maxSlideを超えないように制限
            currentSlide = Math.min(currentSlide, maxSlide);
            slider.style.transform = `translateX(-${currentSlide * slideWidth}%) translateZ(0)`;
            updateDots();
        });
    }

    function updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === Math.floor(currentSlide / slidesPerView)) {
                dot.classList.add('active');
            }
        });
    }

    function goToSlide(slideIndex) {
        currentSlide = Math.min(Math.max(slideIndex, 0), maxSlide);
        updateSlider();
    }

    function nextSlide() {
        if (currentSlide < maxSlide) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = maxSlide;
        }
        updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // ウィンドウリサイズ時の処理
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // slidesPerViewとmaxSlideを再計算
            slidesPerView = window.innerWidth > 768 ? 2 : 1;
            maxSlide = totalSlides - slidesPerView;
            currentSlide = Math.min(currentSlide, maxSlide);
            createDots();
            updateSlider();
        }, 250);
    });

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


// メールフォーム設定
function initContactButtons() {
    const mailTo = 'contact@sakejpn.co.jp';
    const subject = 'デザイン制作の無料相談【株式会社SAKE JAPAN】';
    const body = `お問い合わせいただき、誠にありがとうございます。
お手数ではございますが、以下の事項をご記入の上、そのまま送信してください。

※「*」は必須項目です。

────────────────────
【貴社名】
　

【ご担当者名】*
　

【フリガナ】
　

【メールアドレス】*
　

【電話番号】
　

【郵便番号】
　

【ご住所】
　

【お問い合わせ内容】*
（デザイン制作のご相談内容をご記入ください）
・ブランドデザイン
・ラベルデザイン
・Webサイト／LP制作
・ロゴデザイン
・その他（　　　　　　　　　　　）
　

【制作対象・概要】
（商品名／ブランド名／サービス内容など）
　

【ご希望のイメージ・参考URL】
　

【ご希望納期】
　

【ご予算感（任意）】
　

【その他ご要望・補足】
　
────────────────────

送信いただいた内容を確認のうえ、
2営業日以内に担当者より順次ご連絡いたします。
今しばらくお待ちくださいませ。

────────────────────
株式会社SAKE JAPAN（サケジャパン）
〒101-0052
東京都千代田区神田小川町1−10−2 302
TEL：03-6260-7937
FAX：03-6260-7938
URL：https://sakejpn.co.jp
────────────────────

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝`;

    // URLエンコード
    const mailtoLink = `mailto:${mailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 両方のCTAボタンに適用
    const ctaButtons = document.querySelectorAll('#cta-contact-1, #cta-contact-2');
    ctaButtons.forEach(button => {
        button.href = mailtoLink;
    });
}

// ページ読み込み時の初期化に追加
document.addEventListener('DOMContentLoaded', () => {
    // モバイルブラウザのアドレスバー対策
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);

    // 既存の初期化処理
    initHeroSlider();
    initBrandSlider();
    initFAQ();
    initScrollAnimation();
    initSmoothScroll();
    optimizeScroll();
    initContactButtons(); // ←これを追加

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});