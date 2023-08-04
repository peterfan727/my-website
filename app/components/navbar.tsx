'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import useMediaQuery from './useMediaQuery'

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
    let isDesktop = useMediaQuery('(min-width: 768px)')
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    // pathname logic to handle interactive vertical navbar
    let pathname = usePathname();

    const navLink = (
        <Link
            href={pathname}
            className="px-8 py-2 text-center text-gray-700 hover:text-gray-300"
            onClick={toggleIsExpanded}
        >
            {navPages.find((page) => page.path === pathname)?.name + '  ▼'}
        </Link>
    );

    if (isDesktop) {
        return (
            // nav bar should be horizontal in big screens
            <nav
            id='nav'
            className='flex flex-row w-full max-md:w-10/12
            my-2
            justify-items-stretch justify-around items-center
            divide-x-2 divide-slate-400'
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
    } else {
        return (
            // nav bar should be vertical in sm screens
            <nav
            id='nav'
            className='flex flex-col w-10/12
            my-2
            justify-items-stretch justify-around items-center
            divide-y-2 divide-slate-400
            border-y-2 border-slate-400'
            >
                {isExpanded ? (
                    navPages.map((page) => (
                    <Link
                        key={page.path}
                        href={page.path}
                        className="w-full px-8 py-2 text-center
                        text-gray-700 hover:text-gray-300"
                        onClick={toggleIsExpanded}
                    >
                        {page.name}
                    </Link>
                    ))
                ) : (
                    <>{navLink}</>
                )}
            </nav>
        )
    }
}

const old_nav = 
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