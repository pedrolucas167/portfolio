interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function SectionWrapper({ 
  children, 
  id, 
  className = ''
}: SectionWrapperProps) {
  return (
    <section 
      id={id} 
      className={`relative py-16 md:py-20 overflow-hidden ${className}`}
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise" />
      
      {/* Content */}
      <div className="relative z-10 section-container">
        {children}
      </div>
    </section>
  );
}
