"use client"

import { useEffect, useState } from "react"
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { searchStocks } from "@/lib/actions/finnhub.actions"

export interface StockWithWatchlistStatus {
    symbol: string;
    name: string;
    exchange?: string;
    type?: string;
}

interface SearchCommandProps {
    renderAs?: 'text' | 'button';
    label?: string;
    initialStocks?: StockWithWatchlistStatus[];
}

export default function SearchCommand({
                                          renderAs = 'button',
                                          label = 'Add stock',
                                          initialStocks = [],
                                      }: SearchCommandProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks ?? [])

    const isSearchMode = Boolean(searchTerm.trim())
    const displayStocks = isSearchMode ? stocks : (initialStocks ?? []).slice(0, 10)

    // Shortcut Cmd+K / Ctrl+K
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen((prev) => !prev)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    // Debounced search
    useEffect(() => {
        const query = searchTerm.trim()

        if (!query) {
            setStocks(initialStocks ?? [])
            setLoading(false)
            return
        }

        setLoading(true)
        const timer = setTimeout(async () => {
            try {
                const results = await searchStocks(query)
                setStocks(results ?? [])
            } catch (err) {
                console.error("Stock search error:", err)
                setStocks([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm, initialStocks])

    const handleSelectStock = () => {
        setOpen(false)
        setSearchTerm("")
        setStocks(initialStocks ?? [])
    }

    return (
        <>
            {renderAs === 'text' ? (
                <span onClick={() => setOpen(true)} className="search-text cursor-pointer">
          {label}
        </span>
            ) : (
                <Button onClick={() => setOpen(true)} className="search-btn">
                    {label}
                </Button>
            )}

            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <CommandInput
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    placeholder="Search stocks..."
                />

                <CommandList>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading stocks...</span>
                        </div>
                    ) : displayStocks.length === 0 ? (
                        <CommandEmpty>
                            {isSearchMode ? "No results found." : "No stocks available."}
                        </CommandEmpty>
                    ) : (
                        <CommandGroup
                            heading={
                                isSearchMode
                                    ? `Search results (${displayStocks.length})`
                                    : `Popular stocks (${displayStocks.length})`
                            }
                        >
                            {displayStocks.map((stock) => (
                                <CommandItem
                                    key={stock.symbol}
                                    value={stock.symbol}
                                    onSelect={handleSelectStock}
                                    className="p-0"
                                >
                                    <Link
                                        href={`/stocks/${stock.symbol}`}
                                        onClick={handleSelectStock}
                                        className="flex w-full items-center gap-3 px-3 py-2.5 text-inherit no-underline"
                                    >
                                        <TrendingUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div className="flex-1 overflow-hidden text-left">
                                            <div className="truncate font-medium">{stock.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {stock.symbol}
                                                {stock.exchange ? ` | ${stock.exchange}` : ""}
                                                {stock.type ? ` | ${stock.type}` : ""}
                                            </div>
                                        </div>
                                    </Link>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}