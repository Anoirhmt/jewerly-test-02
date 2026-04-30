import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <main className="w-full px-0 sm:px-6 pt-[7rem] sm:pt-40 md:pt-52 pb-8 bg-white min-h-screen">
      <div className="w-full">
        <CheckoutForm />
      </div>
    </main>
  )
}
