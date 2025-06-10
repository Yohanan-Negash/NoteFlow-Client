'use client';

import {
  IconNotebook,
  IconUser,
  IconSettings,
  IconLogout,
  IconSun,
  IconMoon,
  IconChevronLeft,
  IconX,
  IconClock,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { logout, getUser } from '@/lib/actions/auth';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  function handleToggleTheme() {
    setDarkMode((v) => !v);
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', !darkMode);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      // Server action doesn't return, it redirects
      await logout();
      // If for some reason we get here (we shouldn't), redirect manually
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className='fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-6 bg-primary rounded-full shadow-lg px-8 py-3 border border-blue-100'>
      <div className='flex items-center gap-4'>
        <Link href='/home' className='block'>
          <div className='flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-primary transition-all duration-150 hover:bg-blue-50 hover:shadow-md hover:scale-105 cursor-pointer'>
            <IconNotebook size={24} stroke={2} className='text-secondary' />
          </div>
        </Link>
        <Link href='/home/quick-note' className='block'>
          <div className='flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-primary transition-all duration-150 hover:bg-blue-50 hover:shadow-md hover:scale-105 cursor-pointer'>
            <IconClock size={24} stroke={2} className='text-secondary' />
          </div>
        </Link>
        <div className='relative'>
          <button
            className='flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-primary transition-all duration-150 hover:bg-blue-50 hover:shadow-md hover:scale-105 focus:outline-none'
            onClick={() => {
              setShowModal((v) => !v);
              setShowSettings(false);
            }}
            aria-label={showModal ? 'Close menu' : 'User menu'}
            type='button'
          >
            {showModal ? (
              <IconX size={24} stroke={2} className='text-secondary' />
            ) : (
              <IconUser size={24} stroke={2} className='text-secondary' />
            )}
          </button>
          {showModal && !showSettings && (
            <div className='absolute left-1/2 top-14 -translate-x-1/2 sm:left-0 sm:top-14 sm:translate-x-0 w-[90vw] max-w-xs sm:w-56 sm:max-w-none bg-primary rounded-xl shadow-xl border border-blue-100 p-4 z-50 flex flex-col gap-3 min-w-[200px]'>
              <div className='flex items-center gap-3 text-secondary max-w-full font-medium'>
                <span className='truncate'>
                  {user?.email_address && user.email_address.length > 0
                    ? user.email_address
                    : 'User'}
                </span>
              </div>
              <button
                className='flex items-center gap-3 text-foreground cursor-pointer hover:text-primary transition-colors w-full text-left'
                onClick={() => setShowSettings(true)}
                type='button'
              >
                <IconSettings size={20} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className='flex items-center gap-3 text-red-500 cursor-pointer hover:text-red-700 transition-colors w-full text-left'
              >
                {isLoggingOut ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-red-500'></div>
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <IconLogout size={20} />
                    <span>Sign out</span>
                  </>
                )}
              </button>
            </div>
          )}
          {showModal && showSettings && (
            <div className='absolute left-1/2 top-14 -translate-x-1/2 sm:left-0 sm:top-14 sm:translate-x-0 w-[90vw] max-w-xs sm:w-64 sm:max-w-none bg-primary rounded-xl shadow-xl border border-blue-100 p-4 z-50 flex flex-col gap-4 min-w-[220px] animate-slide-in'>
              <button
                className='flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-2'
                onClick={() => setShowSettings(false)}
                type='button'
              >
                <IconChevronLeft size={18} />
                Back
              </button>
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-foreground font-medium'>
                  {darkMode ? <IconMoon size={20} /> : <IconSun size={20} />}
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
                <button
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    darkMode ? 'bg-blue-300' : 'bg-gray-200'
                  }`}
                  onClick={handleToggleTheme}
                  type='button'
                  aria-label='Toggle dark mode'
                >
                  <span
                    className={`w-4 h-4 bg-primary rounded-full shadow-md transform transition-transform duration-200 ${
                      darkMode ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <span className='ml-6 text-xl font-bold text-secondary tracking-tight select-none'>
        NoteFlow
      </span>
    </nav>
  );
}
