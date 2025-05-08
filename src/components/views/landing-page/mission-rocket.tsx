"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";
import { RocketIcon } from "lucide-react";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { SparklesText } from "@/components/magicui/sparkles-text";

const MissionRocket = () => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const rocketPathRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Rocket trajectory path - straight up with size changes
  const rocketY = useTransform(scrollYProgress, [0, 1], ["90%", "-20%"]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (cardsInView) {
      controls.start("cardsVisible");
    }
  }, [cardsInView, controls]);

  return (
    <section className="py-12 px-4 relative overflow-hidden" id="mision">
      {/* Background dot pattern */}
      <DotPattern
        width={24}
        height={24}
        className="text-neutral-300 opacity-40"
        glow={false}
      />

      <div className="max-w-6xl mx-auto text-center mb-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <SparklesText text="Nuestra Misión" />
        </h2>
        <div className="text-xl md:text-2xl mb-8">
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Hacemos la ciberseguridad{" "}
            <span className="text-black font-bold relative">
              SIMPLE
              <motion.span
                className="absolute bottom-0 left-0 w-full h-[3px] bg-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>{" "}
            para que puedas enfocarte en lo que realmente importa.
          </motion.p>
        </div>
      </div>

      <div
        className="min-h-[800px] md:min-h-[600px] relative"
        ref={containerRef}
      >
        <div className="relative h-full" ref={rocketPathRef}>
          {/* Rocket Path - centered */}
          <motion.div
            className="absolute w-1 h-full left-1/2 -translate-x-1/2 -z-10"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent via-neutral-300 to-transparent rounded-full"></div>
          </motion.div>

          {/* Rocket - centered and bigger */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{
              y: useTransform(
                scrollYProgress,
                [0, 0.3, 0.6, 1],
                ["95%", "60%", "20%", "-10%"]
              ),
              scale: useTransform(scrollYProgress, [0, 0.5], [1.5, 2]),
            }}
          >
            <div className="relative w-20 h-20 animate-float">
              <RocketIcon
                className="text-orange-500 w-full h-full"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>

          {/* Mission Cards - with more space on mobile */}
          <div
            className="flex flex-col items-center pt-44 md:pt-16 pb-6"
            ref={cardsRef}
          >
            {/* Grid for cards - arranged around the rocket with more vertical spacing on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 max-w-6xl mx-auto relative">
              {/* Simplify Card */}
              <motion.div
                className="bg-orange-500 text-white rounded-xl shadow-lg p-6 min-h-[180px] flex flex-col relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                variants={{
                  cardsVisible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8 },
                  },
                }}
              >
                <motion.h3
                  className="text-2xl font-bold mb-4 inline-block"
                  initial={{ backgroundSize: "0% 5px" }}
                  animate={{ backgroundSize: "100% 5px" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #fde047, #fde047)",
                    backgroundPosition: "0 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  Simplificamos
                </motion.h3>
                <p className="text-white/90 flex-grow">
                  Transformamos conceptos complejos de ciberseguridad en
                  soluciones prácticas y comprensibles para todo tipo de
                  empresas.
                </p>
              </motion.div>

              {/* Center column for spacing - this gives room for the rocket */}
              <div className="hidden md:block min-h-[180px]"></div>

              {/* Protect Card */}
              <motion.div
                className="bg-black text-white rounded-xl shadow-lg p-6 min-h-[180px] flex flex-col relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                variants={{
                  cardsVisible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, delay: 0.2 },
                  },
                }}
              >
                <motion.h3
                  className="text-2xl font-bold mb-4 inline-block"
                  initial={{ backgroundSize: "0% 5px" }}
                  animate={{ backgroundSize: "100% 5px" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #fde047, #fde047)",
                    backgroundPosition: "0 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  Protegemos
                </motion.h3>
                <p className="text-white/90 flex-grow">
                  Defendemos tus activos digitales con soluciones diseñadas
                  específicamente para tus necesidades.
                </p>
              </motion.div>

              {/* Empower Card - centered below */}
              <motion.div
                className="bg-yellow-400 rounded-xl shadow-lg p-6 min-h-[180px] flex flex-col relative z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={controls}
                variants={{
                  cardsVisible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, delay: 0.4 },
                  },
                }}
              >
                <motion.h3
                  className="text-2xl font-bold mb-4 inline-block"
                  initial={{ backgroundSize: "0% 5px" }}
                  animate={{ backgroundSize: "100% 5px" }}
                  transition={{ duration: 1, delay: 0.9 }}
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #f97316, #f97316)",
                    backgroundPosition: "0 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  Empoderamos
                </motion.h3>
                <p className="text-black/80 flex-grow">
                  Te brindamos las herramientas y el conocimiento para gestionar
                  tu seguridad con confianza y autonomía.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionRocket;
