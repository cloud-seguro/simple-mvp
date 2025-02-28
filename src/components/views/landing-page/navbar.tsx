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
    document.body.style.paddingTop = scrolled ? "76px" : "110px";
    return () => {
      document.body.style.paddingTop = "0px";
    };
  }, [scrolled]);

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
      {!scrolled && (
        <div className="w-full bg-yellow-400 text-black py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <p className="text-sm md:text-base font-semibold">
              Evalúa tu nivel de seguridad ahora. ¡Realiza nuestra evaluación
              gratuita hoy!
            </p>
            <Button
              variant="outline"
              className="ml-4 border-black text-black hover:bg-black hover:text-yellow-400 transition-colors"
              onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLButtonElement>, "#evaluacion")}
            >
              Comenzar
            </Button>
          </div>
        </div>
      )}
      <nav
        className={`py-4 px-4 md:px-8 flex items-center justify-between bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <span className="text-black">SIMPLE</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="hover:text-yellow-500 transition-colors"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#evaluacion"
                )
              }
            >
              Evaluación
            </Button>
            <Button
              variant="ghost"
              className="hover:text-yellow-500 transition-colors"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#beneficios"
                )
              }
            >
              Beneficios
            </Button>
            <Button
              variant="ghost"
              className="hover:text-yellow-500 transition-colors"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#testimonios"
                )
              }
            >
              Testimonios
            </Button>
            <Button
              variant="ghost"
              className="hover:text-yellow-500 transition-colors"
              onClick={(e) =>
                handleNavClick(
                  e as React.MouseEvent<HTMLButtonElement>,
                  "#contacto"
                )
              }
            >
              Contacto
            </Button>
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white z-50 p-4 shadow-lg md:hidden">
            <div className="flex flex-col space-y-4">
              <Button
                variant="ghost"
                className="hover:text-yellow-500 transition-colors py-2 justify-start"
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLButtonElement>,
                    "#evaluacion"
                  )
                }
              >
                Evaluación
              </Button>
              <Button
                variant="ghost"
                className="hover:text-yellow-500 transition-colors py-2 justify-start"
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLButtonElement>,
                    "#beneficios"
                  )
                }
              >
                Beneficios
              </Button>
              <Button
                variant="ghost"
                className="hover:text-yellow-500 transition-colors py-2 justify-start"
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLButtonElement>,
                    "#testimonios"
                  )
                }
              >
                Testimonios
              </Button>
              <Button
                variant="ghost"
                className="hover:text-yellow-500 transition-colors py-2 justify-start"
                onClick={(e) =>
                  handleNavClick(
                    e as React.MouseEvent<HTMLButtonElement>,
                    "#contacto"
                  )
                }
              >
                Contacto
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800 w-full"
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
        )}
      </nav>
    </div>
  );
}
