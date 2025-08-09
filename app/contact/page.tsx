import Link from 'next/link'
import Image from 'next/image'
import logo from '../../public/800px-LinkedIn_logo_initials.png'
import Card from '../components/card'

/**
 * Renders the contact page.
 * @returns JSX.Element
 */
export default function ContactPage() {
    return (
        <>
            <h1>Contact Me</h1>
            <Card>
                <Link 
                    className='flex flex-col items-center'  
                    href="https://ca.linkedin.com/in/cc-peter-fan"
                    target="_blank"
                    rel="noopener noreferrer">
                    <span>Please reach me through LinkedIn!</span>
                    <Image 
                        className='m-3'
                        src={logo} 
                        alt='LinkedIn Logo'
                        width={100}
                    />
                </Link>
            </Card>
        </>
    );
}