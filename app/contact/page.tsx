import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/800px-LinkedIn_logo_initials.png'
import Card from '../components/card'

/**
 * Renders the contact page with modern styling.
 * @returns JSX.Element
 */
export default function ContactPage() {
    return (
        <div className="w-full">
            <h1 className="mb-6 animate-fade-in">Contact Me</h1>

            <Card className="delay-1">
                <p className="text-lg text-slate-600 mb-4">
                    I&apos;d love to hear from you! Let&apos;s connect.
                </p>

                <Link
                    className='group flex flex-col items-center'
                    href="https://ca.linkedin.com/in/cc-peter-fan"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="relative p-4 rounded-2xl bg-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                        <Image
                            src={logo}
                            alt='LinkedIn Logo'
                            width={80}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <span className="mt-4 btn-primary">
                        Connect on LinkedIn
                    </span>
                </Link>
            </Card>

            {/* Additional Contact Info */}
            <Card className="delay-2">
                <p className="text-slate-500 text-sm">
                    📍 Based in Vancouver, BC, Canada
                    <br />
                    🌐 Open to remote opportunities worldwide
                </p>
            </Card>
        </div>
    );
}