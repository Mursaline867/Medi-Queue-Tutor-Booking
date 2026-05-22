'use client';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <html lang="en" className={`${theme} ${inter.className}`}>
      <body className="min-h-screen">
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="pt-20">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}