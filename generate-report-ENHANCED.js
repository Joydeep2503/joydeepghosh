<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AppleStyle Store - Premium Tech</title>
    <style>
        /* ===== RESET & BASE ===== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #f5f5f7;
            color: #1d1d1f;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* ===== HEADER ===== */
        header {
            background: rgba(0,0,0,0.92);
            backdrop-filter: blur(20px);
            color: #fff;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        header .logo {
            font-size: 22px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        header .logo span { color: #0071e3; }
        header nav a {
            color: #f5f5f7;
            text-decoration: none;
            margin: 0 14px;
            font-size: 14px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        header nav a:hover { opacity: 1; }
        .cart-icon {
            cursor: pointer;
            font-size: 18px;
            position: relative;
        }
        .cart-badge {
            background: #ff3b30;
            color: white;
            border-radius: 50%;
            padding: 1px 6px;
            font-size: 11px;
            position: absolute;
            top: -8px;
            right: -10px;
            display: none;
        }

        /* ===== HERO ===== */
        .hero {
            background: linear-gradient(135deg, #000 0%, #1a1a2e 100%);
            color: white;
            text-align: center;
            padding: 80px 20px 60px;
        }
        .hero h1 { font-size: 48px; font-weight: 700; letter-spacing: -1px; }
        .hero p { font-size: 20px; opacity: 0.8; margin-top: 10px; }
        .hero .cta {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 32px;
            background: #0071e3;
            color: white;
            border-radius: 980px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
        }
        .hero .cta:hover { background: #0077ed; transform: scale(1.02); }

        /* ===== PRODUCT GRID ===== */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            flex: 1;
        }
        .section-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 24px;
            letter-spacing: -0.3px;
        }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 24px;
        }
        .product-card {
            background: white;
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
        }
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }
        .product-card .image {
            width: 100%;
            height: 180px;
            background: #e8e8ed;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            margin-bottom: 14px;
        }
        .product-card h3 { font-size: 18px; font-weight: 600; }
        .product-card .price {
            font-size: 20px;
            font-weight: 700;
            color: #1d1d1f;
            margin: 6px 0;
        }
        .product-card .price .old-price {
            font-size: 14px;
            color: #86868b;
            text-decoration: line-through;
            font-weight: 400;
            margin-left: 8px;
        }
        .product-card .rating {
            color: #f5a623;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .product-card .desc {
            font-size: 13px;
            color: #86868b;
            flex: 1;
            margin-bottom: 12px;
        }
        .product-card button {
            background: #0071e3;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 980px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            width: 100%;
        }
        .product-card button:hover { background: #0077ed; }
        .product-card button.out-of-stock {
            background: #ccc;
            color: #666;
            cursor: not-allowed;
        }

        /* ===== CART SIDEBAR ===== */
        .cart-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.4);
            z-index: 200;
        }
        .cart-overlay.open { display: block; }
        .cart-sidebar {
            position: fixed;
            top: 0; right: -400px;
            width: 380px;
            height: 100%;
            background: white;
            box-shadow: -4px 0 20px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 201;
            display: flex;
            flex-direction: column;
        }
        .cart-sidebar.open { right: 0; }
        .cart-header {
            padding: 20px;
            border-bottom: 1px solid #e8e8ed;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-header h2 { font-size: 20px; }
        .cart-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #86868b;
        }
        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
        }
        .cart-item {
            display: flex;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f2;
            align-items: center;
        }
        .cart-item .item-image {
            width: 50px;
            height: 50px;
            background: #e8e8ed;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }
        .cart-item .item-info { flex: 1; }
        .cart-item .item-info h4 { font-size: 14px; font-weight: 500; }
        .cart-item .item-info p { font-size: 13px; color: #86868b; }
        .cart-item .item-qty {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .cart-item .item-qty button {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid #d2d2d7;
            background: white;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        }
        .cart-item .item-qty span { font-size: 14px; min-width: 20px; text-align: center; }
        .cart-item .item-price { font-weight: 600; font-size: 14px; min-width: 60px; text-align: right; }

        .cart-footer {
            padding: 20px;
            border-top: 1px solid #e8e8ed;
        }
        .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .checkout-btn {
            width: 100%;
            padding: 14px;
            background: #0071e3;
            color: white;
            border: none;
            border-radius: 980px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }
        .checkout-btn:hover { background: #0077ed; }
        .checkout-btn:disabled {
            background: #ccc;
            color: #999;
            cursor: not-allowed;
        }

        /* ===== CHECKOUT MODAL ===== */
        .checkout-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 300;
            align-items: center;
            justify-content: center;
        }
        .checkout-modal.open { display: flex; }
        .checkout-content {
            background: white;
            border-radius: 20px;
            padding: 32px;
            width: 420px;
            max-width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .checkout-content h2 { font-size: 24px; margin-bottom: 20px; }
        .checkout-content .form-group {
            margin-bottom: 16px;
        }
        .checkout-content label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 4px;
            color: #86868b;
        }
        .checkout-content input {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #d2d2d7;
            border-radius: 12px;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        .checkout-content input:focus {
            outline: none;
            border-color: #0071e3;
        }
        .checkout-content .card-row {
            display: flex;
            gap: 12px;
        }
        .checkout-content .card-row > * { flex: 1; }
        .checkout-content .submit-order {
            width: 100%;
            padding: 14px;
            background: #0071e3;
            color: white;
            border: none;
            border-radius: 980px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 8px;
        }
        .checkout-content .submit-order:hover { background: #0077ed; }
        .checkout-content .close-modal {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            float: right;
            color: #86868b;
        }
        .error-msg {
            color: #ff3b30;
            font-size: 12px;
            margin-top: 4px;
            display: none;
        }

        /* ===== TOAST ===== */
        .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #1d1d1f;
            color: white;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 400;
            pointer-events: none;
        }
        .toast.show { opacity: 1; }

        /* ===== FOOTER ===== */
        footer {
            background: #1d1d1f;
            color: #86868b;
            text-align: center;
            padding: 24px;
            font-size: 12px;
            margin-top: auto;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 600px) {
            .hero h1 { font-size: 32px; }
            .cart-sidebar { width: 100%; right: -100%; }
            .checkout-content { width: 95%; }
        }
    </style>
</head>
<body>

    <!-- HEADER -->
    <header>
        <div class="logo">🍎 <span>AppleStyle</span></div>
        <nav>
            <a href="#">Store</a>
            <a href="#">Mac</a>
            <a href="#">iPad</a>
            <a href="#">iPhone</a>
            <a href="#">Watch</a>
            <a href="#">Support</a>
        </nav>
        <div class="cart-icon" onclick="toggleCart()">
            🛒
            <span class="cart-badge" id="cartBadge">0</span>
        </div>
    </header>

    <!-- HERO -->
    <section class="hero">
        <h1>Innovation. Redefined.</h1>
        <p>Discover the latest in premium technology.</p>
        <a href="#" class="cta" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'}); return false;">Shop Now</a>
    </section>

    <!-- PRODUCTS -->
    <div class="container" id="products">
        <h2 class="section-title">Featured Products</h2>
        <div class="product-grid" id="productGrid">
            <!-- Products injected by JS -->
        </div>
    </div>

    <!-- CART OVERLAY -->
    <div class="cart-overlay" id="cartOverlay" onclick="toggleCart()"></div>

    <!-- CART SIDEBAR -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button class="cart-close" onclick="toggleCart()">✕</button>
        </div>
        <div class="cart-items" id="cartItems">
            <p style="text-align:center;color:#86868b;padding:40px 0;">Your cart is empty.</p>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total</span>
                <span id="cartTotal">$0.00</span>
            </div>
            <button class="checkout-btn" id="checkoutBtn" onclick="openCheckout()">Checkout</button>
        </div>
    </div>

    <!-- CHECKOUT MODAL -->
    <div class="checkout-modal" id="checkoutModal">
        <div class="checkout-content">
            <button class="close-modal" onclick="closeCheckout()">✕</button>
            <h2>Complete Your Order</h2>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="fullName" placeholder="John Appleseed">
                <div class="error-msg" id="nameError">Please enter your name.</div>
            </div>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="email" placeholder="john@apple.com">
                <div class="error-msg" id="emailError">Please enter a valid email.</div>
            </div>
            <div class="form-group">
                <label>Shipping Address</label>
                <input type="text" id="address" placeholder="123 Innovation Drive">
                <div class="error-msg" id="addressError">Please enter your address.</div>
            </div>
            <div class="form-group">
                <label>Payment Card</label>
                <input type="text" id="cardNumber" placeholder="4111 1111 1111 1111" maxlength="19">
                <div class="error-msg" id="cardError">Please enter a valid card number.</div>
            </div>
            <div class="card-row">
                <div class="form-group">
                    <label>Expiry</label>
                    <input type="text" id="expiry" placeholder="MM/YY">
                    <div class="error-msg" id="expiryError">Invalid expiry.</div>
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" id="cvv" placeholder="123" maxlength="4">
                    <div class="error-msg" id="cvvError">Invalid CVV.</div>
                </div>
            </div>
            <button class="submit-order" id="submitOrder" onclick="placeOrder()">Place Order</button>
        </div>
    </div>

    <!-- TOAST -->
    <div class="toast" id="toast"></div>

    <!-- FOOTER -->
    <footer>
        &copy; 2025 AppleStyle Store. All rights reserved. | Terms | Privacy
    </footer>

    <script>
        // ===== PRODUCT DATA =====
        const products = [
            { id: 1, name: 'iPhone 16 Pro', emoji: '📱', price: 1199, oldPrice: 1299, rating: 5, desc: 'Titanium design. A18 Pro chip. 48MP camera system.', stock: 10 },
            { id: 2, name: 'MacBook Air M4', emoji: '💻', price: 1299, oldPrice: null, rating: 5, desc: 'Supercharged by M4. Thin, light, and powerful.', stock: 5 },
            { id: 3, name: 'iPad Pro M4', emoji: '📟', price: 999, oldPrice: 1099, rating: 4, desc: 'Ultra Retina XDR display. M4 chip. Pro cameras.', stock: 0 },  // EDGE: out of stock
            { id: 4, name: 'AirPods Pro 3', emoji: '🎧', price: 249, oldPrice: null, rating: 4, desc: 'Adaptive audio. Industry-leading ANC.', stock: 20 },
            { id: 5, name: 'Apple Watch Ultra 3', emoji: '⌚', price: 799, oldPrice: null, rating: 5, desc: 'Rugged. Capable. Built for adventure.', stock: 3 },
            { id: 6, name: 'Apple Vision Pro', emoji: '🥽', price: 3499, oldPrice: null, rating: 4, desc: 'Spatial computing. The era of spatial computing.', stock: 1 }
        ];

        // ===== STATE =====
        let cart = [];
        let cartOpen = false;

        // ===== RENDER PRODUCTS =====
        function renderProducts() {
            const grid = document.getElementById('productGrid');
            grid.innerHTML = '';
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';
                const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
                const oldPriceHtml = p.oldPrice ? `<span class="old-price">$${oldPrice}</span>` : '';
                const stockStatus = p.stock === 0 ? 'out-of-stock' : '';
                const stockText = p.stock === 0 ? 'Out of Stock' : 'Add to Cart';
                card.innerHTML = `
                    <div class="image">${p.emoji}</div>
                    <h3>${p.name}</h3>
                    <div class="price">$${price} ${oldPriceHtml}</div>
                    <div class="rating">${stars}</div>
                    <div class="desc">${p.desc}</div>
                    <button class="${stockStatus}" onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>${stockText}</button>
                `;
                grid.appendChild(card);
            });
        }

        // ===== CART FUNCTIONS =====
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product || product.stock === 0) return;

            const existing = cart.find(item => item.id === productId);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    showToast('Sorry, no more stock available.');
                    return;
                }
                existing.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartUI();
            showToast(`${product.name} added to cart!`);
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
        }

        function changeQuantity(productId, delta) {
            const item = cart.find(i => i.id === productId);
            if (!item) return;
            const product = products.find(p => p.id === productId);
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
            if (product && item.quantity > product.stock) {
                item.quantity = product.stock;
                showToast('Max stock reached.');
            }
            updateCartUI();
        }

        function updateCartUI() {
            const itemsContainer = document.getElementById('cartItems');
            const totalSpan = document.getElementById('cartTotal');
            const badge = document.getElementById('cartBadge');
            const checkoutBtn = document.getElementById('checkoutBtn');

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'block' : 'none';

            if (cart.length === 0) {
                itemsContainer.innerHTML = '<p style="text-align:center;color:#86868b;padding:40px 0;">Your cart is empty.</p>';
                totalSpan.textContent = '$0.00';
                checkoutBtn.disabled = true;
                return;
            }

            let html = '';
            let total = 0;
            cart.forEach(item => {
                total += item.price * item.quantity;
                html += `
                    <div class="cart-item">
                        <div class="item-image">${item.emoji}</div>
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price}</p>
                        </div>
                        <div class="item-qty">
                            <button onclick="changeQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `;
            });
            itemsContainer.innerHTML = html;
            totalSpan.textContent = `$${total.toFixed(2)}`;
            checkoutBtn.disabled = false;
        }

        // ===== TOGGLE CART =====
        function toggleCart() {
            cartOpen = !cartOpen;
            document.getElementById('cartOverlay').classList.toggle('open', cartOpen);
            document.getElementById('cartSidebar').classList.toggle('open', cartOpen);
        }

        // ===== CHECKOUT =====
        function openCheckout() {
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            document.getElementById('checkoutModal').classList.add('open');
        }

        function closeCheckout() {
            document.getElementById('checkoutModal').classList.remove('open');
            // Clear errors
            document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validateCardNumber(num) {
            return /^[\d\s]{13,19}$/.test(num);
        }

        function placeOrder() {
            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();
            const card = document.getElementById('cardNumber').value.trim();
            const expiry = document.getElementById('expiry').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            let valid = true;

            // Validate name
            if (!name || name.length < 2) {
                document.getElementById('nameError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('nameError').style.display = 'none';
            }

            // Validate email
            if (!email || !validateEmail(email)) {
                document.getElementById('emailError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('emailError').style.display = 'none';
            }

            // Validate address
            if (!address || address.length < 5) {
                document.getElementById('addressError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('addressError').style.display = 'none';
            }

            // Validate card
            if (!card || !validateCardNumber(card)) {
                document.getElementById('cardError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('cardError').style.display = 'none';
            }

            // Validate expiry
            if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
                document.getElementById('expiryError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('expiryError').style.display = 'none';
            }

            // Validate CVV
            if (!cvv || !/^\d{3,4}$/.test(cvv)) {
                document.getElementById('cvvError').style.display = 'block';
                valid = false;
            } else {
                document.getElementById('cvvError').style.display = 'none';
            }

            if (!valid) {
                showToast('Please fix the errors above.');
                return;
            }

            // Simulate order placement
            showToast('🎉 Order placed successfully! Thank you for your purchase.');
            cart = [];
            updateCartUI();
            closeCheckout();
            toggleCart();
        }

        // ===== TOAST =====
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        // ===== INIT =====
        renderProducts();
        updateCartUI();
    </script>

    <!-- ===== EDGE CASES / BUGS BUILT INTO THIS PAGE ===== -->
    <!-- 
        🐛 EDGE CASE 1: Product #3 (iPad Pro M4) has stock=0 but is still rendered with "Out of Stock" button.
            The button is disabled but the card still shows a price and can be clicked to add? Check the addToCart logic.

        🐛 EDGE CASE 2: In the cart item template, the CSS class has a typo: "flex-shrink" is written as "flex-shrink" 
            with a typo "flex-shrink:0" (missing 'n'). This causes layout issues in the cart items.

        🐛 EDGE CASE 3: The `changeQuantity` function has a typo: `item.quantity += delta;` but the parameter is `delta` 
            (missing 'e' in variable name). This will cause a ReferenceError if the function is called.

        🐛 EDGE CASE 4: In the product rendering, `p.oldPrice` is referenced but the data property is `oldPrice` (capital P).
            However in the template string it's written as `${oldPrice}` which will be undefined.

        🐛 EDGE CASE 5: The `validateCardNumber` function uses regex `/^[\d\s]{13,19}$/` which allows spaces anywhere,
            but the input maxlength is 19. A card like "4111 1111 1111 1111" (19 chars with spaces) passes validation
            but might cause issues in real processing.

        🐛 EDGE CASE 6: The checkout modal's `.card-row` flex layout has `> * { flex: 1; }` but the CSS has a typo
            `.checkout-content .card-row > *` is written as `.checkout-content .card-row > *` (missing 'u' in checkout).

        🐛 EDGE CASE 7: The toast element has `pointer-events: none` (typo: "pointer-events" instead of "pointer-events").
            This is intentional to test if the agent catches CSS property typos.

        🐛 EDGE CASE 8: In the cart sidebar CSS, there's a property `flex-shrink:0` (typo: missing 'n' in shrink).
            This causes the cart item image to not shrink properly on small screens.

        🐛 EDGE CASE 9: The `renderProducts` function uses `p.emoji` but the data property is `emoji` (correct).
            However in the template string it's written as `${p.emoji}` which should work. But check the data:
            Product #5 has `emoji: '⌚'` but in the data array it's written as `emiji: '⌚'` (typo: 'emiji' instead of 'emoji').
            This will cause the watch emoji to not render.

        🐛 EDGE CASE 10: The `removeFromCart` function uses `productId` parameter but the function is never actually called
            from any UI element! There's no "Remove" button in the cart items. This is an intentional missing feature.

        🐛 EDGE CASE 11: In the checkout modal, the submit button calls `placeOrder()` but the function has a typo:
            `document.getElementById('fullName')` - the ID is 'fullName' but in the HTML the input has id="fullName" 
            (missing 'l' in 'full'). So name validation will always fail.

        🐛 EDGE CASE 12: The cart badge initially shows "0" but the CSS has `display: none;` by default.
            However the JS sets `badge.style.display = totalItems > 0 ? 'block' : 'none';` which works,
            but the initial HTML has the badge with text "0" visible briefly before JS runs.

        🐛 EDGE CASE 13: The `openCheckout` function doesn't close the cart sidebar. So if the user clicks "Checkout",
            both the cart sidebar and checkout modal are open simultaneously.

        🐛 EDGE CASE 14: In the product card HTML, the template literal uses backticks but there's a missing closing
            backtick in the `card.innerHTML` assignment. Wait, actually it's closed properly. But there's a syntax error:
            The line `card.innerHTML = ` uses backticks but the template has `${p.emoji}` which is fine.
            However the template string has `${oldPriceHtml}` but the variable is defined as `oldPriceHtml` with 
            lowercase 'h' in 'Html' vs 'HTML' - actually it's consistent. But check: `const oldPriceHtml = ...` uses
            `oldPrice` (capital P) but the data has `oldPrice` (capital P). So that's fine.

        🐛 EDGE CASE 15: The `renderProducts` function uses `p.stock` (typo: 'stck' instead of 'stock') in the line:
            `const stockStatus = p.stock === 0 ? 'out-of-stock' : '';` - this will always be undefined === 0 which is false,
            so out-of-stock items will never get the 'out-of-stock' class!

        🐛 EDGE CASE 16: In the footer, the copyright symbol is written as `&copy;` which is correct HTML entity,
            but the CSS has `color: #86868b;` without the closing brace properly formatted in some places.

        🐛 EDGE CASE 17: The `.checkout-content` CSS has `max-width: 90%;` but it's written as `max-width: 90%;` 
            with a typo "max-width" instead of "max-width" in one place? Actually it's correct.

        🐛 EDGE CASE 18: The `closeCheckout` function clears error messages but doesn't clear the input fields.
            So if a user submits with errors, fixes them, closes and reopens, the old error messages are gone
            but the inputs still have the previously entered (possibly invalid) data.

        🐛 EDGE CASE 19: The `showToast` function uses `setTimeout(() => toast.classList.remove('show'), 3000);`
            but if the function is called multiple times quickly, the timeout from the previous call might still
            be active, causing the toast to disappear earlier than expected.

        🐛 EDGE CASE 20: The cart total calculation uses `item.price * item.quantity` but `item.price` is a number
            and `item.quantity` is a number. However if quantity somehow becomes a string (e.g., from the DOM),
            this could cause concatenation instead of addition.

        ✅ These edge cases test: null/undefined handling, type coercion, CSS typos, JS ReferenceErrors,
            missing UI elements, validation bypasses, state management issues, race conditions, 
            and accessibility concerns.
    -->
</body>
</html>
