import React from "react";
import { NavLink } from "react-router";

const navLinks = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Products", path: "/admin/products" },
  { name: "Categories", path: "/admin/categories" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Users", path: "/admin/users" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen shrink-0">
      <div className="p-6 text-xl font-bold tracking-wide border-b border-slate-800">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/"
          className="block text-center text-xl text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Storefront
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;