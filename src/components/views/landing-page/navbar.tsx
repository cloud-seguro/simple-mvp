"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      {!scrolled && (
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
          <Link href="/" className="text-2xl font-bold z-50 relative">
            <span className="text-black">SIMPLE</span>
          </Link>

          {/* Mobile menu button */}
          <Button
            className="md:hidden z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: "#evaluacion", label: "Evaluación" },
              { href: "#beneficios", label: "Beneficios" },
              { href: "#testimonios", label: "Testimonios" },
              { href: "#contacto", label: "Contacto" },
            ].map((item) => (
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
            ))}
            <Button
              className="bg-black text-white hover:bg-gray-800 transition-all transform hover:-translate-y-1"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#evaluacion"
                )
              }
            >
              Evaluar Ahora
            </Button>
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
          className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out transform md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            <div className="flex-1 flex flex-col space-y-2">
              {[
                { href: "#evaluacion", label: "Evaluación" },
                { href: "#beneficios", label: "Beneficios" },
                { href: "#testimonios", label: "Testimonios" },
                { href: "#contacto", label: "Contacto" },
              ].map((item) => (
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
              ))}
            </div>
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg mt-4"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#evaluacion"
                )
              }
            >
              Evaluar Ahora
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
