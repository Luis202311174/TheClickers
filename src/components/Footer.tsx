import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
    
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/brand.png" alt="Logo" width={70} height={70} />
                  <span>THE CLICKERS</span>
                </div>
                <p className="text-gray-400">
                  Your trusted source for quality products.
                </p>
              </div>
    
              <div>
                <h4 className="mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#home">Home</a></li>
                  <li><a href="#products">Products</a></li>
                </ul>
              </div>
    
              <div>
                <h4 className="mb-4">Contact</h4>
                <p className="text-gray-400">
                  theclickers@example.com
                </p>
              </div>
    </div>
            </div>
  );
}