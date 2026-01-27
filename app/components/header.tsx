/**
 * The website's header component with modern animated gradient styling.
 * @returns JSX.Element
 */
export default function Header() {
  return (
    <header className="text-center pt-8 pb-4 animate-fade-in-up">
      <h1 className="gradient-text text-5xl md:text-6xl lg:text-7xl tracking-tight">
        Peter Fan
      </h1>
      <p className="mt-4 text-lg md:text-xl text-slate-500 font-medium max-w-md mx-auto">
        my journey exploring the world of information technology
      </p>
    </header>
  );
};
