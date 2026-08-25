<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <meta
        name="description"
        content="Premium technology storefront - Chaos Playground"
    />

    <title>Apple Store — Chaos Playground</title>

    <style>
        :root {
            --bg: #ffffff;
            --surface: #f5f5f7;
            --surface-2: #fbfbfd;
            --text: #1d1d1f;
            --muted: #6e6e73;
            --blue: #0071e3;
            --blue-hover: #0077ed;
            --border: rgba(0, 0, 0, 0.08);
            --danger: #d70015;
            --success: #248a3d;
            --shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
            --radius: 28px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "SF Pro Display",
                "SF Pro Text",
                "Helvetica Neue",
                Arial,
                sans-serif;
            color: var(--text);
            background: var(--bg);
            line-height: 1.45;
            -webkit-font-smoothing: antialiased;
        }

        button,
        input,
        select {
            font: inherit;
        }

        button {
            border: 0;
            cursor: pointer;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        /* =========================
           NAVIGATION
        ========================== */

        .nav {
            position: sticky;
            top: 0;
            z-index: 1000;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.86);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border);
        }

        .nav-inner {
            width: min(1024px, calc(100% - 32px));
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.03em;
        }

        .brand-icon {
            width: 20px;
            height: 20px;
            border-radius: 50% 50% 48% 48%;
            background: #111;
            position: relative;
        }

        .brand-icon::after {
            content: "";
            position: absolute;
            width: 7px;
            height: 4px;
            background: #111;
            border-radius: 100%;
            top: -3px;
            right: 1px;
            transform: rotate(-25deg);
        }

        .nav-links {
            display: flex;
            gap: 30px;
            align-items: center;
            color: #333;
            font-size: 13px;
        }

        .nav-links button {
            background: transparent;
            color: inherit;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .icon-button {
            width: 34px;
            height: 34px;
            display: grid;
            place-items: center;
            background: transparent;
            border-radius: 50%;
            position: relative;
        }

        .icon-button:hover {
            background: var(--surface);
        }

        .cart-count {
            position: absolute;
            top: -2px;
            right: -3px;
            min-width: 17px;
            height: 17px;
            padding: 0 4px;
            display: grid;
            place-items: center;
            border-radius: 99px;
            background: var(--blue);
            color: white;
            font-size: 10px;
            font-weight: 700;
        }

        /* =========================
           HERO
        ========================== */

        .hero {
            min-height: 680px;
            background:
                radial-gradient(
                    circle at 50% 25%,
                    rgba(255,255,255,0.2),
                    transparent 30%
                ),
                linear-gradient(135deg, #0b0b0d, #1d1d20 50%, #09090a);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        .hero::before {
            content: "";
            position: absolute;
            width: 650px;
            height: 650px;
            border-radius: 50%;
            background:
                radial-gradient(
                    circle,
                    rgba(70, 100, 255, 0.28),
                    transparent 65%
                );
            filter: blur(25px);
            transform: translateY(120px);
        }

        .hero-content {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 100px 20px;
        }

        .eyebrow {
            font-size: 19px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #bdbdc2;
        }

        .hero h1 {
            font-size: clamp(48px, 8vw, 88px);
            line-height: 0.98;
            letter-spacing: -0.065em;
            margin-bottom: 24px;
        }

        .hero p {
            max-width: 620px;
            margin: auto;
            color: #c7c7cc;
            font-size: clamp(17px, 2vw, 22px);
        }

        .hero-buttons {
            margin-top: 32px;
            display: flex;
            justify-content: center;
            gap: 14px;
        }

        .button-primary {
            background: var(--blue);
            color: white;
            border-radius: 999px;
            padding: 12px 22px;
            font-weight: 500;
        }

        .button-primary:hover {
            background: var(--blue-hover);
        }

        .button-secondary {
            color: var(--blue);
            background: transparent;
            padding: 12px 22px;
            font-weight: 500;
        }

        /* =========================
           STORE
        ========================== */

        .store {
            width: min(1200px, calc(100% - 32px));
            margin: auto;
            padding: 90px 0;
        }

        .section-heading {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 30px;
            margin-bottom: 42px;
        }

        .section-heading h2 {
            font-size: clamp(38px, 5vw, 58px);
            line-height: 1;
            letter-spacing: -0.055em;
        }

        .section-heading p {
            color: var(--muted);
            max-width: 380px;
        }

        .toolbar {
            display: flex;
            gap: 12px;
            margin-bottom: 35px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 220px;
            position: relative;
        }

        .search-box input {
            width: 100%;
            height: 48px;
            border: 1px solid var(--border);
            background: var(--surface);
            border-radius: 14px;
            padding: 0 18px 0 44px;
            outline: none;
        }

        .search-box input:focus {
            border-color: rgba(0, 113, 227, 0.5);
            box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
        }

        .search-icon {
            position: absolute;
            left: 16px;
            top: 14px;
            color: var(--muted);
        }

        .filter {
            height: 48px;
            border: 1px solid var(--border);
            background: var(--surface);
            border-radius: 14px;
            padding: 0 16px;
            color: var(--text);
            outline: none;
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
        }

        .product-card {
            background: var(--surface);
            border-radius: var(--radius);
            overflow: hidden;
            transition:
                transform 0.25s ease,
                box-shadow 0.25s ease;
        }

        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .product-image {
            height: 330px;
            display: grid;
            place-items: center;
            position: relative;
            overflow: hidden;
        }

        .product-image::after {
            content: "";
            position: absolute;
            width: 190px;
            height: 190px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            filter: blur(25px);
        }

        .phone {
            width: 135px;
            height: 260px;
            border-radius: 28px;
            background:
                linear-gradient(
                    135deg,
                    #202124,
                    #60636a
                );
            border: 4px solid #111;
            box-shadow:
                0 35px 50px rgba(0,0,0,0.4),
                inset 0 0 0 1px rgba(255,255,255,0.3);
            position: relative;
            z-index: 1;
        }

        .phone::before {
            content: "";
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 45px;
            height: 15px;
            border-radius: 20px;
            background: #050505;
        }

        .laptop {
            width: 270px;
            height: 170px;
            border-radius: 13px 13px 5px 5px;
            background: linear-gradient(135deg, #d8d8db, #73767d);
            border: 5px solid #6c6d70;
            box-shadow: 0 30px 45px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }

        .laptop::after {
            content: "";
            position: absolute;
            bottom: -18px;
            left: -25px;
            width: 310px;
            height: 18px;
            border-radius: 0 0 20px 20px;
            background: #b5b6b9;
        }

        .tablet {
            width: 230px;
            height: 310px;
            border-radius: 22px;
            background: linear-gradient(145deg, #b4b6ba, #33353a);
            border: 5px solid #292a2d;
            box-shadow: 0 30px 50px rgba(0,0,0,0.35);
            position: relative;
            z-index: 1;
        }

        .watch {
            width: 150px;
            height: 185px;
            border-radius: 35px;
            background: linear-gradient(135deg, #4e5157, #111);
            border: 6px solid #242528;
            box-shadow: 0 30px 45px rgba(0,0,0,0.4);
            position: relative;
            z-index: 1;
        }

        .watch::before {
            content: "";
            position: absolute;
            inset: 24px;
            border-radius: 24px;
            background: #050505;
        }

        .airpods {
            width: 170px;
            height: 160px;
            position: relative;
            z-index: 1;
        }

        .airpods::before,
        .airpods::after {
            content: "";
            position: absolute;
            width: 45px;
            height: 115px;
            background: linear-gradient(#fff, #d5d5d7);
            border-radius: 30px;
            top: 25px;
        }

        .airpods::before {
            left: 25px;
            transform: rotate(7deg);
        }

        .airpods::after {
            right: 25px;
            transform: rotate(-7deg);
        }

        .product-info {
            padding: 25px;
        }

        .product-info h3 {
            font-size: 26px;
            letter-spacing: -0.035em;
            margin-bottom: 7px;
        }

        .product-description {
            color: var(--muted);
            min-height: 46px;
            font-size: 14px;
        }

        .product-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
        }

        .price {
            font-size: 17px;
            font-weight: 600;
        }

        .add-button {
            background: var(--blue);
            color: white;
            padding: 9px 16px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 500;
        }

        .add-button:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        .stock {
            font-size: 12px;
            margin-top: 8px;
            color: var(--muted);
        }

        .stock.low {
            color: #b25a00;
        }

        .stock.out {
            color: var(--danger);
        }

        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 100px 20px;
            color: var(--muted);
        }

        /* =========================
           FEATURE BANNER
        ========================== */

        .feature {
            width: min(1200px, calc(100% - 32px));
            margin: 0 auto 90px;
            background: #f5f5f7;
            border-radius: 34px;
            padding: 70px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            overflow: hidden;
        }

        .feature h2 {
            font-size: clamp(40px, 5vw, 62px);
            letter-spacing: -0.06em;
            line-height: 1;
        }

        .feature p {
            color: var(--muted);
            margin-top: 20px;
            max-width: 450px;
        }

        .feature-device {
            height: 350px;
            display: grid;
            place-items: center;
        }

        .feature-device .laptop {
            transform: rotate(-5deg);
        }

        /* =========================
           CART DRAWER
        ========================== */

        .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(5px);
            z-index: 2000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
        }

        .overlay.open {
            opacity: 1;
            pointer-events: auto;
        }

        .cart-drawer {
            position: fixed;
            right: 0;
            top: 0;
            width: min(480px, 100%);
            height: 100%;
            background: white;
            z-index: 2100;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            box-shadow: -20px 0 60px rgba(0,0,0,0.12);
        }

        .cart-drawer.open {
            transform: translateX(0);
        }

        .drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px;
            border-bottom: 1px solid var(--border);
        }

        .drawer-header h2 {
            font-size: 28px;
            letter-spacing: -0.04em;
        }

        .drawer-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .cart-item {
            display: grid;
            grid-template-columns: 70px 1fr auto;
            gap: 14px;
            padding: 16px 0;
            border-bottom: 1px solid var(--border);
        }

        .mini-image {
            width: 70px;
            height: 70px;
            border-radius: 16px;
            background: var(--surface);
            display: grid;
            place-items: center;
        }

        .mini-device {
            width: 27px;
            height: 52px;
            border-radius: 8px;
            background: linear-gradient(135deg,#222,#777);
        }

        .cart-item h4 {
            font-size: 15px;
            margin-bottom: 4px;
        }

        .cart-item p {
            color: var(--muted);
            font-size: 13px;
        }

        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 9px;
        }

        .quantity-controls button {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background: var(--surface);
        }

        .drawer-footer {
            border-top: 1px solid var(--border);
            padding: 22px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 18px;
        }

        .checkout-button {
            width: 100%;
            padding: 15px;
            border-radius: 14px;
            background: #111;
            color: white;
            font-weight: 600;
        }

        /* =========================
           CHECKOUT
        ========================== */

        .modal {
            position: fixed;
            inset: 0;
            z-index: 3000;
            display: grid;
            place-items: center;
            padding: 20px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .modal.open {
            opacity: 1;
            pointer-events: auto;
        }

        .modal-card {
            width: min(720px, 100%);
            max-height: 90vh;
            overflow-y: auto;
            background: white;
            border-radius: 28px;
            box-shadow: var(--shadow);
            padding: 34px;
            transform: translateY(20px);
            transition: transform 0.25s ease;
        }

        .modal.open .modal-card {
            transform: translateY(0);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
        }

        .modal-header h2 {
            font-size: 36px;
            letter-spacing: -0.05em;
        }

        .close-button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--surface);
            font-size: 20px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        .field.full {
            grid-column: 1 / -1;
        }

        .field label {
            font-size: 13px;
            color: var(--muted);
        }

        .field input,
        .field select {
            height: 46px;
            border: 1px solid #d2d2d7;
            border-radius: 10px;
            padding: 0 13px;
            outline: none;
        }

        .field input:focus,
        .field select:focus {
            border-color: var(--blue);
            box-shadow: 0 0 0 3px rgba(0,113,227,0.1);
        }

        .coupon-row {
            display: flex;
            gap: 10px;
            margin: 25px 0;
        }

        .coupon-row input {
            flex: 1;
            height: 46px;
            border: 1px solid #d2d2d7;
            border-radius: 10px;
            padding: 0 13px;
        }

        .coupon-row button {
            background: var(--surface);
            border-radius: 10px;
            padding: 0 18px;
        }

        .checkout-summary {
            background: var(--surface);
            border-radius: 18px;
            padding: 20px;
            margin: 25px 0;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .summary-line.total {
            font-size: 19px;
            font-weight: 700;
            border-top: 1px solid var(--border);
            padding-top: 15px;
            margin-top: 15px;
        }

        .pay-button {
            width: 100%;
            padding: 15px;
            border-radius: 14px;
            background: var(--blue);
            color: white;
            font-weight: 600;
        }

        .pay-button:disabled {
            opacity: 0.6;
        }

        .message {
            margin-top: 12px;
            padding: 12px 14px;
            border-radius: 10px;
            font-size: 13px;
            display: none;
        }

        .message.show {
            display: block;
        }

        .message.error {
            background: #fff0f0;
            color: var(--danger);
        }

        .message.success {
            background: #eef9f0;
            color: var(--success);
        }

        /* =========================
           TOAST
        ========================== */

        .toast-container {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 5000;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
        }

        .toast {
            background: rgba(30,30,30,0.94);
            color: white;
            padding: 12px 18px;
            border-radius: 999px;
            font-size: 14px;
            box-shadow: var(--shadow);
            animation: toastIn 0.25s ease;
        }

        @keyframes toastIn {
            from {
                transform: translateY(12px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* =========================
           FOOTER
        ========================== */

        footer {
            background: var(--surface);
            padding: 70px 20px;
            color: var(--muted);
        }

        .footer-inner {
            width: min(1000px, 100%);
            margin: auto;
        }

        .footer-brand {
            color: var(--text);
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 30px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
        }

        .footer-column h4 {
            color: var(--text);
            margin-bottom: 14px;
        }

        .footer-column a {
            display: block;
            margin-bottom: 9px;
            font-size: 13px;
        }

        /* =========================
           RESPONSIVE
        ========================== */

        @media (max-width: 850px) {
            .nav-links {
                display: none;
            }

            .product-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .feature {
                grid-template-columns: 1fr;
                padding: 45px 30px;
            }

            .feature-device {
                margin-top: 30px;
            }

            .section-heading {
                flex-direction: column;
                align-items: flex-start;
            }
        }

        @media (max-width: 600px) {
            .hero {
                min-height: 580px;
            }

            .product-grid {
                grid-template-columns: 1fr;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .field.full {
                grid-column: auto;
            }

            .modal-card {
                padding: 24px;
            }

            .footer-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
    </style>
</head>

<body>

<header class="nav">
    <div class="nav-inner">

        <button
            class="brand"
            id="brandButton"
            aria-label="Home"
        >
            <span class="brand-icon"></span>
            <span>Apple</span>
        </button>

        <nav class="nav-links">
            <button data-scroll="store">Store</button>
            <button data-scroll="products">Products</button>
            <button data-scroll="support">Support</button>
        </nav>

        <div class="nav-actions">
            <button
                class="icon-button"
                id="searchFocusButton"
                aria-label="Search"
            >
                ⌕
            </button>

            <button
                class="icon-button"
                id="cartButton"
                aria-label="Shopping bag"
            >
                ♧
                <span
                    class="cart-count"
                    id="cartCount"
                    aria-live="polite"
                >
                    0
                </span>
            </button>
        </div>

    </div>
</header>

<main>

    <section class="hero">

        <div class="hero-content">

            <div class="eyebrow">
                The next generation
            </div>

            <h1>
                Designed<br>
                to delight.
            </h1>

            <p>
                Powerful technology, beautifully simple.
                Explore the latest products and discover
                what comes next.
            </p>

            <div class="hero-buttons">
                <button
                    class="button-primary"
                    data-scroll="products"
                >
                    Shop now
                </button>

                <button
                    class="button-secondary"
                    id="learnMoreButton"
                >
                    Learn more →
                </button>
            </div>

        </div>

    </section>


    <section
        class="store"
        id="store"
    >

        <div class="section-heading">

            <div>
                <h2>
                    Store.
                    <br>
                    The best way to buy.
                </h2>
            </div>

            <p>
                Choose from our latest devices.
                Compare products, add them to your bag,
                and continue through checkout.
            </p>

        </div>


        <div
            class="toolbar"
            id="products"
        >

            <div class="search-box">

                <span class="search-icon">
                    ⌕
                </span>

                <input
                    id="searchInput"
                    type="search"
                    autocomplete="off"
                    placeholder="Search products..."
                    aria-label="Search products"
                >

            </div>

            <select
                id="categoryFilter"
                class="filter"
                aria-label="Filter products"
            >
                <option value="all">
                    All products
                </option>
                <option value="phone">
                    iPhone
                </option>
                <option value="mac">
                    Mac
                </option>
                <option value="tablet">
                    iPad
                </option>
                <option value="watch">
                    Watch
                </option>
                <option value="audio">
                    AirPods
                </option>
            </select>

            <select
                id="sortSelect"
                class="filter"
                aria-label="Sort products"
            >
                <option value="default">
                    Recommended
                </option>
                <option value="price-low">
                    Price: Low to High
                </option>
                <option value="price-high">
                    Price: High to Low
                </option>
                <option value="name">
                    Name
                </option>
            </select>

        </div>


        <div
            class="product-grid"
            id="productGrid"
        ></div>

    </section>


    <section class="feature">

        <div>
            <div class="eyebrow">
                MacBook Pro
            </div>

            <h2>
                Mind-blowing.
                <br>
                Head-turning.
            </h2>

            <p>
                Professional performance packed into an
                incredibly thin and elegant design.
            </p>

            <button
                class="button-primary"
                style="margin-top:25px"
                data-product="macbook-pro"
            >
                Buy
            </button>
        </div>

        <div class="feature-device">
            <div class="laptop"></div>
        </div>

    </section>

</main>


<footer id="support">

    <div class="footer-inner">

        <div class="footer-brand">
            Apple
        </div>

        <div class="footer-grid">

            <div class="footer-column">
                <h4>Shop</h4>
                <a href="#">Store</a>
                <a href="#">iPhone</a>
                <a href="#">Mac</a>
                <a href="#">iPad</a>
            </div>

            <div class="footer-column">
                <h4>Account</h4>
                <a href="#">Manage Account</a>
                <a href="#">Orders</a>
                <a href="#">Shopping Bag</a>
            </div>

            <div class="footer-column">
                <h4>Services</h4>
                <a href="#">Support</a>
                <a href="#">Delivery</a>
                <a href="#">Returns</a>
            </div>

            <div class="footer-column">
                <h4>About</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Accessibility</a>
            </div>

        </div>

    </div>

</footer>


<!-- CART OVERLAY -->

<div
    class="overlay"
    id="overlay"
></div>


<aside
    class="cart-drawer"
    id="cartDrawer"
    aria-label="Shopping bag"
>

    <div class="drawer-header">

        <h2>
            Your Bag
        </h2>

        <button
            class="close-button"
            id="closeCart"
            aria-label="Close bag"
        >
            ×
        </button>

    </div>

    <div
        class="drawer-content"
        id="cartItems"
    ></div>

    <div class="drawer-footer">

        <div class="total-row">
            <span>Total</span>
            <span id="cartTotal">₹0</span>
        </div>

        <button
            class="checkout-button"
            id="checkoutButton"
        >
            Check Out
        </button>

    </div>

</aside>


<!-- CHECKOUT MODAL -->

<div
    class="modal"
    id="checkoutModal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="checkoutTitle"
>

    <div class="modal-card">

        <div class="modal-header">

            <h2 id="checkoutTitle">
                Checkout
            </h2>

            <button
                class="close-button"
                id="closeCheckout"
                aria-label="Close checkout"
            >
                ×
            </button>

        </div>


        <form id="checkoutForm">

            <div class="form-grid">

                <div class="field">
                    <label for="firstName">
                        First name
                    </label>

                    <input
                        id="firstName"
                        name="firstName"
                        required
                    >
                </div>

                <div class="field">
                    <label for="lastName">
                        Last name
                    </label>

                    <input
                        id="lastName"
                        name="lastName"
                        required
                    >
                </div>

                <div class="field full">
                    <label for="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                    >
                </div>

                <div class="field full">
                    <label for="address">
                        Address
                    </label>

                    <input
                        id="address"
                        name="address"
                        required
                    >
                </div>

                <div class="field">
                    <label for="city">
                        City
                    </label>

                    <input
                        id="city"
                        name="city"
                        required
                    >
                </div>

                <div class="field">
                    <label for="postalCode">
                        Postal code
                    </label>

                    <input
                        id="postalCode"
                        name="postalCode"
                        required
                    >
                </div>

                <div class="field full">
                    <label for="payment">
                        Payment method
                    </label>

                    <select
                        id="payment"
                        required
                    >
                        <option value="">
                            Select payment method
                        </option>

                        <option value="card">
                            Credit / Debit Card
                        </option>

                        <option value="upi">
                            UPI
                        </option>

                        <option value="wallet">
                            Wallet
                        </option>
                    </select>
                </div>

            </div>


            <div class="coupon-row">

                <input
                    id="couponInput"
                    placeholder="Coupon code"
                    autocomplete="off"
                >

                <button
                    type="button"
                    id="couponButton"
                >
                    Apply
                </button>

            </div>

            <div
                class="message"
                id="couponMessage"
            ></div>


            <div class="checkout-summary">

                <div class="summary-line">
                    <span>Subtotal</span>
                    <span id="summarySubtotal">
                        ₹0
                    </span>
                </div>

                <div class="summary-line">
                    <span>Shipping</span>
                    <span id="summaryShipping">
                        ₹0
                    </span>
                </div>

                <div class="summary-line">
                    <span>Discount</span>
                    <span id="summaryDiscount">
                        ₹0
                    </span>
                </div>

                <div class="summary-line total">
                    <span>Total</span>
                    <span id="summaryTotal">
                        ₹0
                    </span>
                </div>

            </div>


            <button
                class="pay-button"
                id="payButton"
                type="submit"
            >
                Pay Now
            </button>

            <div
                class="message"
                id="paymentMessage"
            ></div>

        </form>

    </div>

</div>


<div
    class="toast-container"
    id="toastContainer"
    aria-live="polite"
></div>


<script>
"use strict";

/*
 * ============================================================
 * CHAOS PLAYGROUND E-COMMERCE APPLICATION
 * ============================================================
 *
 * The application intentionally contains several non-obvious
 * behavioral inconsistencies.
 *
 * The AI tester should discover them through:
 *
 *   observe → act → observe → compare → report
 *
 * Do NOT expose this object to the autonomous agent.
 * It exists only as application-side behavior.
 * ============================================================
 */


/* ============================================================
   PRODUCT DATA
============================================================ */

const PRODUCTS = [
    {
        id: "iphone-pro",
        name: "iPhone Pro",
        category: "phone",
        description: "A powerful smartphone with an advanced camera system.",
        price: 129900,
        inventory: 3,
        visual: "phone"
    },
    {
        id: "iphone-air",
        name: "iPhone Air",
        category: "phone",
        description: "Thin, light and incredibly capable.",
        price: 79900,
        inventory: 8,
        visual: "phone"
    },
    {
        id: "macbook-pro",
        name: "MacBook Pro",
        category: "mac",
        description: "Pro performance in an elegant notebook.",
        price: 169900,
        inventory: 2,
        visual: "laptop"
    },
    {
        id: "ipad-pro",
        name: "iPad Pro",
        category: "tablet",
        description: "Powerful enough to replace your computer.",
        price: 109900,
        inventory: 4,
        visual: "tablet"
    },
    {
        id: "apple-watch",
        name: "Apple Watch",
        category: "watch",
        description: "A smarter way to stay connected.",
        price: 49900,
        inventory: 1,
        visual: "watch"
    },
    {
        id: "airpods-pro",
        name: "AirPods Pro",
        category: "audio",
        description: "Immersive sound with intelligent noise cancellation.",
        price: 24900,
        inventory: 5,
        visual: "airpods"
    }
];


/* ============================================================
   APPLICATION STATE
============================================================ */

const state = {
    cart: [],
    coupon: null,
    isProcessingPayment: false,
    orderCount: 0
};


/* ============================================================
   DOM HELPERS
============================================================ */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}


function findProduct(productId) {
    return PRODUCTS.find(product => product.id === productId);
}


/* ============================================================
   PRODUCT VISUALS
============================================================ */

function productVisual(type) {

    const element = document.createElement("div");

    element.className = type;

    return element;
}


/* ============================================================
   PRODUCT RENDERING
============================================================ */

function renderProducts() {

    const grid = $("#productGrid");

    const searchTerm =
        $("#searchInput").value
            .trim()
            .toLowerCase();

    const category =
        $("#categoryFilter").value;

    const sort =
        $("#sortSelect").value;

    let products = PRODUCTS.filter(product => {

        const matchesSearch =
            !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            category === "all" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });


    if (sort === "price-low") {
        products.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
        products.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        products.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }


    grid.innerHTML = "";


    if (!products.length) {

        grid.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>
                    Try a different search term.
                </p>
            </div>
        `;

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";

        const stockClass =
            product.inventory === 0
                ? "out"
                : product.inventory <= 2
                    ? "low"
                    : "";

        const stockText =
            product.inventory === 0
                ? "Out of stock"
                : product.inventory <= 2
                    ? `Only ${product.inventory} left`
                    : `${product.inventory} available`;


        card.innerHTML = `
            <div
                class="product-image"
                data-product-image="${product.id}"
            ></div>

            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-description">
                    ${escapeHTML(product.description)}
                </div>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${product.id}"
                        ${product.inventory === 0 ? "disabled" : ""}
                    >
                        Add
                    </button>

                </div>

                <div class="stock ${stockClass}">
                    ${stockText}
                </div>

            </div>
        `;


        const image =
            card.querySelector(
                `[data-product-image="${product.id}"]`
            );

        image.appendChild(
            productVisual(product.visual)
        );


        grid.appendChild(card);
    });
}


/* ============================================================
   BASIC XSS-SAFE TEXT HANDLING
============================================================ */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ============================================================
   CART
============================================================ */

function addToCart(productId) {

    const product = findProduct(productId);

    if (!product) {
        return;
    }


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Rapid repeated clicks can bypass the visual inventory
     * expectation because inventory validation occurs before
     * the asynchronous state update.
     */

    const existing =
        state.cart.find(item =>
            item.productId === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        state.cart.push({
            productId,
            quantity: 1,

            /*
             * Snapshot price.
             *
             * Later we intentionally allow cart calculations
             * to use a different source under certain conditions.
             */
            addedPrice: product.price
        });
    }


    showToast(`${product.name} added to your bag`);

    updateCartUI();
}


function updateQuantity(productId, change) {

    const item =
        state.cart.find(
            cartItem =>
                cartItem.productId === productId
        );

    if (!item) {
        return;
    }


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Quantity can reach zero before removal.
     * Rapid interactions can temporarily create invalid
     * cart state.
     */

    item.quantity += change;


    if (item.quantity < 0) {
        item.quantity = 0;
    }


    if (item.quantity === 0) {
        state.cart =
            state.cart.filter(
                cartItem =>
                    cartItem.productId !== productId
            );
    }


    updateCartUI();
}


function calculateCartSubtotal() {

    return state.cart.reduce(
        (total, item) => {

            const product =
                findProduct(item.productId);

            if (!product) {
                return total;
            }


            /*
             * INTENTIONAL EDGE CASE:
             *
             * Product price may differ from the price captured
             * when the product was added.
             */

            const effectivePrice =
                product.id === "iphone-pro" &&
                state.cart.length > 0
                    ? product.price + 1000
                    : item.addedPrice;


            return total +
                effectivePrice * item.quantity;

        },
        0
    );
}


function updateCartUI() {

    const container =
        $("#cartItems");

    container.innerHTML = "";


    let totalQuantity = 0;


    state.cart.forEach(item => {

        const product =
            findProduct(item.productId);

        if (!product) {
            return;
        }


        totalQuantity += item.quantity;


        const element =
            document.createElement("div");

        element.className = "cart-item";


        element.innerHTML = `
            <div class="mini-image">
                <div class="mini-device"></div>
            </div>

            <div>

                <h4>
                    ${escapeHTML(product.name)}
                </h4>

                <p>
                    ${formatPrice(item.addedPrice)}
                </p>

                <div class="quantity-controls">

                    <button
                        data-decrease="${product.id}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        data-increase="${product.id}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

            </div>

            <strong>
                ${formatPrice(
                    item.addedPrice * item.quantity
                )}
            </strong>
        `;


        container.appendChild(element);
    });


    if (!state.cart.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Your bag is empty.</h3>
                <p>
                    Add something you love.
                </p>
            </div>
        `;
    }


    $("#cartCount").textContent =
        totalQuantity;


    $("#cartTotal").textContent =
        formatPrice(calculateCartSubtotal());
}


/* ============================================================
   CHECKOUT CALCULATION
============================================================ */

function calculateCheckout() {

    const subtotal =
        calculateCartSubtotal();


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Cart uses one threshold while checkout uses another.
     */

    const shipping =
        subtotal > 100000
            ? 0
            : 499;


    let discount = 0;


    if (state.coupon === "SAVE500") {

        /*
         * INTENTIONAL EDGE CASE:
         *
         * Minimum order boundary intentionally incorrect.
         */

        if (subtotal >= 499) {
            discount = 500;
        }
    }


    if (state.coupon === "WELCOME10") {
        discount =
            Math.round(subtotal * 0.10);
    }


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Floating-point arithmetic can result in unexpected
     * fractional values when certain combinations occur.
     */

    const total =
        subtotal +
        shipping -
        discount;


    return {
        subtotal,
        shipping,
        discount,
        total
    };
}


function renderCheckoutSummary() {

    const summary =
        calculateCheckout();


    $("#summarySubtotal").textContent =
        formatPrice(summary.subtotal);

    $("#summaryShipping").textContent =
        formatPrice(summary.shipping);

    $("#summaryDiscount").textContent =
        formatPrice(summary.discount);

    $("#summaryTotal").textContent =
        formatPrice(summary.total);
}


/* ============================================================
   COUPON ENGINE
============================================================ */

function applyCoupon() {

    const input =
        $("#couponInput");

    const code =
        input.value.trim().toUpperCase();

    const message =
        $("#couponMessage");


    message.className = "message";


    if (!code) {

        message.textContent =
            "Please enter a coupon code.";

        message.classList.add(
            "show",
            "error"
        );

        return;
    }


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Coupon comparison is case-normalized, but whitespace and
     * repeated application are handled inconsistently.
     */

    if (code === "SAVE500") {

        state.coupon = code;

        message.textContent =
            "Coupon applied.";

        message.classList.add(
            "show",
            "success"
        );

    } else if (code === "WELCOME10") {

        state.coupon = code;

        message.textContent =
            "Welcome discount applied.";

        message.classList.add(
            "show",
            "success"
        );

    } else if (code === "EXPIRED") {

        message.textContent =
            "This coupon has expired.";

        message.classList.add(
            "show",
            "error"
        );

    } else {

        message.textContent =
            "Invalid coupon code.";

        message.classList.add(
            "show",
            "error"
        );
    }


    renderCheckoutSummary();
}


/* ============================================================
   CHECKOUT
============================================================ */

function openCheckout() {

    if (!state.cart.length) {

        showToast(
            "Your bag is empty."
        );

        return;
    }


    renderCheckoutSummary();

    $("#checkoutModal")
        .classList.add("open");
}


function closeCheckout() {

    $("#checkoutModal")
        .classList.remove("open");
}


/* ============================================================
   PAYMENT SIMULATION
============================================================ */

async function processPayment(event) {

    event.preventDefault();


    if (state.isProcessingPayment) {

        /*
         * Intentionally silent.
         *
         * This creates an interesting edge case when the user
         * clicks rapidly and expects visible feedback.
         */

        return;
    }


    const form =
        $("#checkoutForm");


    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    const payment =
        $("#payment").value;

    const message =
        $("#paymentMessage");


    if (!payment) {

        message.textContent =
            "Please select a payment method.";

        message.className =
            "message show error";

        return;
    }


    state.isProcessingPayment = true;

    $("#payButton").disabled = true;

    $("#payButton").textContent =
        "Processing…";


    /*
     * Simulated asynchronous payment API.
     */

    await delay(
        payment === "upi"
            ? 1800
            : 900
    );


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Payment succeeds, but order creation randomly fails
     * for one particular basket state.
     */

    const hasMac =
        state.cart.some(
            item =>
                item.productId === "macbook-pro"
        );


    if (
        hasMac &&
        state.cart.length === 1 &&
        state.orderCount % 2 === 0
    ) {

        message.textContent =
            "Payment successful, but we could not create your order.";

        message.className =
            "message show error";


        /*
         * Notice that the cart is intentionally not cleared.
         *
         * AI should recognize the inconsistent state.
         */

        state.isProcessingPayment = false;

        $("#payButton").disabled = false;

        $("#payButton").textContent =
            "Pay Now";

        return;
    }


    state.orderCount += 1;


    /*
     * INTENTIONAL EDGE CASE:
     *
     * Order identifier generated from time can collide if two
     * submissions occur close together.
     */

    const orderId =
        "ORD-" +
        String(Date.now()).slice(-6);


    message.textContent =
        `Order ${orderId} placed successfully.`;

    message.className =
        "message show success";


    /*
     * Artificially delayed cleanup.
     */

    await delay(400);


    state.cart = [];

    state.coupon = null;

    updateCartUI();


    state.isProcessingPayment = false;

    $("#payButton").disabled = false;

    $("#payButton").textContent =
        "Pay Now";
}


/* ============================================================
   UTILITY
============================================================ */

function delay(ms) {

    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}


function showToast(text) {

    const container =
        $("#toastContainer");

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = text;

    container.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 2500);
}


/* ============================================================
   DRAWER
============================================================ */

function openCart() {

    $("#overlay")
        .classList.add("open");

    $("#cartDrawer")
        .classList.add("open");
}


function closeCart() {

    $("#overlay")
        .classList.remove("open");

    $("#cartDrawer")
        .classList.remove("open");
}


/* ============================================================
   EVENT DELEGATION
============================================================ */

document.addEventListener(
    "click",
    event => {

        const addButton =
            event.target.closest("[data-add]");

        if (addButton) {

            addToCart(
                addButton.dataset.add
            );

            return;
        }


        const increase =
            event.target.closest("[data-increase]");

        if (increase) {

            updateQuantity(
                increase.dataset.increase,
                1
            );

            return;
        }


        const decrease =
            event.target.closest("[data-decrease]");

        if (decrease) {

            updateQuantity(
                decrease.dataset.decrease,
                -1
            );

            return;
        }


        const productButton =
            event.target.closest("[data-product]");

        if (productButton) {

            addToCart(
                productButton.dataset.product
            );

            return;
        }


        const scrollButton =
            event.target.closest("[data-scroll]");

        if (scrollButton) {

            const target =
                document.getElementById(
                    scrollButton.dataset.scroll
                );

            target?.scrollIntoView({
                behavior: "smooth"
            });
        }

    }
);


/* ============================================================
   SEARCH
============================================================ */

$("#searchInput")
    .addEventListener(
        "input",
        renderProducts
    );


$("#categoryFilter")
    .addEventListener(
        "change",
        renderProducts
    );


$("#sortSelect")
    .addEventListener(
        "change",
        renderProducts
    );


$("#searchFocusButton")
    .addEventListener(
        "click",
        () => {

            $("#searchInput")
                .focus();

            $("#searchInput")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
        }
    );


/* ============================================================
   CART EVENTS
============================================================ */

$("#cartButton")
    .addEventListener(
        "click",
        openCart
    );


$("#closeCart")
    .addEventListener(
        "click",
        closeCart
    );


$("#overlay")
    .addEventListener(
        "click",
        closeCart
    );


$("#checkoutButton")
    .addEventListener(
        "click",
        () => {

            closeCart();

            openCheckout();
        }
    );


/* ============================================================
   CHECKOUT EVENTS
============================================================ */

$("#closeCheckout")
    .addEventListener(
        "click",
        closeCheckout
    );


$("#couponButton")
    .addEventListener(
        "click",
        applyCoupon
    );


$("#checkoutForm")
    .addEventListener(
        "submit",
        processPayment
    );


$("#learnMoreButton")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Explore the products below."
            );

            $("#products")
                .scrollIntoView({
                    behavior: "smooth"
                });
        }
    );


$("#brandButton")
    .addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


/* ============================================================
   KEYBOARD HANDLING
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCart();
            closeCheckout();
        }
    }
);


/* ============================================================
   INITIALIZATION
============================================================ */

renderProducts();

updateCartUI();


/*
 * Small delayed state refresh.
 *
 * This intentionally creates a situation where a tester that
 * relies only on initial DOM state can miss changes.
 */

setTimeout(() => {

    const product =
        findProduct("iphone-pro");

    if (product) {

        /*
         * INTENTIONAL EDGE CASE:
         *
         * Inventory silently changes after initial page load.
         */

        product.inventory = 2;

        renderProducts();
    }

}, 700);


/*
 * Simulated background inventory update.
 */

setTimeout(() => {

    const product =
        findProduct("apple-watch");

    if (product) {

        product.inventory = 0;

        renderProducts();
    }

}, 5000);

</script>

</body>
</html>
