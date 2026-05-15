import { useEffect, useState } from 'react';
import { Users, BookMarked, Zap } from 'lucide-react';

const StatCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(end * progress));

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

export const StatsSection = () => {
  const stats = [
    { label: 'Usuarios', value: 464, icon: <Users size={32} /> },
    { label: 'Cursos', value: 315, icon: <BookMarked size={32} /> },
    { label: 'Actividades', value: 493, icon: <Zap size={32} /> }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary-main to-primary-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="flex justify-center mb-4 opacity-90">
                {stat.icon}
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-2">
                <StatCounter end={stat.value} />
              </div>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
