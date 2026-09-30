import "./globals.css";

const SITE_URL = "https://bloodbank.appstick.com.bd";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Blood Banks Bangladesh — Find Blood Donors Near You | Real-Time Emergency Platform",
    template: "%s | Blood Banks Bangladesh",
  },

  description:
    "Blood Banks Bangladesh — Free real-time voluntary blood donor search platform. Find A+, B+, O+, AB+ donors in Khulna, Dhaka, Chittagong and all 64 districts. Emergency blood request within 60 seconds. 100% free, no broker.",

  keywords: [
    "blood bank Bangladesh",
    "blood donor Bangladesh",
    "blood donation Bangladesh",
    "রক্তদান বাংলাদেশ",
    "রক্তের গ্রুপ",
    "blood bank Khulna",
    "blood bank Dhaka",
    "blood bank Chittagong",
    "emergency blood Bangladesh",
    "find blood donor",
    "voluntary blood donor",
    "O+ blood donor",
    "B+ blood donor",
    "A+ blood donor",
    "AB+ blood donor",
    "blood donation app Bangladesh",
    "free blood donor search",
    "NUBTK blood bank",
    "Appstick blood bank",
    "BloodBanks",
  ],

  authors: [{ name: "Appstick", url: "https://appstick.com.bd" }],
  creator: "Appstick",
  publisher: "Appstick",

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Blood Banks Bangladesh",
    title: "Blood Banks Bangladesh — Free Real-Time Blood Donor Search",
    description:
      "Find voluntary blood donors across all 64 districts of Bangladesh in under 60 seconds. A+, B+, O+, AB+ — 100% free emergency blood donation platform.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Blood Banks Bangladesh — Free Real-Time Blood Donor Search Platform",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Blood Banks Bangladesh — Free Blood Donor Search",
    description:
      "Find voluntary blood donors across all 64 districts of Bangladesh in real-time. Emergency blood request in under 60 seconds.",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@appstickbd",
  },

  icons: {
    icon: "/appIcon.png",
    shortcut: "/appIcon.png",
    apple: "/appIcon.png",
  },

  verification: {
    google: "5p7dG-fw8GmOJZ00huPXYhwW1a55R_k9j2yzWhFf7mg",
  },

  category: "Health",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// JSON-LD Structured Data for rich Google results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Blood Banks Bangladesh",
  url: SITE_URL,
  description:
    "Free real-time voluntary blood donor search platform for Bangladesh. Find emergency blood donors across all 64 districts.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/#find-donors`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Appstick",
    url: "https://appstick.com.bd",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/appIcon.png`,
    },
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Blood Banks Bangladesh",
  url: SITE_URL,
  logo: `${SITE_URL}/appIcon.png`,
  sameAs: ["https://appstick.com.bd", "https://nubtkhulna.ac.bd"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Emergency Blood Donation",
    availableLanguage: ["English", "Bengali"],
    areaServed: "BD",
  },
};

const medicalWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Blood Banks Bangladesh — Find Voluntary Blood Donors",
  url: SITE_URL,
  description:
    "A free platform connecting voluntary blood donors with patients in emergency across all 64 districts of Bangladesh.",
  about: {
    "@type": "MedicalCondition",
    name: "Blood Transfusion",
  },
  audience: {
    "@type": "MedicalAudience",
    audienceType: "Patient",
    geographicArea: {
      "@type": "Country",
      name: "Bangladesh",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/appIcon.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/appIcon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="canonical" href={SITE_URL} />
        <meta
          name="google-site-verification"
          content="5p7dG-fw8GmOJZ00huPXYhwW1a55R_k9j2yzWhFf7mg"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
