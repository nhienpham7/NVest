import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import { spaceGrotesk } from "@/lib/fonts";
import {searchStocks} from "@/lib/actions/finnhub.actions";


const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();


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
                    <span
                        className={`${spaceGrotesk.className} text-lg font-bold tracking-[0.2em] text-slate-100 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]`}>
                    NVest
                    </span>
                </Link>

                {/* Center Nav */}
                <nav className="hidden sm:block">
                    <NavItems initialStocks={initialStocks}/>
                </nav>

                {/* Right Dropdown */}
                <UserDropdown user={user} initialStocks={initialStocks}/>
            </div>
        </header>
    );
};

export default Header;