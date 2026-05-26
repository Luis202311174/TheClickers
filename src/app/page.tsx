import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  PenTool,
  SearchCheck,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  const sampleImages = [
  "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7",
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa",
  "https://images.unsplash.com/photo-1608889175250-1d2b8c3b7b0d",
];

  return (
    <div className="min-h-screen bg-white">

      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/HeroBCKGRNDRight.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="text-[#7B8FA3] space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to{" "}
                <span className="block mt-2 text-[#7B8FA3]">
                  THE CLICKERS
                </span>
              </h1>

              <p className="text-xl text-[#7B8FA3] max-w-lg">
                Pre-order exclusive products or request custom sticker designs tailored to your style.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">

                <Link
                  href="/custom-design"
                  className="px-6 py-3 rounded-md bg-[#7B8FA3] text-white hover:bg-gray-100 text-center font-medium transition"
                >
                  Custom Stickers
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#7B8FA3] mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Pre-orders and custom sticker requests made simple and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <Clock className="w-6 h-6 mx-auto mb-4 text-[#7B8FA3]" />
              <h3 className="font-semibold mb-2">Early Access</h3>
              <p className="text-gray-600">Get products before public release.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <Package className="w-6 h-6 mx-auto mb-4 text-[#7B8FA3]" />
              <h3 className="font-semibold mb-2">Exclusive Items</h3>
              <p className="text-gray-600">Limited items available via pre-order.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <PenTool className="w-6 h-6 mx-auto mb-4 text-[#7B8FA3]" />
              <h3 className="font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">Personalize your keycap color!</p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#7B8FA3] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A simple process for both pre-orders and custom requests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div>
              <div className="w-14 h-14 mx-auto rounded-full bg-[#7B8FA3] flex items-center justify-center mb-4">
                <ShoppingBag className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">1. Choose</h3>
              <p className="text-gray-600">
                Browse products or submit a custom design request.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 mx-auto rounded-full bg-[#7B8FA3] flex items-center justify-center mb-4">
                <CheckCircle className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">2. Confirm</h3>
              <p className="text-gray-600">
                Place your order and wait for confirmation or approval.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 mx-auto rounded-full bg-[#7B8FA3] flex items-center justify-center mb-4">
                <Clock className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">3. Track</h3>
              <p className="text-gray-600">
                Monitor your order or request status in your dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* STATUS TRACKING TEASER */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <SearchCheck className="mx-auto mb-6 text-[#7B8FA3]" size={40} />

          <h2 className="text-3xl md:text-4xl font-semibold text-[#7B8FA3] mb-6">
            Track Your Orders & Requests
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Stay updated on your pre-orders and custom sticker requests in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <Link
              href="/pre-orders"
              className="px-6 py-3 rounded-md bg-[#7B8FA3] text-white hover:opacity-90 transition text-center"
            >
              View Pre-Orders
            </Link>

            <Link
              href="/designs"
              className="px-6 py-3 rounded-md border border-[#7B8FA3] text-[#7B8FA3] hover:bg-[#7B8FA3]/10 transition text-center"
            >
              View Custom Requests
            </Link>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}