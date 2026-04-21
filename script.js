// PRODUCTS DATA

const defaultProducts = [
    {
        name: "Pure Black Seed Olive Oil 500ml",
        desc: "Huile naturelle extraite des graines de nigelle, connue pour ses bienfaits sur la santé. Elle renforce l'immunité, améliore la digestion et nourrit la peau et les cheveux. Son goût est fort et légèrement piquant.",
        price: 75,
        img: "images/Pure black seed oil.png"
    },
    {
        name: "Refined Olive Oil 750ml",
        desc: "Huile obtenue après raffinage pour éliminer les impuretés. Elle a un goût léger et neutre, avec moins d'arôme que l'huile vierge. Idéale pour la cuisson et la friture grâce à sa stabilité à haute température.",
        price: 110,
        img: "images/Refined Olive Oil.jpg"
    },
    {
        name: "Extra Virgin Olive Oil 1L",
        desc: "Huile de la plus haute qualité, extraite à froid sans traitement chimique. Riche en nutriments et en antioxydants, avec un goût fruité et légèrement amer. Idéale pour les salades et une utilisation à cru.",
        price: 250,
        img: "images/Extra virgin oil.png"
    }
];

let products = [...defaultProducts];
let cart = [];

// TOAST

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// PRODUCTS

function renderProducts() {
    const list = document.getElementById('products-list');
    if (!list) return;

    list.innerHTML = '';

    if (products.length === 0) {
        list.innerHTML = '<p class="no-products">Aucun produit disponible.</p>';
        return;
    }

    products.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img">
                <img src="${p.img || 'images/placeholder.png'}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="product-actions">
                    <span class="product-price">${p.price} DH</span>
                    <button class="btn-cart" onclick="addToCart(${i})">Ajouter au panier</button>
                    <button class="btn-edit" onclick="openEditModal(${i})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-delete" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

// CART

function addToCart(index) {
    const p = products[index];
    const existing = cart.find(item => item.name === p.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name: p.name,
            price: p.price,
            qty: 1,
            img: p.img || 'images/placeholder.png'
        });
    }

    updateCartBadge();
    showToast('Produit ajouté au panier !');
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = '0';
        return;
    }

    cart.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <img class="cart-item-img" src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price} DH</span>
            </div>
            <div class="cart-item-qty">
                <button onclick="changeQty(${i}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${i}, 1)">+</button>
                <button class="cart-remove" onclick="removeFromCart(${i})">X</button>
            </div>
        `;

        container.appendChild(div);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = total;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);

    updateCartBadge();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    renderCart();
}

// CART UI

function openCart() {
    document.getElementById('cart-sidebar')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('show');
    renderCart();
}

function closeCart() {
    document.getElementById('cart-sidebar')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('show');
}

document.getElementById('cart-icon-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

// MODAL

function openAddModal() {
    document.getElementById('modal-title').textContent = 'Ajouter un produit';
    document.getElementById('product-form').reset();
    document.getElementById('edit-index').value = '';
    document.getElementById('modal-overlay').classList.add('show');
}

function openEditModal(index) {
    const p = products[index];

    document.getElementById('modal-title').textContent = 'Modifier le produit';
    document.getElementById('edit-index').value = index;
    document.getElementById('input-name').value = p.name;
    document.getElementById('input-desc').value = p.desc;
    document.getElementById('input-price').value = p.price;
    document.getElementById('input-img').value = p.img || '';

    document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('show');
}

// EVENTS MODAL

document.getElementById('btn-add-product')?.addEventListener('click', openAddModal);
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('btn-cancel')?.addEventListener('click', closeModal);

document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
});

document.getElementById('product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const idx = document.getElementById('edit-index').value;

    const newProduct = {
        name: document.getElementById('input-name').value.trim(),
        desc: document.getElementById('input-desc').value.trim(),
        price: parseInt(document.getElementById('input-price').value),
        img: document.getElementById('input-img').value.trim()
    };

    if (idx !== '') {
        products[parseInt(idx)] = newProduct;
        showToast('Produit modifié avec succès !');
    } else {
        products.push(newProduct);
        showToast('Produit ajouté avec succès !');
    }

    renderProducts();
    closeModal();
});

function deleteProduct(index) {
    if (confirm('Supprimer ce produit ?')) {
        products.splice(index, 1);
        renderProducts();
        showToast('Produit supprimé.');
    }
}

// CONTACT

const btnSend = document.getElementById('btn-send');

if (btnSend) {
    btnSend.addEventListener('click', () => {
        const nom = document.getElementById('input-nom').value.trim();
        const email = document.getElementById('input-email').value.trim();
        const sujet = document.getElementById('input-sujet').value.trim();
        const message = document.getElementById('input-message').value.trim();

        if (!nom || !email || !sujet || !message) {
            showToast('Veuillez remplir tous les champs.');
            return;
        }

        showToast('Message envoyé avec succès !');

        document.getElementById('input-nom').value = '';
        document.getElementById('input-email').value = '';
        document.getElementById('input-sujet').value = '';
        document.getElementById('input-message').value = '';
    });
}

// INIT

updateCartBadge();
renderProducts();