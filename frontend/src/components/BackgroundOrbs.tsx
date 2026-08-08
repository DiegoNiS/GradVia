import React, { useMemo, useEffect, useState } from 'react';

export const BackgroundOrbs: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ambientDots = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const size = Math.floor(Math.random() * 300 + 300);
      const top = Math.floor(Math.random() * 80);
      const left = Math.floor(Math.random() * 80);
      const duration = Math.floor(Math.random() * 10 + 15);
      const opacity = (Math.random() * 0.03 + 0.02).toFixed(3);

      return { id: i, size, top, left, duration, opacity };
    });
  }, []);

  if (!mounted) return null;

  return (
    <div id="background-neumorphic-ambient" className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#121212]">
      {/* Sútil textura neumórfica de gradiente radial de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      {ambientDots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full blur-[140px]"
          style={{
            width: dot.size,
            height: dot.size,
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            backgroundColor: `rgba(255, 255, 255, ${dot.opacity})`,
          }}
        />
      ))}
    </div>
  );
};
