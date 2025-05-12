'use client';

import { logout } from '@/lib/actions/auth';
import { Button } from '@/app/components/ui/button';

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LogoutButton({
  variant = 'default',
  size = 'default',
  className = '',
}: LogoutButtonProps) {
  return (
    <form action={logout}>
      <Button type='submit' variant={variant} size={size} className={className}>
        Logout
      </Button>
    </form>
  );
}
