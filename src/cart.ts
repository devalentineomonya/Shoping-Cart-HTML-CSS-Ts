import type { TProduct } from "./main"
import productData from "./data.json"
import { OrderConfirmationModal } from "./modal";


interface CartItem {
  product: TProduct
  quantity: number
}

const CART_UPDATED_EVENT = "cart-updated"

function dispatchCartUpdateEvent() {
  const event = new CustomEvent(CART_UPDATED_EVENT)
  document.dispatchEvent(event)
}

export function renderCart(): HTMLElement {
  const cartContainer = document.createElement("div")
  cartContainer.id = "shopping-cart"

  const cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "{}")
  const cartItems: CartItem[] = []
  let totalItems = 0

  Object.keys(cartProducts).forEach((productId) => {
    const quantity = cartProducts[productId]
    totalItems += quantity
    const product = productData.find((p: TProduct) => p.id === productId)
    if (product) cartItems.push({ product, quantity })
  })

  if (cartItems.length === 0) {
    const emptyMessage = document.createElement("div")
    const emptyImage = document.createElement("img")
    emptyImage.src = "./images/illustration-empty-cart.svg"
    emptyMessage.classList.add("empty-cart")

    emptyMessage.textContent = "Your cart is empty"
    emptyMessage.appendChild(emptyImage)
    cartContainer.appendChild(emptyMessage)
    return cartContainer
  }

  const cartHeader = document.createElement("h2")
  cartHeader.classList.add("cart-header")
  cartHeader.textContent = `Your Cart (${totalItems})`
  cartContainer.appendChild(cartHeader)

  const itemsList = document.createElement("div")
  itemsList.classList.add("cart-items")
  let orderTotal = 0

  cartItems.forEach((item) => {
    const { product, quantity } = item
    const itemTotal = product.price * quantity
    orderTotal += itemTotal

    const itemElement = document.createElement("div")
    itemElement.classList.add("cart-item")
    itemElement.setAttribute("data-product-id", product.id)

    const itemInfo = document.createElement("div")
    itemInfo.classList.add("item-info")

    const itemName = document.createElement("div")
    itemName.classList.add("item-name")
    const quantitySpan = document.createElement("span")
    quantitySpan.classList.add("item-quantity")
    quantitySpan.textContent = `${quantity}x`
    const nameSpan = document.createElement("span")
    nameSpan.textContent = product.name
    itemName.append(quantitySpan, " ", nameSpan)

    const itemPrice = document.createElement("div")
    itemPrice.classList.add("item-price")
    const unitPrice = document.createElement("span")
    unitPrice.classList.add("unit-price")
    unitPrice.textContent = `@ $${product.price.toFixed(2)}`
    const totalPrice = document.createElement("span")
    totalPrice.classList.add("total-price")
    totalPrice.textContent = `$${itemTotal.toFixed(2)}`
    itemPrice.append(unitPrice, " ", totalPrice)

    const quantityEditor = document.createElement("div")
    quantityEditor.classList.add("quantity-editor")
    const minusBtn = document.createElement("button")
    minusBtn.classList.add("quantity-btn", "minus-btn")
    minusBtn.innerHTML = "&#8722;"
    const quantityValue = document.createElement("span")
    quantityValue.classList.add("quantity-value")
    quantityValue.textContent = quantity.toString()
    const plusBtn = document.createElement("button")
    plusBtn.classList.add("quantity-btn", "plus-btn")
    plusBtn.innerHTML = "&#43;"

    minusBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      const updatedCart = { ...cartProducts }
      if (quantity > 1) updatedCart[product.id] = quantity - 1
      else delete updatedCart[product.id]
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart))
      dispatchCartUpdateEvent()
    })

    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      const updatedCart = { ...cartProducts, [product.id]: quantity + 1 }
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart))
      dispatchCartUpdateEvent()
    })

    quantityEditor.append(minusBtn, quantityValue, plusBtn)

    const removeButton = document.createElement("button")
    removeButton.classList.add("remove-item")
    removeButton.innerHTML = "&times;"
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation()
      const updatedCart = { ...cartProducts }
      delete updatedCart[product.id]
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart))
      dispatchCartUpdateEvent()
    })

    itemInfo.append(itemName, itemPrice)
    const itemActions = document.createElement("div")
    itemActions.classList.add("item-actions")
    itemActions.append(quantityEditor, removeButton)
    itemElement.append(itemInfo, itemActions)
    itemsList.appendChild(itemElement)
  })

  cartContainer.append(itemsList)

  const orderTotalSection = document.createElement("div")
  orderTotalSection.classList.add("order-total-section")
  orderTotalSection.innerHTML = `
    <span class="order-total-label">Order Total</span>
    <span class="order-total-amount">$${orderTotal.toFixed(2)}</span>
  `
  cartContainer.appendChild(orderTotalSection)

  const deliveryMessage = document.createElement("div")
  deliveryMessage.classList.add("delivery-message")
  deliveryMessage.innerHTML = `
    <span class="tree-icon">🌳</span>
    <span>This is a <strong>carbon-neutral</strong> delivery</span>
  `
  cartContainer.appendChild(deliveryMessage)

  const confirmButton = document.createElement("button")
  confirmButton.classList.add("confirm-order")
  confirmButton.textContent = "Confirm Order"
  confirmButton.addEventListener("click", () => {
    const currentCart = JSON.parse(localStorage.getItem("cartProducts") || "{}")
    const cartItems: CartItem[] = []
    let orderTotal = 0

    Object.keys(currentCart).forEach((productId) => {
      const quantity = currentCart[productId]
      const product = productData.find((p: TProduct) => p.id === productId)
      if (product) {
        cartItems.push({ product, quantity })
        orderTotal += product.price * quantity
      }
    })

    const modal = new OrderConfirmationModal()
    modal.show()

    localStorage.setItem("cartProducts", "{}")
    dispatchCartUpdateEvent()
  })
  cartContainer.appendChild(confirmButton)

  return cartContainer
}


export function initializeCart(): HTMLElement {
  return renderCart()
}

export { CART_UPDATED_EVENT, dispatchCartUpdateEvent }
