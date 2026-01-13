'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";


const SearchCommand = ({renderAs = "button", label ="Add Stock", initialStocks }: SearchCommandProps ) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
            
        }, []);

    const handleSelectedStock = (value: string) => {
        console.log('selected stock', value);
        setOpen(false);
    }
    return (
        <>
            { renderAs === 'text' 
                ?( <span onClick={()=> setOpen(true)} className="search-text cursor-pointer hover:text-yellow-500 transition-colors">
                        { label }
                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                            <span className="text-xs">⌘</span>k
                        </kbd>
                    </span> 
                ):( 
                    <Button onClick={()=> setOpen(true)} className="search-btn flex items-center gap-2"> 
                        <Search className="h-4 w-4" />
                        { label } 
                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                            <span className="text-xs">⌘</span>k
                        </kbd>
                    </Button>
                ) 
            }
            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field">
                    <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Type a command or search..." />
                </div>
                <CommandList className="search-list">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Stocks">
                        <CommandItem value="AMZ" onSelect={handleSelectedStock}>AMZ</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default SearchCommand