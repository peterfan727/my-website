'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import useMediaQuery from './useMediaQuery'

// A list of pages to be displayed in the navbar and their Router path
const navPages = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '/about',
        name: 'About',
    },
    {
        path: '/experience',
        name: 'Experience',
    },
    {
        path: '/projects',
        name: 'Projects',
    },
    {
        path: '/contact',
        name: 'Contact'
    }
]

/**
 * Modern glassmorphic navbar with animated hover effects.
 * @returns JSX.Element
 */
export default function Navbar() {
    // Media query to determine if the navbar should be horizontal or vertical
    let isDesktop = useMediaQuery('(min-width: 768px)')
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    // pathname logic to handle interactive vertical navbar
    let pathname = usePathname();
    // Check if current path starts with any nav page path (for nested routes)
    const isCurrentPath = (pagePath: string) => {
        if (pagePath === '/') return pathname === '/';
        return pathname.startsWith(pagePath);
    };

    let curPage = navPages.find((page) => isCurrentPath(page.path))
    const label = curPage ? curPage.name : 'Menu'

    // Desktop horizontal navbar
    if (isDesktop === true) {
        return (
            <nav
                id='nav'
                className='glass flex flex-row w-full max-w-2xl
                my-4 px-2 py-2
                rounded-full
                justify-items-stretch justify-around items-center
                animate-fade-in-down'
            >
                {
                    navPages.map((page) => {
                        const isActive = isCurrentPath(page.path);
                        return (
                            <Link
                                key={page.path}
                                href={page.path}
                                className={`
                                nav-link
                                ${isActive ? 'active' : ''}
                            `}
                            >
                                {page.name}
                            </Link>
                        )
                    })
                }
            </nav>
        );
    }

    // Mobile vertical navbar
    return (
        <nav
            id='nav'
            className='glass flex flex-col w-11/12
            my-4 rounded-2xl overflow-hidden
            animate-fade-in-down'
        >
            {isExpanded ? (
                navPages.map((page) => {
                    const isActive = isCurrentPath(page.path);
                    return (
                        <Link
                            key={page.path}
                            href={page.path}
                            className={`
                                w-full px-6 py-3 text-center
                                transition-colors duration-200
                                ${isActive
                                    ? 'text-blue-600 bg-blue-50 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
                                ${page.path !== '/' ? 'border-t border-slate-200/50' : ''}
                            `}
                            onClick={toggleIsExpanded}
                        >
                            {page.name}
                        </Link>
                    );
                })
            ) : (
                <button
                    onClick={toggleIsExpanded}
                    className="w-full px-6 py-3 text-center text-slate-600 
                    hover:text-blue-600 transition-colors duration-200
                    flex items-center justify-center gap-2"
                >
                    <span>{label}</span>
                    <svg
                        className="w-4 h-4 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
        </nav>
    );
}
