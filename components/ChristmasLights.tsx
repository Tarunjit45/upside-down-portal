import React from 'react';

const ChristmasLights: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-12 z-50 pointer-events-none flex justify-around overflow-hidden">
      {/* Wire */}
      <div className="absolute top-0 w-full h-2 border-b-2 border-gray-800 rounded-full" />
      
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`
            relative w-3 h-5 md:w-4 md:h-6 rounded-full mt-2
            ${i % 4 === 0 ? 'bg-red-600 shadow-[0_0_10px_2px_rgba(220,38,38,0.8)] md:shadow-[0_0_20px_4px_rgba(220,38,38,0.8)] animate-pulse' : ''}
            ${i % 4 === 1 ? 'bg-yellow-500 shadow-[0_0_10px_2px_rgba(234,179,8,0.8)] md:shadow-[0_0_20px_4px_rgba(234,179,8,0.8)] animate-flicker' : ''}
            ${i % 4 === 2 ? 'bg-green-600 shadow-[0_0_10px_2px_rgba(22,163,74,0.8)] md:shadow-[0_0_20px_4px_rgba(22,163,74,0.8)] animate-pulse' : ''}
            ${i % 4 === 3 ? 'bg-blue-600 shadow-[0_0_10px_2px_rgba(37,99,235,0.8)] md:shadow-[0_0_20px_4px_rgba(37,99,235,0.8)] animate-flicker' : ''}
          `}
          style={{
            animationDelay: `${i * 0.2}s`,
            transform: `rotate(${i % 2 === 0 ? '10deg' : '-10deg'})`,
          }}
        />
      ))}
    </div>
  );
};

export default ChristmasLights;