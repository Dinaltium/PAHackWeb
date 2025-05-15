import { Link } from "wouter";
import { 
  MapIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  SettingsIcon 
} from "lucide-react";

interface BottomNavProps {
  currentPath: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

function NavItem({ icon, label, href, isActive }: NavItemProps) {
  return (
    <Link href={href}>
      <a className={`flex flex-col items-center py-2 ${isActive ? 'text-primary' : 'text-neutral-500 hover:text-primary transition'}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </a>
    </Link>
  );
}

export default function BottomNav({ currentPath }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-30">
      <div className="flex justify-around">
        <NavItem 
          icon={<MapIcon className="h-5 w-5" />} 
          label="Map" 
          href="/" 
          isActive={currentPath === '/'} 
        />
        
        <NavItem 
          icon={<CalendarIcon className="h-5 w-5" />} 
          label="Schedule" 
          href="/schedule" 
          isActive={currentPath === '/schedule'} 
        />
        
        <NavItem 
          icon={<BookOpenIcon className="h-5 w-5" />} 
          label="Classes" 
          href="/classes" 
          isActive={currentPath === '/classes'} 
        />
        
        <NavItem 
          icon={<SettingsIcon className="h-5 w-5" />} 
          label="Settings" 
          href="/settings" 
          isActive={currentPath === '/settings'} 
        />
      </div>
    </nav>
  );
}
