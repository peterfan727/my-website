type CardProps = {
    children: React.ReactNode;
    className?: string;
  };

/**
 * A reusable card component.
 * @param \{children : React.ReactNode, className? : string} : CardProps
 * @returns JSX.Element
 */
export default function Card({ children, className }: CardProps) {
    return (
        <div className={`
            flex flex-col 
            justify-center items-center 
            w-full h-full 
            rounded
            drop-shadow-lg
            py-3 px-6 m-3
            bg-sky-100 
            text-black
            transition-colors duration-300
            ${className ? ' ' + className : ''}
        `}>
        {children}
        </div>
    )
}
