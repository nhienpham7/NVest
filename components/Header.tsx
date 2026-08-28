import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";

const Header = () => {
    return (
        <header className="sticky top-0 z-40 border-b border-neutral-800 bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo + Name */}
                <Link href="/" className="flex items-center gap-2.5">
                    <Image
                        src="/NVest.ico"
                        alt="NVest logo"
                        width={32}
                        height={32}
                        className="h-8 w-auto cursor-pointer"
                    />
                    <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
    NVEST
  </span>
                </Link>

                {/* Center Nav */}
                <nav className="hidden sm:block">
                    <NavItems />
                </nav>

                {/* Right Dropdown */}
                <UserDropdown />
            </div>
        </header>
    );
};

export default Header;