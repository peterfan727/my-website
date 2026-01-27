type CardProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * A modern glassmorphic card component with hover effects.
 * @param {children : React.ReactNode, className? : string} : CardProps
 * @returns JSX.Element
 */
export default function Card({ children, className }: CardProps) {
    return (
        <div className={`
            glass-card
            flex flex-col 
            justify-center items-center 
            w-full
            py-6 px-8 my-4
            animate-fade-in-up
            ${className ? ' ' + className : ''}
        `}>
            {children}
        </div>
    )
}
