'use client'
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchCommand from './SearchCommand'

const NavItems = ({initialStocks, user}: { initialStocks: StockWithWatchlistStatus[], user?: User | null }) => {
    const pathname: string = usePathname()

    const isActive = (path: string) =>{
        if (path === '/') return pathname === '/';
        
        return pathname.startsWith(path)
    }
    // Filter out watchlist for non-logged-in users
    const filteredNavItems = NAV_ITEMS.filter(item => {
        if (item.href === '/watchlist' && !user) {
            return false; // Hide watchlist for non-logged-in users
        }
        return true;
    });

    return (
        <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'>
            {
                filteredNavItems.map(item => {
                    if(item.href === '/search') return (
                        <li key="search-trigger">
                            <SearchCommand
                                renderAs="text"
                                label={`${item.title}`}
                                initialStocks={initialStocks}
                            />
                        </li>
                    )

                    return <li key={item.href}>
                        <Link href={item.href} className={`hover:text-yellow-500 transition-colors
                            ${isActive(item.href) ? 'text-gray-100':'' }`} >
                            {item.title}
                        </Link>
                    </li>
                })
            }
        </ul>
    )
}

export default NavItems