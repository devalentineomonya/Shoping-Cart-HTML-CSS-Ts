import "./style.css"
import productData from "./data.json"
import { renderProduct } from "./productCard"
import { initializeCart, CART_UPDATED_EVENT } from "./cart"
export type TProduct = typeof productData[0]
document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector<HTMLDivElement>("#app")!
  const main = document.createElement("main")
  main.classList.add("container")

  const mainListing = document.createElement("div")
  mainListing.classList.add("container-listing")

  const mainCart = document.createElement("div")
  mainCart.classList.add("container-cart")
  mainCart.appendChild(initializeCart())

  main.append(mainListing, mainCart)
  app.appendChild(main)

  productData.forEach((product) => {
    mainListing.appendChild(renderProduct(product))
  })

  document.addEventListener(CART_UPDATED_EVENT, () => {
    const currentCart = document.getElementById("shopping-cart")
    if (currentCart) {
      mainCart.replaceChild(initializeCart(), currentCart)
    }
  })
})
