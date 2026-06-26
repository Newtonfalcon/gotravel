"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/data/siteData";

function UserAvatar({ user }) {
  const displayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    user?.email ||
    "";

  const initial = displayName
    ? displayName.charAt(0).toUpperCase()
    : (user?.emailAddresses?.[0]?.emailAddress || user?.email || "U").charAt(0).toUpperCase();

  if (user?.imageUrl) {
    return (
      <img
        src={user.imageUrl}
        alt={displayName || "User"}
        className="w-9 h-9 rounded-full object-cover border-2 border-amber-500"
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-sm">
      {initial}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (path) => pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              
              <span
                className={`text-lg sm:text-xl font-heading font-bold hidden sm:block transition-colors ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                GoTravel
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path || "#"}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? scrolled
                        ? "bg-amber-50 text-amber-700"
                        : "bg-white/20 text-white"
                      : scrolled
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <div className="hidden lg:flex items-center gap-3">
                      <UserAvatar user={user} />
                      <button
                        onClick={async () => await signOut()}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          scrolled
                            ? "text-gray-600 hover:text-red-600 hover:bg-red-50"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="hidden lg:inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </>
              )}

              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[280px] sm:w-[320px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                  <span className="text-lg font-heading font-bold text-gray-900">
                    TravelCourses
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

                {isLoaded && isSignedIn && user && (
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <UserAvatar user={user} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || user.email || ""}</p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center justify-between mx-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-amber-50 text-amber-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>

              <div className="px-5 py-4 border-t border-gray-100">
                {isLoaded && (
                  <>
                    {isSignedIn ? (
                      <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg text-sm hover:bg-red-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/sign-in"
                        className="w-full flex items-center justify-center px-4 py-3 bg-amber-500 text-black font-semibold rounded-lg text-sm hover:bg-amber-600 transition-colors"
                      >
                        Sign In
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}