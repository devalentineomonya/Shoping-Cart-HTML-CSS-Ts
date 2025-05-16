
import type { TProduct } from "./main"
import productData from "./data.json"

interface CartItem {
  product: TProduct
  quantity: number
}

export class OrderConfirmationModal {
  private dialogElement: HTMLDialogElement

  constructor() {
    this.dialogElement = document.createElement("dialog")
    this.dialogElement.classList.add("order-confirmation-modal")
    this.dialogElement.setAttribute("role", "dialog")
    this.dialogElement.setAttribute("aria-labelledby", "modal-title")

    this.createModalContent()
    this.setupEventListeners()
  }

  private createModalContent(): void {
    const modalContent = document.createElement("div")
    modalContent.classList.add("modal-content")

    const checkmarkIcon = document.createElement("div")
    checkmarkIcon.classList.add("checkmark-icon")
    const checkmark = document.createElement("div")
    checkmark.classList.add("checkmark")
    checkmark.innerHTML = "✓"
    checkmarkIcon.appendChild(checkmark)
    modalContent.appendChild(checkmarkIcon)

    const closeButton = document.createElement("button")
    closeButton.classList.add("close-button")
    closeButton.setAttribute("aria-label", "Close dialog")
    closeButton.textContent = "×"
    modalContent.appendChild(closeButton)

    const title = document.createElement("h2")
    title.id = "modal-title"
    title.classList.add("confirmation-title")
    title.textContent = "Order Confirmed"
    modalContent.appendChild(title)

    const message = document.createElement("p")
    message.classList.add("confirmation-message")
    message.textContent = "We hope you enjoy your food!"
    modalContent.appendChild(message)

    const cartProducts = JSON.parse(localStorage.getItem("cartProducts") || "{}")
    const cartItems: CartItem[] = []
    let orderTotal = 0

    Object.keys(cartProducts).forEach((productId) => {
      const quantity = cartProducts[productId]
      const product = productData.find((p: TProduct) => p.id === productId)
      if (product) {
        cartItems.push({ product, quantity })
        orderTotal += product.price * quantity
      }
    })

    const orderSummary = this.createOrderSummary(cartItems, orderTotal)
    modalContent.appendChild(orderSummary)



    const treeIcon = document.createElement("span")
    treeIcon.classList.add("tree-icon")
    treeIcon.textContent = "🌳"



    const startNewOrderBtn = document.createElement("button")
    startNewOrderBtn.classList.add("start-new-order")
    startNewOrderBtn.textContent = "Start New Order"
    startNewOrderBtn.addEventListener("click", () => this.close())
    modalContent.appendChild(startNewOrderBtn)

    this.dialogElement.appendChild(modalContent)
  }

  private createOrderSummary(cartItems: CartItem[], orderTotal: number): HTMLElement {
    const orderSummary = document.createElement("div")
    orderSummary.classList.add("order-summary")

    const orderItemsList = document.createElement("div")
    orderItemsList.classList.add("order-items")

    cartItems.forEach(({ product, quantity }) => {
      const itemTotal = product.price * quantity

      const orderItem = document.createElement("div")
      orderItem.classList.add("order-item")

      const productImage = document.createElement("img")
      productImage.src = product.image.thumbnail
      productImage.alt = product.name
      productImage.classList.add("product-thumbnail")

      const productInfo = document.createElement("div")
      productInfo.classList.add("product-info")

      const productName = document.createElement("div")
      productName.classList.add("product-name")
      productName.textContent = product.name

      const quantityPrice = document.createElement("div")
      quantityPrice.classList.add("quantity-price")
      quantityPrice.textContent = `${quantity}x @ $${product.price.toFixed(2)}`

      productInfo.appendChild(productName)
      productInfo.appendChild(quantityPrice)

      const itemTotalElement = document.createElement("div")
      itemTotalElement.classList.add("item-total")
      itemTotalElement.textContent = `$${itemTotal.toFixed(2)}`

      orderItem.appendChild(productImage)
      orderItem.appendChild(productInfo)
      orderItem.appendChild(itemTotalElement)

      orderItemsList.appendChild(orderItem)
    })

    orderSummary.appendChild(orderItemsList)

    const orderTotalSection = document.createElement("div")
    orderTotalSection.classList.add("order-total-section")

    const orderTotalLabel = document.createElement("span")
    orderTotalLabel.classList.add("order-total-label")
    orderTotalLabel.textContent = "Order Total"

    const orderTotalAmount = document.createElement("span")
    orderTotalAmount.classList.add("order-total-amount")
    orderTotalAmount.textContent = `$${orderTotal.toFixed(2)}`

    orderTotalSection.appendChild(orderTotalLabel)
    orderTotalSection.appendChild(orderTotalAmount)

    orderSummary.appendChild(orderTotalSection)

    return orderSummary
  }

  private setupEventListeners(): void {
    const closeButton = this.dialogElement.querySelector(".close-button")
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close())
    }

    this.dialogElement.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close()
    })

    this.dialogElement.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return

      const focusableElements = Array.from(
        this.dialogElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ) as HTMLElement[]

      if (!focusableElements.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    })
  }

  public show(): void {
    document.body.appendChild(this.dialogElement)
    this.dialogElement.showModal()
    const closeButton = this.dialogElement.querySelector(".close-button") as HTMLElement
    if (closeButton) closeButton.focus()
  }

  public close(): void {
    this.dialogElement.close()
    this.dialogElement.remove()
    document.dispatchEvent(new CustomEvent("order-modal-closed"))
  }
}
