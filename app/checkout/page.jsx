"use client";

import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import useCartStore from "../stores/cartStore";
import useTelegramStore from "../stores/telegramStore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const steps = [
  { name: "Cart", href: "#", status: "complete" },
  { name: "Billing Information", href: "#", status: "current" },
  { name: "Confirmation", href: "#", status: "upcoming" },
];

export default function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const { botToken, chatId } = useTelegramStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const subtotal = getTotalPrice();
  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    email: "",
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvc: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout data:", {
      cart,
      subtotal,
      shipping,
      tax,
      total,
      formData,
    });

    clearCart();
  };

  const handleCheckout = async () => {
    setLoading(true);
    if (!botToken || !chatId) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <X className="h-6 w-6 text-red-500" />{" "}
            <span>Please configure your telegram bot first</span>
          </div>
        ),
      });
      setLoading(false);
      return;
    }

    const parseMode = "HTML";

    const user = {
      name: formData.nameOnCard,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.region}, ${formData.postalCode}`,
      phone: formData.company,
    };

    const message = `
      <b>🛒 Checkout Details</b>
      <b>-----------------------------</b>
      <b>👤 User Information</b>
      <b>Name:</b> ${user.name}
      <b>Email:</b> ${user.email}
      <b>Address:</b> ${user.address}
      <b>Phone:</b> ${user.phone}
      <b>-----------------------------</b>
      <b>📦 Order Summary</b>
      ${cart
        .map(
          (item) => `
        <b>${item.title}</b>
        <b>Price:</b> $${item.price.toFixed(2)}
        <b>Quantity:</b> ${item.quantity}
        <b>Total:</b> $${(item.price * item.quantity).toFixed(2)}
      `
        )
        .join("")}
      <b>-----------------------------</b>
      <b>Subtotal:</b> $${subtotal.toFixed(2)}
      <b>Shipping:</b> $${shipping.toFixed(2)}
      <b>Tax:</b> $${tax.toFixed(2)}
      <b>Total:</b> $${total.toFixed(2)}
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
        toast({
          description: (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />{" "}
              <span>Your orders have been saved successfully</span>
            </div>
          ),
        });
        router.push("/product");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        description: (
          <div className="flex items-center gap-2">
            <X className="h-6 w-6 text-red-500" />{" "}
            <span>Please check your settings again.</span>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
      />
      <div
        aria-hidden="true"
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block"
      />

      <header className="relative border-b border-gray-200 bg-white text-sm font-medium text-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative flex justify-end sm:justify-center">
            <a href="#" className="absolute left-0 top-1/2 -mt-4">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <nav aria-label="Progress" className="hidden sm:block">
              <ol role="list" className="flex space-x-4">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className="flex items-center">
                    {step.status === "current" ? (
                      <a
                        href={step.href}
                        aria-current="page"
                        className="text-indigo-600"
                      >
                        {step.name}
                      </a>
                    ) : (
                      <a href={step.href}>{step.name}</a>
                    )}

                    {stepIdx !== steps.length - 1 ? (
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="ml-4 h-5 w-5 text-gray-300"
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="sm:hidden">Step 2 of 4</p>
          </div>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {cart.map((product) => (
                <li
                  key={product.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <img
                    alt={product.title}
                    src={product.image}
                    className="h-20 w-20 flex-none rounded-md object-contain object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product.title}</h3>
                    <h1>x{product.quantity}</h1>
                  </div>
                  <p className="flex-none text-base font-medium">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>${shipping.toFixed(2)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>${tax.toFixed(2)}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
              <div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
                <div className="mx-auto max-w-lg">
                  <PopoverButton className="flex w-full items-center py-6 font-medium">
                    <span className="mr-auto text-base">Total</span>
                    <span className="mr-2 text-base">${total.toFixed(2)}</span>
                    <ChevronUpIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-500"
                    />
                  </PopoverButton>
                </div>
              </div>

              <PopoverBackdrop
                transition
                className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
              />

              <PopoverPanel
                transition
                className="relative transform bg-white px-4 py-6 transition duration-300 ease-in-out data-[closed]:translate-y-full sm:px-6"
              >
                <dl className="mx-auto max-w-lg space-y-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd>${subtotal.toFixed(2)}</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd>${shipping.toFixed(2)}</dd>
                  </div>

                  <div className="flex items-center justify-between">
                    <dt className="text-gray-600">Taxes</dt>
                    <dd>${tax.toFixed(2)}</dd>
                  </div>
                </dl>
              </PopoverPanel>
            </Popover>
          </div>
        </section>

        <form
          className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
          onSubmit={handleSubmit}
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                Contact information
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="payment-heading" className="mt-10">
              <h2
                id="payment-heading"
                className="text-lg font-medium text-gray-900"
              >
                Payment details
              </h2>

              <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                <div className="col-span-3 sm:col-span-4">
                  <label
                    htmlFor="name-on-card"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name on card
                  </label>
                  <div className="mt-1">
                    <input
                      id="name-on-card"
                      name="nameOnCard"
                      type="text"
                      autoComplete="cc-name"
                      required
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-4">
                  <label
                    htmlFor="card-number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card number
                  </label>
                  <div className="mt-1">
                    <input
                      id="card-number"
                      name="cardNumber"
                      type="text"
                      autoComplete="cc-number"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-3">
                  <label
                    htmlFor="expiration-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiration date (MM/YY)
                  </label>
                  <div className="mt-1">
                    <input
                      id="expiration-date"
                      name="expirationDate"
                      type="text"
                      autoComplete="cc-exp"
                      required
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CVC
                  </label>
                  <div className="mt-1">
                    <input
                      id="cvc"
                      name="cvc"
                      type="text"
                      autoComplete="csc"
                      required
                      value={formData.cvc}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-lg font-medium text-gray-900"
              >
                Shipping address
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      id="apartment"
                      name="apartment"
                      type="text"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      id="region"
                      name="region"
                      type="text"
                      autoComplete="address-level1"
                      required
                      value={formData.region}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      id="postal-code"
                      name="postalCode"
                      type="text"
                      autoComplete="postal-code"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="block py-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-3"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="billing-heading" className="mt-10">
              <h2
                id="billing-heading"
                className="text-lg font-medium text-gray-900"
              >
                Billing information
              </h2>

              <div className="mt-6 flex items-center">
                <input
                  defaultChecked
                  id="same-as-shipping"
                  name="same-as-shipping"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-2">
                  <label
                    htmlFor="same-as-shipping"
                    className="text-sm font-medium text-gray-900"
                  >
                    Same as shipping information
                  </label>
                </div>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="submit"
                onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
              >
                Purchase
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                You won't be charged until the next step.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
