"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home", href: "/#home", sectionId: "home" },
  { label: "Find Donors", href: "/#find-donors", sectionId: "find-donors" },
  { label: "Features", href: "/#features", sectionId: "features" },
  { label: "How It Works", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Statistics", href: "/#statistics", sectionId: "statistics" },
  { label: "Blog & Guides", href: "/guides", sectionId: null },
  { label: "Download", href: "/#download", sectionId: "download" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sectionIds = navLinks.map(l => l.sectionId).filter(Boolean);
    const observers = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [pathname]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Image
              src="/appIcon.png"
              alt="Blood Banks Logo"
              width={30}
              height={30}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <div className={styles.logoText}>
              BLOOD <span className={styles.logoAccent}>BANKS</span>
            </div>
            <p className={styles.logoSub}>Smart Care. Save Lives.</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => {
            const isActive = link.sectionId
              ? activeSection === link.sectionId
              : pathname === "/guides";
            return (
              <li key={link.label}>
                <a href={link.href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA Button */}
        <div className={styles.navActions}>
          <a href="/#download" className={styles.btnDownload}>
            <span>Download App</span>
            <div className={styles.downloadIconWrap}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <path d="m7 10 5 5 5-5"></path>
              </svg>
            </div>
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="/#download" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
          Download App ↓
        </a>
      </div>
    </nav>
  );
}
