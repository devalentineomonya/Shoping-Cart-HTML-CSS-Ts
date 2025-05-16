import type { TProduct } from "./main";
import { CART_UPDATED_EVENT } from "./cart";

export function renderProduct(product: TProduct) {
  const productCard = document.createElement("div");
  const imageContainer = document.createElement("div");
  const image = document.createElement("img");

  const addToCartButton = document.createElement("button");
  const cartIcon = document.createElement("img");
  const cartSpan = document.createElement("span");
  const quantitySelector = document.createElement("div");
  const minusButton = document.createElement("button");
  const quantityDisplay = document.createElement("span");
  const plusButton = document.createElement("button");

  const productInfo = document.createElement("div");
  const category = document.createElement("p");
  const name = document.createElement("h3");
  const price = document.createElement("p");

  image.src = product.image.desktop;
  image.alt = product.name;

  minusButton.innerHTML = "&#8722;";
  plusButton.innerHTML = "&#43;";

  category.textContent = product.category;
  name.textContent = product.name;
  price.textContent = `$${product.price.toFixed(2)}`;

  productCard.classList.add("card");
  productCard.setAttribute("data-product-id", product.id);

  imageContainer.classList.add("card-image");
  quantitySelector.classList.add("quantity-selector");
  minusButton.classList.add("quantity-btn", "minus-btn");
  quantityDisplay.classList.add("quantity-display");
  plusButton.classList.add("quantity-btn", "plus-btn");
  productInfo.classList.add("card-info");
  category.classList.add("category");
  name.classList.add("product-name");
  price.classList.add("price");

  function updateProductCardUI() {
    const cartProducts = JSON.parse(
      localStorage.getItem("cartProducts") || "{}"
    );
    const quantity = cartProducts[product.id] || 0;

    quantityDisplay.textContent = quantity.toString();
    if (quantity > 0) {
      quantitySelector.classList.add("active");
      quantitySelector.classList.remove("hidden");
      addToCartButton.classList.add("hidden");
      imageContainer.classList.add("active");
    } else {
      quantitySelector.classList.remove("active");
      quantitySelector.classList.add("hidden");
      addToCartButton.classList.remove("hidden");
      imageContainer.classList.remove("active");
    }
  }

  document.addEventListener(CART_UPDATED_EVENT, updateProductCardUI);

  updateProductCardUI();

  cartIcon.src = "./images/icon-add-to-cart.svg";
  cartIcon.alt = "Add to cart";
  cartSpan.innerText = "Add to cart";

  addToCartButton.classList.add("add-to-cart");

  addToCartButton.addEventListener("click", () => {
    const cartProducts = JSON.parse(
      localStorage.getItem("cartProducts") || "{}"
    );

    const updatedCart = { ...cartProducts, [product.id]: 1 };

    window.localStorage.setItem("cartProducts", JSON.stringify(updatedCart));

    const event = new CustomEvent(CART_UPDATED_EVENT);
    document.dispatchEvent(event);

    updateProductCardUI();
  });

  minusButton.addEventListener("click", () => {
    const cartProducts = JSON.parse(
      localStorage.getItem("cartProducts") || "{}"
    );

    let currentQty = Number.parseInt(quantityDisplay.textContent || "0");

    if (currentQty > 0) {
      currentQty--;

      const updatedCart = { ...cartProducts };

      if (currentQty === 0) {
        delete updatedCart[product.id];
      } else {
        updatedCart[product.id] = currentQty;
      }

      window.localStorage.setItem("cartProducts", JSON.stringify(updatedCart));

      const event = new CustomEvent(CART_UPDATED_EVENT);
      document.dispatchEvent(event);

      updateProductCardUI();
    }
  });

  plusButton.addEventListener("click", () => {
    const cartProducts = JSON.parse(
      localStorage.getItem("cartProducts") || "{}"
    );

    let currentQty = Number.parseInt(quantityDisplay.textContent || "0");
    currentQty++;

    const updatedCart = { ...cartProducts, [product.id]: currentQty };

    window.localStorage.setItem("cartProducts", JSON.stringify(updatedCart));

    const event = new CustomEvent(CART_UPDATED_EVENT);
    document.dispatchEvent(event);

    updateProductCardUI();
  });

  imageContainer.appendChild(image);

  addToCartButton.appendChild(cartIcon);
  addToCartButton.appendChild(cartSpan);

  quantitySelector.appendChild(minusButton);
  quantitySelector.appendChild(quantityDisplay);
  quantitySelector.appendChild(plusButton);

  imageContainer.appendChild(addToCartButton);
  imageContainer.appendChild(quantitySelector);

  productInfo.appendChild(category);
  productInfo.appendChild(name);
  productInfo.appendChild(price);

  productCard.appendChild(imageContainer);
  productCard.appendChild(productInfo);

  return productCard;
}
