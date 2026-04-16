"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              DEVTRACKR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/analyze" className="hover:text-purple-600 transition">
              Analyze Resume
            </Link>
            <Link href="/dashboard" className="hover:text-purple-600 transition">
              Dashboard
            </Link>
            <Link href="/roadmap/frontend" className="hover:text-purple-600 transition">
              Roadmaps
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/analyze"
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link href="/analyze" className="block hover:text-purple-600">
              Analyze Resume
            </Link>
            <Link href="/dashboard" className="block hover:text-purple-600">
              Dashboard
            </Link>
            <Link href="/roadmap/frontend" className="block hover:text-purple-600">
              Roadmaps
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}