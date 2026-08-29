"use client"

import { useEffect, useState } from "react"
import {CommandDialog, CommandEmpty, CommandInput, CommandList, CommandGroup, CommandItem,} from "@/components/ui/command"
import {Button} from "@/components/ui/button"
import {TrendingUp, Loader2, Search} from "lucide-react"
import Link from "next/link"
import {searchStocks} from "@/lib/actions/finnhub.actions"

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
                <span onClick={() => setOpen(true)} className="search-text cursor-pointer flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    {label}
                </span>
            ) : (
                <Button onClick={() => setOpen(true)} className="search-btn gap-2 px-4 py-2 text-sm font-medium">
                    <Search className="h-4 w-4" />
                    {label}
                    <span className="ml-2 hidden rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 sm:inline-block">
                        ⌘K
                    </span>
                </Button>
            )}

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                shouldFilter={false}
                className="max-w-5xl border border-neutral-800 bg-neutral-950 shadow-2xl"
            >
                <div className="flex items-center border-b border-neutral-800 px-4">
                    <CommandInput
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        placeholder="Search stocks by name"
                        className="h-14 text-base"
                    />
                    {loading && <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-neutral-500" />}
                </div>

                <CommandList className="max-h-[420px] p-2">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-400">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading stocks...</span>
                        </div>
                    ) : displayStocks.length === 0 ? (
                        <CommandEmpty className="py-12 text-center text-sm text-neutral-400">
                            {isSearchMode ? "No results found." : "No stocks available."}
                        </CommandEmpty>
                    ) : (
                        <CommandGroup
                            heading={
                                <span className="px-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    {isSearchMode
                                        ? `Search results (${displayStocks.length})`
                                        : `Popular stocks (${displayStocks.length})`}
                                </span>
                            }
                        >
                            {displayStocks.map((stock) => (
                                <CommandItem
                                    key={stock.symbol}
                                    value={stock.symbol}
                                    onSelect={handleSelectStock}
                                    className="p-0 rounded-lg"
                                >
                                    <Link
                                        href={`/stocks/${stock.symbol}`}
                                        onClick={handleSelectStock}
                                        className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-inherit no-underline transition-colors hover:bg-neutral-800/60"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                                            <TrendingUp className="h-5 w-5 text-green-700" />
                                        </div>
                                        <div className="flex-1 overflow-hidden text-left">
                                            <div className="truncate text-sm font-semibold text-neutral-100">
                                                {stock.name}
                                            </div>
                                            <div className="mt-0.5 truncate text-xs text-neutral-400">
                                                <span className="font-medium text-neutral-300">{stock.symbol}</span>
                                                {stock.exchange ? ` · ${stock.exchange}` : ""}
                                                {stock.type ? ` · ${stock.type}` : ""}
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