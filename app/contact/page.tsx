import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/800px-LinkedIn_logo_initials.png';

export default function ContactPage() {
    return (
        <>
            <h1>Contact Me</h1>
            <div
                className='w-full p-3 m-3 bg-sky-100 flex justify-center items-center'>
                <Link 
                    className='flex flex-col items-center'  
                    href="https://ca.linkedin.com/in/cc-peter-fan">
                    <span>Please reach me through LinkedIn!</span>
                    <Image 
                        className='m-3'
                        src={logo} 
                        alt='LinkedIn Logo'
                        width={100}
                    />
                </Link>
            </div>
        </>
    );
}