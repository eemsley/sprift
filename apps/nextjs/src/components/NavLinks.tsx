import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function NavLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);

  return (
    <div className="flex gap-8">
      {[
        ["Features", "/#features"],
        ["FAQs", "/faq"],
        ["The Team", "/team"],
        ["Blog", "/blog"],
        ["Contact", "/contact"],
      ].map(([label, href], index) => (
        <Link
          key={label}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          href={href!}
          className="relative -mx-3 -my-2 rounded-lg px-3 py-2 font-satoshi-bold text-md text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.span
                className="absolute inset-0 rounded-lg bg-[#e6efee]/80"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <span className="relative z-10">{label}</span>
        </Link>
      ))}
    </div>
  );
}
