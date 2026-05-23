// n/client/app/layout.js (updated)
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'MediQueue - Tutor Booking BD',
  description: 'Book trusted tutors in Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}