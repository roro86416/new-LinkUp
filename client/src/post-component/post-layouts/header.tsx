"use client";

import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
// import { Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            {/* <Link href="/" className="flex items-center space-x-1">
              <span className="text-orange-500 font-bold text-2xl">Linkup</span>
              <span className="font-semibold text-gray-900">| All Access</span>
            </Link> */}
            <Link href="/" className="cursor-pointer">
        <Image
          src="/logo/logoBlack.png"
          alt="LOGO"
          width={120}
          height={40}
          className="invert brightness-200"
          style={{ width: 'auto' }}
        />
      </Link>
          </div>

          {/* Center: Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/tips" className="text-gray-900 font-medium hover:text-orange-500">
              Tips & Guides
            </Link>
            <Link href="/news" className="text-gray-900 font-medium hover:text-orange-500">
              News & Trends
            </Link>
            <Link href="/community" className="text-gray-900 font-medium hover:text-orange-500">
              Community
            </Link>
            <Link href="/tools" className="text-gray-900 font-medium hover:text-orange-500">
              Tools & Features
            </Link>
          </div>

          {/* Right: Search + Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <Search className="h-5 w-5 text-gray-700 hover:text-orange-500 cursor-pointer" /> */}
            <Link href="/contact" className="text-gray-900 font-medium hover:text-orange-500">
              Contact Sales
            </Link>
            <Link
              href="/create"
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
            >
              Create Event
            </Link>
          </div>

          {/* Mobile Menu Button */}
          {/* <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link href="/tips" className="block text-gray-900 font-medium hover:text-orange-500">
            Tips & Guides
          </Link>
          <Link href="/news" className="block text-gray-900 font-medium hover:text-orange-500">
            News & Trends
          </Link>
          <Link href="/community" className="block text-gray-900 font-medium hover:text-orange-500">
            Community
          </Link>
          <Link href="/tools" className="block text-gray-900 font-medium hover:text-orange-500">
            Tools & Features
          </Link>
          <Link href="/contact" className="block text-gray-900 font-medium hover:text-orange-500">
            Contact Sales
          </Link>
          <Link
            href="/create"
            className="block bg-black text-white text-center px-4 py-2 rounded-full hover:bg-gray-800"
          >
            Create Event
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
