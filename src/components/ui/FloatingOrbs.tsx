interface FloatingOrbsProps {
  className?: string;
}

export function FloatingOrbs({ className = '' }: FloatingOrbsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary accent orb */}
      <div 
        className="floating-orb accent"
        style={{
          width: '500px',
          height: '500px',
          top: '10%',
          left: '-10%',
          animationDelay: '0s',
        }}
      />
      
      {/* Secondary orb */}
      <div 
        className="floating-orb secondary"
        style={{
          width: '400px',
          height: '400px',
          top: '60%',
          right: '-5%',
          animationDelay: '2s',
        }}
      />
      
      {/* Primary blue orb */}
      <div 
        className="floating-orb primary"
        style={{
          width: '300px',
          height: '300px',
          bottom: '10%',
          left: '30%',
          animationDelay: '4s',
        }}
      />
      
      {/* Small accent orb */}
      <div 
        className="floating-orb accent"
        style={{
          width: '200px',
          height: '200px',
          top: '30%',
          right: '20%',
          animationDelay: '1s',
          opacity: 0.2,
        }}
      />
      
      {/* Extra secondary orb */}
      <div 
        className="floating-orb secondary"
        style={{
          width: '250px',
          height: '250px',
          top: '70%',
          left: '10%',
          animationDelay: '3s',
          opacity: 0.2,
        }}
      />
    </div>
  );
}
