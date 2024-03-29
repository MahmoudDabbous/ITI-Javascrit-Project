import Storage from "../src/storage.js";
import Cart from "../src/cart.js";
import User from "../src/user.js";
import Authenticator from "../src/authenticator.js";
import Product from "../src/product.js";
let sendReview = document.querySelector("#sendReview");
let imgProduct = document.querySelector("#img-product");
let nameProduct = document.querySelector("#name-product");
let priceProduct = document.querySelector("#price-product");
let oldPriceProduct = document.querySelector("#old-price-product");
let descProduct = document.querySelector(".desc-product");
let reviews = document.querySelector("#review");
let addProduct = document.querySelector("#add-product");
let badge_span_header = document.querySelector("#badge-span-header");

let search = new URLSearchParams(window.location.search);

const user = new User(Authenticator.currentUser());

const products = new Storage("produts");
const cart = new Cart("cart");
let productId = "";

if (search.size > 0) {
    productId = search.get("id");
}
else {
    window.location.href = "home";
}

function display() {
    var childScripts = reviews.children;
    Array.from(childScripts).forEach(function (child) {
        reviews.removeChild(child);
    });
    if (productId) {
        if (products.exists(productId)) {
            badge_span_header.textContent = cart.count();
            let res = products.read(productId);
            imgProduct.src = "resources/images/cart/" + res.image;
            nameProduct.textContent = res.name;
            priceProduct.textContent = "$ " + res.price;
            oldPriceProduct.textContent = "$ " + (res.price / 2 + res.price);
            descProduct.textContent = res.description;
            res.comments.forEach((comment) => {
                let review = `            
        <div class="review mb-3">
            <strong>${comment.user}:</strong>
            <p class="mb-0">${comment.comment}</p>
        </div>
        `;
                reviews.insertAdjacentHTML("beforeend", review);
            });
        }
    }
}
addProduct.addEventListener("click", function (e) {
    if (productId) {

        const product = {
            productId: productId,
            count: 1,
        };
        user.addToCart(productId, product);
        badge_span_header.textContent = cart.productIds().length;

    }


});

display();
badge_span_header.textContent = cart.productIds().length;

sendReview.addEventListener("submit", function (e) {
    e.preventDefault();
    const msg = sendReview.message.value;
    const form = e.target;
    form.textContent = "Review sent";
    form.disabled = true;
    
    Product.addComment(productId, Authenticator.currentUser(), msg);
    display();
});


