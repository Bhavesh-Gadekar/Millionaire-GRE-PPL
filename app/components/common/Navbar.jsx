"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Students", path: "/students" },
    { label: "About", path: "/about" },
    { label: "Admin", path: "/admin/dashboard" },
    { label: "Login", path: "/admin/login" },
  ];

  return (
    <nav
      style={{
        padding: "16px 24px",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "32px",
      }}
    >
      {/* Brand */}
      <h1 style={{ margin: 0, fontSize: "24px", marginRight: "40px" }}>
        Millionaire GRE
      </h1>

      {/* Navigation items */}
      {navItems.map((item) => {
        const isActive =
          item.path === "/"
            ? pathname === "/"
            : pathname.startsWith(item.path);

        return (
          <div
            key={item.path}
            style={{ position: "relative" }}
            onClick={() => router.push(item.path)}
          >
            {/* Text */}
            <button
              style={navText}
              onMouseEnter={(e) => {
                const line = e.currentTarget.nextSibling;
                line.style.transform = "scaleX(1)";
              }}
              onMouseLeave={(e) => {
                const line = e.currentTarget.nextSibling;
                if (!isActive) {
                  line.style.transform = "scaleX(0)";
                }
              }}
            >
              {item.label}
            </button>

            {/* Animated underline */}
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: -4,
                height: "2px",
                width: "100%",
                backgroundColor: "#a855f7",
                transform: isActive ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
        );
      })}
    </nav>
  );
}

/* Text-only button style */
const navText = {
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};
