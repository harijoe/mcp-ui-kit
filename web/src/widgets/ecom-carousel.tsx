import "@/index.css";

import { useState } from "react";
import {
  mountWidget,
  useLayout,
  useOpenExternal,
  useRequestModal,
  useUser,
  useWidgetState,
} from "skybridge/web";
import { useToolInfo } from "../helpers.js";

const translations: Record<string, Record<string, string>> = {
  en: {
    loading: "Loading products...",
    noProducts: "No product found",
    addToCart: "Add to cart",
    removeFromCart: "Remove",
  },
  fr: {
    loading: "Chargement des produits...",
    noProducts: "Aucun produit trouvé",
    addToCart: "Ajouter",
    removeFromCart: "Retirer",
  },
  es: {
    loading: "Cargando productos...",
    noProducts: "No se encontraron productos",
    addToCart: "Añadir",
    removeFromCart: "Quitar",
  },
  de: {
    loading: "Produkte werden geladen...",
    noProducts: "Keine Produkte gefunden",
    addToCart: "Hinzufügen",
    removeFromCart: "Entfernen",
  },
};

const CHECKOUT_URL = "https://alpic.ai";

function EcomCarousel() {
  const { theme } = useLayout();
  const { locale } = useUser();
  const { open, isOpen } = useRequestModal();
  const openExternal = useOpenExternal();

  const lang = locale?.split("-")[0] ?? "en";

  function translate(key: string) {
    return translations[lang]?.[key] ?? translations.en[key];
  }

  const { output, isPending } = useToolInfo<"ecom-carousel">();
  type Product = NonNullable<typeof output>["products"][number];
  const [selected, setSelected] = useState<Product | null>(null);

  const [cart, setCart] = useWidgetState<{ ids: number[] }>({ ids: [] });

  function toggleCart(productId: number) {
    if (cart.ids.includes(productId)) {
      setCart({ ids: cart.ids.filter((id) => id !== productId) });
    } else {
      setCart({ ids: [...cart.ids, productId] });
    }
  }

  if (isPending) {
    return (
      <div className={`${theme} container`}>
        <div className="message">{translate("loading")}</div>
      </div>
    );
  }

  if (!output || output.products.length === 0) {
    return (
      <div className={`${theme} container`}>
        <div className="message">{translate("noProducts")}</div>
      </div>
    );
  }

  if (isOpen) {
    const cartItems: Product[] = [];
    let total = 0;
    for (const p of output.products) {
      if (cart.ids.includes(p.id)) {
        cartItems.push(p);
        total += p.price;
      }
    }
    const checkoutUrl = new URL(CHECKOUT_URL);
    checkoutUrl.searchParams.set("cart", cart.ids.join(","));

    return (
      <div className={`${theme} checkout`}>
        <div className="checkout-title">Order summary</div>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>{item.title}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="checkout-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          className="checkout-button"
          onClick={() => openExternal(checkoutUrl.toString())}
        >
          Checkout
        </button>
      </div>
    );
  }

  const activeProduct = selected ?? output.products[0];

  // Helper to render star ratings
  function renderStars(rate: number) {
    const stars = [];
    const fullStars = Math.floor(rate);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`h-4 w-4 ${i < fullStars ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
          </svg>
        </i>
      );
    }
    return stars;
  }

  return (
    <div className={`${theme} bg-gray-50 dark:bg-gray-900 p-4`}>
      <button
        type="button"
        className="text-white bg-brand flex items-center box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => open({ title: "Proceed to checkout ?" })}
        disabled={cart.ids.length === 0}
      >
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
          />
        </svg>
        Cart ({cart.ids.length})
      </button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {output.products.map((product) => {
          const inCart = cart.ids.includes(product.id);
          return (
            <div
              key={product.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-56 w-full">
                <button
                  type="button"
                  className="w-full h-full"
                  onClick={() => setSelected(product)}
                >
                  <img
                    className="mx-auto h-full object-contain"
                    src={product.image}
                    alt={product.title}
                  />
                </button>
              </div>

              <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    {product.category}
                  </span>

                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      onClick={() => setSelected(product)}
                    >
                      <span className="sr-only">Quick look</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className={`rounded-lg p-2 ${inCart ? "text-red-500 hover:bg-red-100 dark:hover:bg-red-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}`}
                      onClick={() => toggleCart(product.id)}
                    >
                      <span className="sr-only">Add to Favorites</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill={inCart ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-left text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white line-clamp-2"
                  onClick={() => setSelected(product)}
                >
                  {product.title}
                </button>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product.rating.rate)}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.rating.rate.toFixed(1)}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ({product.rating.count})
                  </p>
                </div>

                <ul className="mt-2 flex items-center gap-4">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fast Delivery
                    </p>
                  </li>

                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Best Price
                    </p>
                  </li>
                </ul>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </p>

                  <button
                    type="button"
                    className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 ${
                      inCart
                        ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                        : "text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                    }`}
                    onClick={() => toggleCart(product.id)}
                  >
                    <svg
                      className="-ms-2 me-2 h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                      />
                    </svg>
                    {inCart ? translate("removeFromCart") : translate("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Panel */}
      {activeProduct && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {activeProduct.title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">{renderStars(activeProduct.rating.rate)}</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {activeProduct.rating.rate.toFixed(1)}
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              ({activeProduct.rating.count} reviews)
            </p>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {activeProduct.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default EcomCarousel;

mountWidget(<EcomCarousel />);