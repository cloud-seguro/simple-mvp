"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AuthHeader } from "@/components/views/landing-page/auth-header";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.body.style.paddingTop = scrolled ? "76px" : "110px";
    return () => {
      document.body.style.paddingTop = "0px";
      document.body.style.overflow = "unset";
    };
  }, [scrolled, isMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    href: string
  ) => {
    e.preventDefault();

    // If not on home page and trying to navigate to a section, redirect to home first
    if (!isHomePage && href.startsWith("#")) {
      window.location.href = `/${href}`;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      {!scrolled && isHomePage && (
        <div className="w-full bg-yellow-400 text-black py-2 md:py-3 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
            <p className="text-sm md:text-base font-semibold text-center md:text-left">
              Evalúa tu nivel de seguridad ahora. ¡Realiza nuestra evaluación
              gratuita hoy!
            </p>
            <Button
              variant="outline"
              className="w-full md:w-auto border-black text-black hover:bg-black hover:text-yellow-400 transition-colors"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#evaluacion"
                )
              }
            >
              Comenzar
            </Button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav
        className={`py-4 px-4 md:px-8 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-bold relative transition-opacity duration-150 ${
              isMenuOpen ? "opacity-0 md:opacity-100" : "opacity-100"
            }`}
          >
            <span className="text-black">SIMPLE</span>
          </Link>

          {/* Mobile menu button */}
          <Button
            className={`md:hidden z-50 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isHomePage
              ? // Navigation for home page - section links
                [
                  { href: "#evaluacion", label: "Evaluación" },
                  { href: "#beneficios", label: "Beneficios" },
                  { href: "#testimonios", label: "Testimonios" },
                  { href: "/pricing", label: "Precios", isLink: true },
                  { href: "/blog", label: "Blog", isLink: true },
                ].map((item) =>
                  item.isLink ? (
                    <Link
                      href={item.href}
                      key={item.href}
                      legacyBehavior={false}
                    >
                      <Button
                        variant="ghost"
                        className="hover:text-yellow-500 transition-colors"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="hover:text-yellow-500 transition-colors"
                      onClick={(e) =>
                        handleNavClick(
                          e as React.MouseEvent<HTMLButtonElement>,
                          item.href
                        )
                      }
                    >
                      {item.label}
                    </Button>
                  )
                )
              : // Navigation for other pages - direct links
                [
                  { href: "/#evaluacion", label: "Evaluación", isLink: true },
                  { href: "/#beneficios", label: "Beneficios", isLink: true },
                  { href: "/#testimonios", label: "Testimonios", isLink: true },
                  {
                    href: "/pricing",
                    label: "Precios",
                    isLink: true,
                    current: pathname === "/pricing",
                  },
                  {
                    href: "/blog",
                    label: "Blog",
                    isLink: true,
                    current:
                      pathname === "/blog" || pathname.startsWith("/blog/"),
                  },
                ].map((item) => (
                  <Link href={item.href} key={item.href} legacyBehavior={false}>
                    <Button
                      variant="ghost"
                      className={`hover:text-yellow-500 transition-colors ${
                        item.current ? "text-yellow-500" : ""
                      }`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
            <div className="flex items-center space-x-2 ml-2">
              <AuthHeader />
              <Button
                className="bg-black text-white hover:bg-gray-800 transition-all transform hover:-translate-y-1"
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLButtonElement>,
                    isHomePage ? "#evaluacion" : "/#evaluacion"
                )
                }
              >
                Evaluar Ahora
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsMenuOpen(false);
          }}
          role="button"
          tabIndex={0}
        />

        {/* Mobile Menu Panel */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out transform md:hidden z-[60] ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-4 pb-6 px-6">
            {/* Add header to mobile menu */}
            <div className="flex items-center justify-between mb-8 mt-2 pb-4 border-b">
              <div className="text-2xl font-bold">
                <span className="text-black">SIMPLE</span>
              </div>
              <Button
                className="p-2"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </Button>
            </div>
            <div className="flex-1 flex flex-col space-y-2">
              {isHomePage
                ? // Mobile navigation for home page
                  [
                    { href: "#evaluacion", label: "Evaluación" },
                    { href: "#beneficios", label: "Beneficios" },
                    { href: "#testimonios", label: "Testimonios" },
                    { href: "/pricing", label: "Precios", isLink: true },
                    { href: "/blog", label: "Blog", isLink: true },
                  ].map((item) =>
                    item.isLink ? (
                      <Link
                        href={item.href}
                        key={item.href}
                        className="w-full"
                        legacyBehavior={false}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-lg py-4 hover:bg-yellow-50 hover:text-yellow-500"
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="w-full justify-start text-lg py-4 hover:bg-yellow-50 hover:text-yellow-500"
                        onClick={(e) =>
                          handleNavClick(
                            e as React.MouseEvent<HTMLButtonElement>,
                            item.href
                          )
                        }
                      >
                        {item.label}
                      </Button>
                    )
                  )
                : // Mobile navigation for other pages
                  [
                    { href: "/#evaluacion", label: "Evaluación", isLink: true },
                    { href: "/#beneficios", label: "Beneficios", isLink: true },
                    {
                      href: "/#testimonios",
                      label: "Testimonios",
                      isLink: true,
                    },
                    {
                      href: "/pricing",
                      label: "Precios",
                      isLink: true,
                      current: pathname === "/pricing",
                    },
                    {
                      href: "/blog",
                      label: "Blog",
                      isLink: true,
                      current:
                        pathname === "/blog" || pathname.startsWith("/blog/"),
                    },
                  ].map((item) => (
                    <Link
                      href={item.href}
                      key={item.href}
                      className="w-full"
                      legacyBehavior={false}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-lg py-4 hover:bg-yellow-50 hover:text-yellow-500 ${
                          item.current ? "text-yellow-500" : ""
                        }`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
            </div>
            <div className="flex flex-col space-y-3 mt-4">
              <AuthHeader />
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLButtonElement>,
                    isHomePage ? "#evaluacion" : "/#evaluacion"
                  )
                }
              >
                Evaluar Ahora
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
