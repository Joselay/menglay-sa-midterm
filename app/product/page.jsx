"use client";

import {
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import useStore from "../stores/store";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useCartStore from "../stores/cartStore";
import useTelegramStore from "../stores/telegramStore";
import { BadgeCheck } from "lucide-react";

const perks = [
  {
    name: "Free returns",
    imageUrl:
      "https://tailwindui.com/plus/img/ecommerce/icons/icon-returns-light.svg",
    description:
      "Not what you expected? Place it back in the parcel and attach the pre-paid postage stamp.",
  },
  {
    name: "Same day delivery",
    imageUrl:
      "https://tailwindui.com/plus/img/ecommerce/icons/icon-calendar-light.svg",
    description:
      "We offer a delivery service that has never been done before. Checkout today and receive your products within hours.",
  },
  {
    name: "All year discount",
    imageUrl:
      "https://tailwindui.com/plus/img/ecommerce/icons/icon-gift-card-light.svg",
    description:
      'Looking for a deal? You can use the code "ALLYEAR" at checkout and get money off all year round.',
  },
  {
    name: "For the planet",
    imageUrl:
      "https://tailwindui.com/plus/img/ecommerce/icons/icon-planet-light.svg",
    description:
      "We’ve pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
];

const footerNavigation = {
  products: [
    { name: "Bags", href: "#" },
    { name: "Tees", href: "#" },
    { name: "Objects", href: "#" },
    { name: "Home Goods", href: "#" },
    { name: "Accessories", href: "#" },
  ],
  company: [
    { name: "Who we are", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Press", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy", href: "#" },
  ],
  customerService: [
    { name: "Contact", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Warranty", href: "#" },
    { name: "Secure Payments", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Find a store", href: "#" },
  ],
};

export default function ProductsList() {
  const { products, loading, error, fetchProducts } = useStore();
  const { cart, loadCart, getUniqueItemsCount } = useCartStore();
  const { botToken, chatId } = useTelegramStore();

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, [fetchProducts, loadCart]);

  const handleSendMessage = async () => {
    if (!botToken || !chatId) {
      alert("Please configure Telegram bot settings first.");
      return;
    }

    const parseMode = "HTML";

    const message = `
      <b>🛒 Checkout Details</b>
      <b>-----------------------------</b>
      <b>👤 User Information</b>
      <b>Name:</b> John Doe
      <b>Email:</b> john.doe@example.com
      <b>Address:</b> 123 Main St, City, State, 12345
      <b>Phone:</b> +1234567890
      <b>-----------------------------</b>
      <b>📦 Order Summary</b>
      ${cart
        .map(
          (item) => `
        <b>${item.title}:</b> $${item.price.toFixed(2)} x ${
            item.quantity
          } = $${(item.price * item.quantity).toFixed(2)}
      `
        )
        .join("")}
      <b>-----------------------------</b>
      <b>Subtotal:</b> $${cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)}
      <b>Shipping:</b> $15.00
      <b>Tax:</b> $${(
        cart.reduce((total, item) => total + item.price * item.quantity, 0) *
        0.08
      ).toFixed(2)}
      <b>Total:</b> $${(
        cart.reduce((total, item) => total + item.price * item.quantity, 0) +
        15 +
        cart.reduce((total, item) => total + item.price * item.quantity, 0) *
          0.08
      ).toFixed(2)}
      <b>-----------------------------</b>
      <b>🎉 Thank you for your purchase!</b>
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=${parseMode}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log("Message sent successfully:", data);
        alert("Message sent successfully!");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please check your settings.");
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm">
          <div className="text-center">
            <Image
              width={150}
              height={150}
              src="/loading.gif"
              alt="Loading image"
              priority
            />
          </div>
        </div>
      )}

      <header className="relative mt-4">
        <nav aria-label="Top">
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="hidden lg:flex lg:flex-1 lg:items-center">
                  <a href="/" className="flex items-center gap-2 group">
                    <img
                      alt="logo"
                      src="/profile.jpg"
                      className="h-12 w-auto rounded-full"
                    />
                    <span className="text-2xl font-semibold group-hover:text-indigo-500 transition duration-200 flex items-center ml-2">
                      JOSE
                      <BadgeCheck
                        size={24}
                        className="fill-indigo-500 stroke-white group-hover:fill-gray-600 transition duration-200"
                      />
                    </span>
                  </a>
                </div>

                <a href="#" className="lg:hidden">
                  <span className="sr-only">Your Company</span>
                  <img alt="" src="/next.svg" className="h-8 w-auto" />
                </a>

                <div className="flex flex-1 items-center justify-end">
                  <a
                    href="#"
                    className="hidden text-sm font-medium text-gray-700 hover:text-gray-800 lg:block"
                  >
                    Search
                  </a>

                  <div className="flex items-center lg:ml-8">
                    {/* Help */}
                    <a
                      href="#"
                      className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
                    >
                      <span className="sr-only">Help</span>
                      <QuestionMarkCircleIcon
                        aria-hidden="true"
                        className="h-6 w-6"
                      />
                    </a>
                    <a
                      href="#"
                      className="hidden text-sm font-medium text-gray-700 hover:text-gray-800 lg:block"
                    >
                      Help
                    </a>

                    {/* Cart */}
                    <div className="ml-4 flow-root lg:ml-8">
                      <Link
                        href="/cart"
                        className="group -m-2 flex items-center p-2"
                      >
                        <ShoppingBagIcon
                          aria-hidden="true"
                          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                          {getUniqueItemsCount()}{" "}
                        </span>
                        <span className="sr-only">items in cart, view bag</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section aria-labelledby="trending-heading">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
            <div className="md:flex md:items-center md:justify-between">
              <h2
                id="favorites-heading"
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                Trending Products
              </h2>
              <a
                href="#"
                className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
              >
                Shop the collection
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-y-12 lg:gap-x-12">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                    <img
                      alt={product.title}
                      src={product.image}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    <Link href={`/product/${product.id}`}>
                      <span className="absolute inset-0" />
                      {product.title}
                    </Link>
                  </h3>

                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ${product.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-sm md:hidden">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Shop the collection
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="perks-heading"
          className="border-t border-gray-200 bg-gray-50"
        >
          <h2 id="perks-heading" className="sr-only">
            Our perks
          </h2>

          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
              {perks.map((perk) => (
                <div
                  key={perk.name}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                >
                  <div className="md:flex-shrink-0">
                    <div className="flow-root">
                      <img
                        alt=""
                        src={perk.imageUrl}
                        className="-my-1 mx-auto h-24 w-auto"
                      />
                    </div>
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-base font-medium text-gray-900">
                      {perk.name}
                    </h3>
                    <p className="mt-3 text-sm text-gray-500">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-gray-50">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 py-20">
            <div className="grid grid-cols-1 md:grid-flow-col md:auto-rows-min md:grid-cols-12 md:gap-x-8 md:gap-y-16">
              {/* Image section */}
              <div className="col-span-1 md:col-span-2 lg:col-start-1 lg:row-start-1">
                <img
                  alt=""
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </div>

              {/* Sitemap sections */}
              <div className="col-span-6 mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 md:col-start-3 md:row-start-1 md:mt-0 lg:col-span-6 lg:col-start-2">
                <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Products
                    </h3>
                    <ul role="list" className="mt-6 space-y-6">
                      {footerNavigation.products.map((item) => (
                        <li key={item.name} className="text-sm">
                          <a
                            href={item.href}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Company
                    </h3>
                    <ul role="list" className="mt-6 space-y-6">
                      {footerNavigation.company.map((item) => (
                        <li key={item.name} className="text-sm">
                          <a
                            href={item.href}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Customer Service
                  </h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {footerNavigation.customerService.map((item) => (
                      <li key={item.name} className="text-sm">
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Newsletter section */}
              <div className="mt-12 md:col-span-8 md:col-start-3 md:row-start-2 md:mt-0 lg:col-span-4 lg:col-start-9 lg:row-start-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Sign up for our newsletter
                </h3>
                <p className="mt-6 text-sm text-gray-500">
                  The latest deals and savings, sent to your inbox weekly.
                </p>
                <form className="mt-2 flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    type="text"
                    required
                    autoComplete="email"
                    className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 py-10 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2021 Your Company, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
