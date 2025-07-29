import { Link, useLocation } from 'react-router';
import {
  User,
  Building2,
  Menu,
  LogOut,
  ChevronDown,
  Home,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { UserType } from '@/types';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserType[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    allowedRoles: ['AFFILIATE'],
  },
  {
    title: 'Commissions',
    href: '/dashboard/commissions',
    icon: DollarSign,
    allowedRoles: ['AFFILIATE'],
  },
  {
    title: 'Organizations',
    href: '/dashboard/organizations',
    icon: Building2,
    allowedRoles: ['AFFILIATE'],
  },
  {
    title: 'Affiliate Account',
    href: '/dashboard/affiliate-account',
    icon: UserCheck,
    allowedRoles: ['AFFILIATE'],
  },
];

const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || 'A';
};

export const SidebarNav = () => {
  const { user, signout, hasRole } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const allowedItems = navigationItems.filter((item) =>
    hasRole(item.allowedRoles)
  );

  const NavContent = () => (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Call Agent AI</h2>
            <p className="text-sm text-muted-foreground">Affiliate Portal</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2 h-auto"
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback className="text-xs">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">Affiliate</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <NavContent />
      </div>

      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
          <h2 className="text-lg font-bold">Call Agent AI</h2>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
};
