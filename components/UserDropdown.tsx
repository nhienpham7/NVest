'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";

const UserDropdown = ({ user, initialStocks }: { user: User, initialStocks: StockWithWatchlistStatus[] }) => {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/sign-in');
    };

    return (
        <DropdownMenu>
            {/* Single interactive element — no nested <Button> inside */}
            <DropdownMenuTrigger className="inline-flex items-center gap-3 rounded-full p-1 text-gray-400 transition-colors hover:bg-neutral-800/50 hover:text-yellow-500 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="User avatar" />
                    <AvatarFallback className="bg-blue-300 text-xs font-semibold text-yellow-800">
                        {user.name ? user.name[0] : 'U'}
                    </AvatarFallback>
                </Avatar>

                <div className="hidden md:flex flex-col items-start pr-2">
                    <span className="text-sm font-medium text-gray-300">
                        {user.name}
                    </span>
                </div>
            </DropdownMenuTrigger>

            {/* Menu popup options */}
            <DropdownMenuContent className="w-60 bg-neutral-900 border border-neutral-800 text-gray-300 p-2 shadow-xl" align="end" sideOffset={8}>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <div className="flex items-center gap-3 py-1">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatar.png" alt="User avatar" />
                                <AvatarFallback className="bg-blue-300 text-yellow-900 text-sm font-bold">
                                    {user.name ? user.name[0] : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden text-left">
                                <span className="text-sm font-semibold text-gray-100 truncate">
                                    {user.name}
                                </span>
                                <span className="text-xs text-gray-400 truncate">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-neutral-800 my-1" />

                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center w-full px-2 py-1.5 text-sm rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="hidden max-sm:block bg-neutral-800 my-1" />

                {/* Mobile Navigation List */}
                <div className="block sm:hidden pt-1">
                    <NavItems initialStocks={initialStocks} />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;