"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { clsx } from "clsx";
import { adminNavSections } from "../../data/admindata";

export default function AdminSidebar() {
    
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-stone-950 border-r border-stone-800 shrink-0 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-stone-800">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2"
            >
              <Compass size={20} className="text-amber-400 shrink-0" />
              <span className="text-white font-semibold tracking-wide text-sm">
                GoTravel<span className="text-amber-400">.</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <Compass size={20} className="text-amber-400 mx-auto" />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "flex items-center justify-center size-7 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors shrink-0",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-track-stone-950 scrollbar-thumb-stone-800">
        {adminNavSections.map((section) => (
          <div key={section.label} className="mb-1">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  key={`label-${section.label}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-stone-500 select-none"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>

            {collapsed && (
              <div className="mx-3 my-2 border-t border-stone-800" />
            )}

            <ul className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={clsx(
                        "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-amber-400/10 text-amber-400"
                          : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-100"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-lg bg-amber-400/10 border border-amber-400/20"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}

                      <Icon
                        size={17}
                        className={clsx(
                          "shrink-0 relative z-10",
                          active ? "text-amber-400" : "text-stone-500 group-hover:text-stone-300"
                        )}
                      />

                      <AnimatePresence initial={false}>
                        {!collapsed && (
                          <motion.span
                            key={`label-${item.href}`}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-stone-800 px-4 py-4">
        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              key="user-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="size-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                <span className="text-amber-400 text-xs font-bold">A</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-200 truncate">Admin</p>
                <p className="text-[10px] text-stone-500 truncate">admin@gotravel.com</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="user-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center"
            >
              <div className="size-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                <span className="text-amber-400 text-xs font-bold">A</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}