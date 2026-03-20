import { ShoppingBag, Package, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen md:min-h-[calc(100vh-4rem)]">

        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/HeroBCKGRNDRight.mp4" type="video/mp4" />
        </video>

        {/* Optional Overlay (helps readability if needed) */}
        {/* <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_80%_50%,rgba(0,0,0,0)_25%,rgba(0,0,0,0.6)_100%)]"/> */}

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="text-[#7B8FA3] space-y-6">
              <h1 className="text-5xl font-bold md:text-6xl tracking-tight">
                Welcome to<br />
                <span className="block mt-2">THE CLICKERS</span>
              </h1>

              <p className="text-xl text-[#7B8FA3] max-w-lg">
                Your destination for premium products. Pre-order now and be the first to get your hands on our exclusive items.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-md bg-[#7B8FA3] text-white hover:bg-gray-100 text-center font-medium transition"
                >
                  Browse Products
                </Link>

                <button className="px-6 py-3 rounded-md border border-[#7B8FA3] text-[#7B8FA3] hover:bg-[#7B8FA3]/10">
                  Learn More
                </button>

              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-[#7B8FA3]">
              Why Pre-Order With Us?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get exclusive benefits when you pre-order from The Clickers booth
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">

            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition max-w-sm w-full flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 bg-[#7B8FA3]">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="mb-2">Early Access</h3>
              <p className="text-gray-600">
                Be the first to receive our products before they're available to the public
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition max-w-sm w-full flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 bg-[#7B8FA3]">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="mb-2">Exclusive Items</h3>
              <p className="text-gray-600">
                Access to limited edition products available only through pre-order
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition max-w-sm w-full flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-4 bg-[#7B8FA3]">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="mb-2">Guaranteed Stock</h3>
              <p className="text-gray-600">
                Reserve your items now and avoid missing out
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="products" className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">

          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto mb-3"
          />

          <h2 className="text-4xl mb-6 text-[#7B8FA3]">
            Ready to Pre-Order?
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of satisfied customers who have already secured their orders.
          </p>

          <button className="px-6 py-3 rounded-md text-white bg-[#7B8FA3] hover:opacity-90">
            Start Pre-Ordering
          </button>

        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}