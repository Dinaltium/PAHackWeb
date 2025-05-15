import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Building } from "@shared/schema";
import { SearchIcon } from "lucide-react";
import { 
  MapIcon, 
  CalendarIcon, 
  BookOpenIcon,
  CalendarPlusIcon,
  StarIcon
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, href, isActive, onClick }: NavItemProps) {
  const baseClasses = "flex items-center px-4 py-3 transition";
  const activeClasses = "bg-blue-50 text-primary border-l-4 border-primary";
  const inactiveClasses = "text-neutral-700 hover:bg-neutral-100";
  
  return (
    <Link href={href}>
      <a
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        onClick={onClick}
      >
        <span className="w-6">{icon}</span>
        <span>{label}</span>
      </a>
    </Link>
  );
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: favorites } = useQuery<Building[]>({
    queryKey: ['/api/users/1/favorites'],
  });

  return (
    <aside className="w-full bg-white h-full">
      <div className="p-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search campus..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <nav className="mt-2">
        <div className="px-4 py-2 text-neutral-500 text-xs font-semibold uppercase tracking-wider">
          Main Menu
        </div>
        
        <NavItem 
          icon={<MapIcon className="h-4 w-4" />} 
          label="Campus Map" 
          href="/" 
          isActive={location === '/'} 
          onClick={onNavigate}
        />
        
        <NavItem 
          icon={<CalendarIcon className="h-4 w-4" />} 
          label="My Schedule" 
          href="/schedule" 
          isActive={location === '/schedule'} 
          onClick={onNavigate}
        />
        
        <NavItem 
          icon={<BookOpenIcon className="h-4 w-4" />} 
          label="Classes" 
          href="/classes" 
          isActive={location === '/classes'} 
          onClick={onNavigate}
        />
        
        <NavItem 
          icon={<CalendarPlusIcon className="h-4 w-4" />} 
          label="Events" 
          href="/events" 
          isActive={location === '/events'} 
          onClick={onNavigate}
        />
        
        <NavItem 
          icon={<StarIcon className="h-4 w-4" />} 
          label="Favorites" 
          href="/favorites" 
          isActive={location === '/favorites'} 
          onClick={onNavigate}
        />
      </nav>
      
      <div className="px-4 py-2 mt-4 text-neutral-500 text-xs font-semibold uppercase tracking-wider">
        Quick Access
      </div>
      
      <div className="px-4 py-2">
        {favorites ? (
          favorites.map((favorite, index) => (
            <div key={index} className="bg-neutral-100 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium text-neutral-800">
                {favorite.name}
              </div>
              <div className="text-xs text-neutral-500">
                {/* This would ideally be calculated based on user's position */}
                200m · 3 min walk
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-neutral-100 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium text-neutral-800">Library</div>
              <div className="text-xs text-neutral-500">200m · 3 min walk</div>
            </div>
            <div className="bg-neutral-100 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium text-neutral-800">Science Building</div>
              <div className="text-xs text-neutral-500">350m · 5 min walk</div>
            </div>
            <div className="bg-neutral-100 rounded-lg p-3">
              <div className="text-sm font-medium text-neutral-800">Student Center</div>
              <div className="text-xs text-neutral-500">150m · 2 min walk</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
