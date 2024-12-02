import Link from 'next/link';
import MenuItem from './MenuItem';
import { AiFillHome } from 'react-icons/ai';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import DarkModeSwitch from './DarkModeSwitch';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-3 max-w-6xl mx-auto">
      {/* Navigation Menu */}
      <nav aria-label="Main Navigation" className="flex gap-4">
        <MenuItem title="Home" address="/" Icon={AiFillHome} />
        <MenuItem title="About" address="/about" Icon={BsFillInfoCircleFill} />
      </nav>

      {/* Branding and Actions */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Switch */}
        <DarkModeSwitch />

        {/* Branding */}
        <Link href="/" className="flex gap-1 items-center">
          <span
            className="text-2xl font-bold bg-amber-500 py-1 px-2 rounded-lg"
            aria-label="Mini UGC - Home"
          >
            Mini UGC
          </span>
        </Link>

        {/* Call-to-Action Button */}
        <Link href="/Form">
          <button
            className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Go to Form"
          >
            Go to Form
          </button>
        </Link>
      </div>
    </header>
  );
}
