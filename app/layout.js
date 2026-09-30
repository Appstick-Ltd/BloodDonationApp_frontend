import "./globals.css";

export const metadata = {
  title: "Blood Banks — Save Lives, Manage Smarter",
  description:
    "Blood Banks is a modern emergency blood donation platform connecting voluntary donors with critical patients across Bangladesh. Powered by real-time matching, FCM notifications, and smart donor management.",
  keywords: "blood donation, blood bank, Bangladesh, emergency blood, donor management, admin panel",
  icons: {
    icon: "/appIcon.png",
    shortcut: "/appIcon.png",
    apple: "/appIcon.png",
  },
  openGraph: {
    title: "Blood Banks Admin Panel",
    description: "Centralize blood donation operations with the Blood Banks admin dashboard.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/appIcon.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/appIcon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
