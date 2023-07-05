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
            className='bg-cyan-500 flex flex-col md:flex-row justify-items-stretch justify-around items-center'
        >
            {
                navPages.map((page) => {
                    return (
                            <Link
                            key={page.path}
                            href={page.path}
                            className='px-8 py-2  text-gray-700 hover:text-gray-300'>
                                {page.name}
                            </Link>
                    )
                })
            }
        </nav>
    )
}