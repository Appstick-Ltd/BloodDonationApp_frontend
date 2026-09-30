"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const SUPER_ADMIN_EMAIL = "superadmin@gmail.com";
const SUPER_ADMIN_PASS = "bloodapp@123456";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    try {
      const isAuth =
        sessionStorage.getItem("admin_auth") === "true" ||
        localStorage.getItem("admin_auth") === "true";
      if (isAuth) {
        router.replace("/admin/dashboard");
      }
    } catch {
      // Storage access safety
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASS) {
        try {
          sessionStorage.setItem("admin_auth", "true");
          localStorage.setItem("admin_auth", "true");
          localStorage.setItem("admin_email", SUPER_ADMIN_EMAIL);
          localStorage.setItem(
            "admin_user",
            JSON.stringify({ email: SUPER_ADMIN_EMAIL, role: "Superadmin" })
          );
        } catch (storageErr) {
          console.error("Storage error:", storageErr);
        }
        router.push("/admin/dashboard");
      } else {
        setLoading(false);
        setError("Invalid email or password. Only authorized super admin can access.");
      }
    }, 600);
  };

  return (
    <div className={styles.loginPage}>
      {/* Background */}
      <div className={styles.loginBg}>
        <div className={styles.loginOrb1} />
        <div className={styles.loginOrb2} />
        <div className={styles.loginGrid} />
      </div>

      {/* Back to site */}
      <Link href="/" className={styles.backBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Site
      </Link>

      {/* Login Card */}
      <div className={styles.loginCard}>
        {/* Logo */}
        <div className={styles.loginLogo}>
          <div className={styles.loginLogoIcon}>
            <svg width="28" height="36" viewBox="0 0 22 28" fill="none">
              <path d="M11 0C11 0 1 10.5 1 17C1 22.523 5.477 27 11 27C16.523 27 21 22.523 21 17C21 10.5 11 0 11 0Z" fill="url(#loginBlood)"/>
              <defs>
                <linearGradient id="loginBlood" x1="11" y1="0" x2="11" y2="27" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F04060"/><stop offset="1" stopColor="#A01020"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className={styles.loginLogoText}>Blood<span style={{color:"#F04060"}}>Banks</span></div>
            <div className={styles.loginLogoSub}>Admin Panel</div>
          </div>
        </div>

        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Welcome Back</h1>
          <p className={styles.loginSubtitle}>Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className={styles.errorAlert} role="alert">
            <svg className={styles.errorIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="admin-email">Email Address</label>
            <div className={styles.inputWrap}>
              <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="admin-email"
                type="email"
                className={styles.loginInput}
                placeholder="superadmin@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label className={styles.inputLabel} htmlFor="admin-password">Password</label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>
            <div className={styles.inputWrap}>
              <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                className={styles.loginInput}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(!showPass)}

                aria-label="Toggle password visibility"
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={loading}
            id="admin-login-submit"
          >
            {loading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>© 2024 Blood Banks. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
