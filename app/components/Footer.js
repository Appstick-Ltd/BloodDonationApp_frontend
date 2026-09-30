"use client";
import Link from "next/link";
import Image from "next/image";
import { FOOTER_SOLUTIONS, FOOTER_GUIDES } from "../data/sitePages";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Col 1: Brand & Social */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogoWrap}>
              <div className={styles.brandIconBox}>
                <Image
                  src="/appIcon.png"
                  alt="Blood Banks Logo"
                  width={30}
                  height={30}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <span className={styles.brandTitle}>
                  BLOOD <span className={styles.crimsonAccent}>BANKS</span>
                </span>
                <p className={styles.brandSub}>Smart Care. Save Lives.</p>
              </div>
            </Link>

            <p className={styles.brandDesc}>
              The smart digital blood donation network. Connecting verified voluntary donors and emergency hospital patients across 64 districts in Bangladesh.
            </p>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h4 className={styles.colTitle}>Solutions</h4>
            <ul className={styles.linkList}>
              {FOOTER_SOLUTIONS.map((sol) => (
                <li key={sol.href}>
                  <Link href={sol.href} className={styles.footerLink}>
                    {sol.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Guides & Blog */}
          <div>
            <h4 className={styles.colTitle}>Guides &amp; Blog</h4>
            <ul className={styles.linkList}>
              {FOOTER_GUIDES.map((guide, idx) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className={`${styles.footerLink} ${idx === 0 ? styles.highlightLink : ""}`}
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyrightText}>© 2026 Blood Banks. All rights reserved.</p>

          {/* Legal Links */}
          <div className={styles.legalLinksWrap}>
            <Link href="/privacy-policy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <span className={styles.dotSep}>•</span>
            <Link href="/terms-condition" className={styles.legalLink}>
              Terms of Service
            </Link>
          </div>

          <div className={styles.poweredByWrap}>
            <span>Powered by</span>
            <a
              href="https://appstick.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.poweredByLink}
            >
              Appstick
            </a>
            <span>and</span>
            <a
              href="https://nubtkhulna.ac.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.poweredByLink}
            >
              Northern University of Business and Technology Khulna
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
