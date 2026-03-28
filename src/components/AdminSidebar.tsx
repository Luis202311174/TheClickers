"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarItem {
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Add Product", path: "/admin/add-products" },
  { label: "Pre-Orders", path: "/admin/pre-orders" },
  { label: "Requests", path: "/admin/customer-requests" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setActive(pathname || "");
  }, [pathname]);

  const handleNavigation = (path: string) => {
    setActive(path);
    router.push(path);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-6 flex flex-col fixed">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h2>
      <nav className="flex flex-col gap-4 overflow-y-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`text-left p-3 rounded-md w-full hover:bg-gray-100 transition ${
              active === item.path ? "bg-gray-100 font-semibold" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}