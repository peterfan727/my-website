import Link from 'next/link'

/**
 * Default Error page when invalid routing occurs.
 * @returns JSX.Element
 */
export default function NotFound() {
  return (
    <section>
      <h1 className='page-title'>Page Not Found</h1>

      <p className="my-5 text-neutral-800 dark:text-neutral-200 ">
        <Link 
          className="underline underline-offset-auto" 
          href="/">Go Back to Home
        </Link>
      </p>
    </section>
  )
}