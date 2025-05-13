'use client';

import {
  IconPlus,
  IconNotebook,
  IconUser,
  IconSettings,
  IconLogout,
  IconSun,
  IconMoon,
  IconChevronLeft,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { logout, getUser } from '@/lib/actions/auth';
import { User } from '@/lib/types';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <nav className='fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-6 bg-white rounded-full shadow-lg px-8 py-3 border border-blue-100'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-white transition-all duration-150 hover:bg-blue-50 hover:shadow-md hover:scale-105'>
          <Link href='/home'>
            <IconNotebook size={24} stroke={2} className='text-blue-600' />
          </Link>
        </div>
        <div className='flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-white transition-all duration-150 hover:bg-blue-50 hover:shadow-md hover:scale-105'>
          <Link href='/home/quick-note'>
            <IconPlus size={24} stroke={2} className='text-blue-600' />
          </Link>
        </div>
        <div className='relative'>
          <button
            className='flex items-center justify-center w-12 h-12 rounded-full border-2 border-blue-200 bg-white transition-all duration-150 hover:bg-blue-50 hover:shadow-md hover:scale-105 focus:outline-none'
            onClick={() => {
              setShowModal((v) => !v);
              setShowSettings(false);
            }}
            aria-label='User menu'
            type='button'
          >
            <IconUser size={24} stroke={2} className='text-blue-600' />
          </button>
          {showModal && !showSettings && (
            <div className='absolute left-1/2 top-14 -translate-x-1/2 sm:left-0 sm:top-14 sm:translate-x-0 w-[90vw] max-w-xs sm:w-56 sm:max-w-none bg-white rounded-xl shadow-xl border border-blue-100 p-4 z-50 flex flex-col gap-3 min-w-[200px]'>
              <div className='flex items-center gap-3 text-blue-700 max-w-full font-medium'>
                <span className='truncate'>
                  {user?.email_address && user.email_address.length > 0
                    ? user.email_address
                    : 'User'}
                </span>
              </div>
              <button
                className='flex items-center gap-3 text-gray-700 cursor-pointer hover:text-blue-700 transition-colors w-full text-left'
                onClick={() => setShowSettings(true)}
                type='button'
              >
                <IconSettings size={20} />
                Settings
              </button>
              <div className='flex items-center gap-3 text-red-500 cursor-pointer hover:text-red-700 transition-colors'>
                <IconLogout size={20} />
                <button onClick={logout}>Sign out</button>
              </div>
            </div>
          )}
          {showModal && showSettings && (
            <div className='absolute left-1/2 top-14 -translate-x-1/2 sm:left-0 sm:top-14 sm:translate-x-0 w-[90vw] max-w-xs sm:w-64 sm:max-w-none bg-white rounded-xl shadow-xl border border-blue-100 p-4 z-50 flex flex-col gap-4 min-w-[220px] animate-slide-in'>
              <button
                className='flex items-center gap-2 text-gray-500 hover:text-blue-700 transition-colors mb-2'
                onClick={() => setShowSettings(false)}
                type='button'
              >
                <IconChevronLeft size={18} />
                Back
              </button>
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-2 text-gray-700 font-medium'>
                  {darkMode ? <IconMoon size={20} /> : <IconSun size={20} />}
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
                <button
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  onClick={handleToggleTheme}
                  type='button'
                  aria-label='Toggle dark mode'
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      darkMode ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <span className='ml-6 text-xl font-bold text-blue-700 tracking-tight select-none'>
        NoteFlow
      </span>
    </nav>
  );
}
