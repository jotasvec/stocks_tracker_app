"use client"
import { useEffect, useMemo, useState } from 'react';
import { Label } from '../ui/label';
import { Controller } from 'react-hook-form';
import countryList from 'react-select-country-list';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from '../ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';


function CommandCountry({ value, onChange } : { value: string, onChange: (value: string) => void; } ){
    const [open, setOpen] = useState(false)
    
    const options = useMemo( () => countryList().getData(), [] )

    const countryFlag = (code: string) => {
        // Regional Indicator Symbol Letter A starts at Unicode code point 0x1F1E6
        const OFFSET = 0x1F1E6 - 'A'.charCodeAt(0);
        // Map each letter to its corresponding regional indicator symbol
        const codePoints = code
            .toUpperCase()
            .split('')
            .map(char => char.charCodeAt(0) + OFFSET)
        // Convert code points to a string (flag emoji)
        return String.fromCodePoint(...codePoints)
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
        }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
        
    }, [])
    
    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild >
                <Button 
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='country-select-trigger'
                >
                    { value ? (
                        <div className='flex items-center gap-2'>
                            <span>{countryFlag(value)}</span>
                            <span>{options.find((c) => c.value === value)?.label}</span>
                        </div>
                    ):('Select your country...')}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0 bg-gray-800 border-gray-600'
                align='start'>
                <Command className='bg-gray-800 border-gray-600'>
                    <CommandInput placeholder="Find your country" className='country-select-input'/>
                    <CommandEmpty className='country-select-empty' >No results found.</CommandEmpty>
                    <CommandList className='max-h-60 bg-gray-800 scrollbar-hide-default'>
                        <CommandGroup heading="Suggestions" className='bg-gray-800' >
                        {
                            options.map(country => (
                                <CommandItem key={country.value} 
                                    value={`${country.label} ${country.value}`}
                                    className='country-select-item'
                                    onSelect={ () => {
                                        onChange(country.value)
                                        setOpen(false)
                                    }} >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4 text-yellow-500',
                                                value === country.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        <div className='flex items-center gap-2'>
                                            <span>{countryFlag(country.value)}</span>
                                            <span>{country.label}</span>
                                        </div>
                                    
                                </CommandItem>
                            ))
                        }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

} 




const CountrySelectField = ( { name, label, control, error, required = false} : CountrySelectProps ) => {
    return (
        <div className='space-y-2'>
            <Label htmlFor={name} className='form-label' >
                {label}
            </Label>
            <Controller 
                name={name}
                control={control}
                rules={{
                    required: required ? `Please select ${label.toLocaleLowerCase()}` : false,
                }}
                render={({ field }) => (
                    <CommandCountry 
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
                />
                {/* <Select value={field.value} onValueChange={field.onChange} >
                    <SelectTrigger className="select-trigger ">
                        <SelectValue placeholder={value} />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-600 text-white ' >
                            
                            {
                                options.map((option) => (
                                    <SelectItem 
                                        key={option.value} 
                                        value={option.value} 
                                        className='focus:bg-gray-600 focus:text-white' >
                                        {option.label}
                                    </SelectItem>
                                ))
                            }
                    </SelectContent>
                </Select> */}
            { error && <p className='text-sm text-red-500' > {error.message} </p> }
            <p className='text-xs text-gray-500'>
                Helps us show market data and news relevant to you.
            </p>
        </div>
  )
}

export default CountrySelectField