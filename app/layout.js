import { Instrument_Sans, Inter, Plus_Jakarta_Sans } from 'next/font/google';

import '@/styles/global.css';
import '@/styles/header.css';
import '@/styles/menu.css';
import '@/styles/footer.css';
import '@/styles/home.css';
import '@/styles/page.css';
import '@/styles/contact.css';
import '@/styles/modal.css';
import '@/styles/project-detail.css';
import '@/styles/theme.css';

import ThemeProvider from '@/components/ThemeProvider';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CustomCursor from '@/components/CustomCursor';
import CopyProtection from '@/components/CopyProtection';
import Header from '@/components/Header';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ui',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Hurman | Cybersecurity & Digital Forensics',
  description:
    "I'm Hurman — a BS student in Defence Forensic and Cyber Security from Pakistan, building expertise in cybersecurity, digital forensics, Python development, and secure web applications.",
  openGraph: {
    type: 'website',
    title: 'Hurman | Cybersecurity & Digital Forensics',
    description:
      'BS student in Defence Forensic and Cyber Security. Building practical skills in cybersecurity, digital forensics, and secure development.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${inter.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent FOUC — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    document.documentElement.classList.add('light');
                  } else if (!saved) {
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.classList.add('light');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            <div className="vignette"></div>
            <CustomCursor />
            <CopyProtection />
            <Header />
            <main id="app">{children}</main>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
