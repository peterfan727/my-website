'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navPages = [
    {   path: '/',
        name: 'Home',
    },
    {   path: '/about',
        name: 'About',
    },    
    {   path: '/experience',
        name: 'Experience',
    },
    {   path: '/projects',
        name: 'Projects',
    },
    {   path: '/contact',
        name: 'Contact'
    }
]

export default function Navbar() {
    // pathname logic to handle nested routes
    let pathname = usePathname() || '/';
    if (pathname.includes('/projects/')) {  
        pathname = '/projects'
    }
    return (
        // nav bar should be horizontal in md/lg screens
        // nav bar should be vertical in sm screens
        <nav
            id='nav'
            className='flex flex-col md:flex-row w-full max-md:w-10/12
            my-2
            justify-items-stretch justify-around items-center
            max-md:divide-y-2 md:divide-x-2 divide-slate-400
            max-md:border-y-2 border-slate-400'
        >
            {
                navPages.map((page) => {
                    return (
                            <Link
                            key={page.path}
                            href={page.path}
                            className='w-full px-8 py-2 text-center
                                text-gray-700 hover:text-gray-300'>
                                {page.name}
                            </Link>
                    )
                })
            }
        </nav>
    )
}