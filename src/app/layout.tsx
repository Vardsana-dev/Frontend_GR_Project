/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";

export const metadata = {
  title: "GR System",
  icons: {
    icon: '/csc-items/CSC LOGO.png',
    shortcut: '/csc-items/CSC LOGO.png',
    apple: '/csc-items/CSC LOGO.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-[var(--background)] min-h-screen">
        {children}
      </body>
    </html>
  );
}