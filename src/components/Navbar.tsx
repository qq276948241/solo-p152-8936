import { NavLink } from 'react-router-dom';
import { Music, Calendar, MessageCircleHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const links = [
    { to: '/shows', label: '演出日程', Icon: Calendar },
    { to: '/messages', label: '留言板', Icon: MessageCircleHeart },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary-500/90 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <NavLink to="/shows" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
              <Music className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white leading-tight">演出日程后台</h1>
              <p className="text-xs text-white/50">Gig Scheduler Pro</p>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1 sm:gap-2">
            {links.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn('nav-link text-sm sm:text-base', isActive && 'nav-link-active')
                }
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
