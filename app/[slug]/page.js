"use client";
import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PAGES_CONTENT, FOOTER_SOLUTIONS, FOOTER_GUIDES } from "../data/sitePages";
import styles from "./slug.module.css";

// Blood Compatibility Logic for Interactive Tool
const BLOOD_INFO = {
  "O-": {
    canGiveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
    badge: "Universal Red Cell Donor",
    rarity: "1.5% of BD Population",
    note: "Critically scarce; urgently needed during maternal complications and emergency trauma surgery."
  },
  "O+": {
    canGiveTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
    badge: "Most Common Donor in BD",
    rarity: "32% of BD Population",
    note: "Highly versatile red cells compatible with any Rh-positive patient."
  },
  "A-": {
    canGiveTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["A-", "O-"],
    badge: "Rare Negative Group",
    rarity: "1.2% of BD Population",
    note: "Requires dedicated standby voluntary donor matching across divisional blood banks."
  },
  "A+": {
    canGiveTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    badge: "Core Patient Group",
    rarity: "23% of BD Population",
    note: "High clinical demand for elective surgeries and oncology wards."
  },
  "B-": {
    canGiveTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["B-", "O-"],
    badge: "Scarce Rh Negative",
    rarity: "1.8% of BD Population",
    note: "Vital for neonatal intensive care and thalassemia patients requiring regular transfusions."
  },
  "B+": {
    canGiveTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    badge: "Prevalent BD Blood Group",
    rarity: "33% of BD Population",
    note: "Highest proportion of registered voluntary lifesavers across Bangladesh."
  },
  "AB-": {
    canGiveTo: ["AB-", "AB+"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    badge: "Rarest Blood Type in BD",
    rarity: "<0.5% of BD Population",
    note: "Universal plasma donor; whole blood transfusions require specialized registry coordination."
  },
  "AB+": {
    canGiveTo: ["AB+"],
    canReceiveFrom: ["All 8 Blood Groups"],
    badge: "Universal Red Cell Recipient",
    rarity: "8% of BD Population",
    note: "Can receive whole blood and packed red cells safely from any compatible donor group."
  }
};

export default function DynamicContentPage({ params }) {
  // Unwrap params in Next.js 15
  const unwrappedParams = use(params);
  const slug = unwrappedParams?.slug;
  const page = PAGES_CONTENT[slug];

  if (!page) {
    notFound();
  }

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Tools State
  const [selectedBlood, setSelectedBlood] = useState("O+");
  const [radiusKm, setRadiusKm] = useState(5);
  const [donationCount, setDonationCount] = useState(3);
  const [lastDonationDate, setLastDonationDate] = useState("2026-08-15");
  const [quizAge, setQuizAge] = useState("22");
  const [quizWeight, setQuizWeight] = useState("58");
  const [quizDays, setQuizDays] = useState("95");
  const [quizHealthy, setQuizHealthy] = useState("yes");
  const [triageType, setTriageType] = useState("surgery");

  // Related Links (Pick 3 other items)
  const allLinks = [...FOOTER_SOLUTIONS, ...FOOTER_GUIDES].filter((l) => l.href !== `/${slug}`);
  const relatedLinks = allLinks.slice(0, 3);

  return (
    <div className={styles.pageWrapper}>
      {/* Ambient background glows */}
      <div className={styles.ambientBackground}>
        <div className={styles.glowTop} />
        <div className={styles.glowSide} />
      </div>

      {/* Shared Navbar */}
      <Navbar />

      <main>
        {/* ===================== HERO SECTION ===================== */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumbRow}>
              <Link href="/" className={styles.breadcrumbLink}>
                Home
              </Link>
              <span>/</span>
              <span className={styles.breadcrumbLink}>{page.category}</span>
              <span>/</span>
              <span className={styles.breadcrumbActive}>{page.title.split(" ")[0]}...</span>
            </div>

            {/* Eyebrow Badge */}
            <div className={styles.badgePill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>{page.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className={styles.heroTitle}>
              {page.title.split(" in Bangladesh")[0]}
              {page.title.includes(" in Bangladesh") && (
                <span className={styles.crimsonGradient}> in Bangladesh</span>
              )}
            </h1>

            {/* Subtitle */}
            <p className={styles.heroSubtitle}>{page.subtitle}</p>

            {/* Direct Store Buttons */}
            <div className={styles.storeButtonsRow}>
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
                aria-label="Get it on Google Play"
              >
                <svg className={styles.storeSvg} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M48.7 18.5c-4.8 5.2-7.7 13-7.7 23v429c0 10 2.9 17.8 7.7 23l2.4 2.4L275 272v-5.8L51.1 16.1l-2.4 2.4z"></path>
                  <path fill="#FFBA00" d="M350.8 347.8l-75.8-75.8V266l75.8-75.8 1.8 1 89.8 51.1c25.7 14.6 25.7 38.5 0 53.1l-89.8 51.1-1.8 1.4z"></path>
                  <path fill="#00E676" d="M275 266.2L51.1 490.1c8.4 8.9 22.3 9.9 37.9 1.1l263.6-149.8-77.6-75.2z"></path>
                  <path fill="#FF3D00" d="M275 266.2l77.6-75.2L89 41.2c-15.6-8.9-29.5-7.8-37.9 1.1L275 266.2z"></path>
                </svg>
                <div style={{ textAlign: "left" }}>
                  <span className={styles.btnSub}>GET IT ON</span>
                  <span className={styles.btnMain}>Google Play</span>
                </div>
              </a>

              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
                aria-label="Download on App Store"
              >
                <svg className={styles.storeSvg} viewBox="0 0 384 512" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                </svg>
                <div style={{ textAlign: "left" }}>
                  <span className={styles.btnSub}>Download on the</span>
                  <span className={styles.btnMain}>App Store</span>
                </div>
              </a>
            </div>

            {/* Trust Tags */}
            <div className={styles.trustTagsRow}>
              {page.highlights.map((h) => (
                <div key={h} className={styles.trustTagItem}>
                  <svg className={styles.checkGreen} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== INTERACTIVE WIDGET STAGE ===================== */}
        <section className={styles.toolSection}>
          <div className={styles.container}>
            <div className={styles.toolCardStage}>
              {/* Dynamic tool based on page.toolType */}

              {/* 1. BLOOD COMPATIBILITY EXPLORER */}
              {page.toolType === "compatibility-explorer" && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>INTERACTIVE CLINICAL TOOL</div>
                      <h3 className={styles.toolTitle}>Explore Blood Group Compatibility</h3>
                      <p className={styles.toolDesc}>
                        Select any blood group below to see clinical giving and receiving rules in Bangladesh.
                      </p>
                    </div>
                  </div>

                  <div className={styles.bloodSelectorRow}>
                    {Object.keys(BLOOD_INFO).map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setSelectedBlood(group)}
                        className={`${styles.bloodGroupPill} ${selectedBlood === group ? styles.activeBloodPill : ""}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>

                  <div className={styles.compatResultsGrid}>
                    <div>
                      <div className={styles.compatColTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                        <span>Can Safely Donate Red Cells To:</span>
                      </div>
                      <div className={styles.pillsRow}>
                        {BLOOD_INFO[selectedBlood].canGiveTo.map((g) => (
                          <span key={g} className={styles.giveTag}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className={styles.compatColTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5">
                          <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                        <span>Can Safely Receive Red Cells From:</span>
                      </div>
                      <div className={styles.pillsRow}>
                        {BLOOD_INFO[selectedBlood].canReceiveFrom.map((g) => (
                          <span key={g} className={styles.receiveTag}>
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.clinicalCallout}>
                    <strong>Clinical Transfusion Note: </strong>
                    {BLOOD_INFO[selectedBlood].note} ({BLOOD_INFO[selectedBlood].rarity})
                  </div>
                </div>
              )}

              {/* 2. PROXIMITY RADIUS SIMULATOR */}
              {page.toolType === "proximity-simulator" && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>SPATIAL TELEMETRY SIMULATOR</div>
                      <h3 className={styles.toolTitle}>Radial Proximity &amp; Arrival Estimator</h3>
                      <p className={styles.toolDesc}>
                        Adjust the search radius slider to view arrival times across Dhaka &amp; divisional medical centers.
                      </p>
                    </div>
                  </div>

                  <div className={styles.sliderWrap}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px", display: "block" }}>
                      Search Radius: <span style={{ color: "#EF4444", fontSize: "16px" }}>{radiusKm} km</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className={styles.sliderInput}
                    />

                    <div className={styles.sliderStatsRow}>
                      <div className={styles.statCard}>
                        <div className={styles.statValue} style={{ color: "#EF4444" }}>
                          {radiusKm * 3 + 4} mins
                        </div>
                        <div className={styles.statLabel}>Avg Motorbike Transit (Dhaka Traffic)</div>
                      </div>

                      <div className={styles.statCard}>
                        <div className={styles.statValue} style={{ color: "#10B981" }}>
                          {radiusKm * 18 + 12}
                        </div>
                        <div className={styles.statLabel}>Active Verified Donors in Radius</div>
                      </div>

                      <div className={styles.statCard}>
                        <div className={styles.statValue} style={{ color: "#60A5FA" }}>
                          &lt; 58 sec
                        </div>
                        <div className={styles.statLabel}>FCM Notification Latency</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ELIGIBILITY QUIZ TOOL */}
              {page.toolType === "eligibility-quiz" && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>SELF-CHECK SCREENING WIDGET</div>
                      <h3 className={styles.toolTitle}>Instant 4-Step Donor Eligibility Assessment</h3>
                      <p className={styles.toolDesc}>
                        Answer four basic screening questions to check your current eligibility under Bangladesh DGHS guidelines.
                      </p>
                    </div>
                  </div>

                  <div className={styles.quizCardGrid}>
                    <div className={styles.quizInputGroup}>
                      <label className={styles.quizLabel}>Your Age (Years)</label>
                      <input
                        type="number"
                        value={quizAge}
                        onChange={(e) => setQuizAge(e.target.value)}
                        className={styles.quizInput}
                        placeholder="e.g. 23"
                      />
                    </div>

                    <div className={styles.quizInputGroup}>
                      <label className={styles.quizLabel}>Body Weight (kg)</label>
                      <input
                        type="number"
                        value={quizWeight}
                        onChange={(e) => setQuizWeight(e.target.value)}
                        className={styles.quizInput}
                        placeholder="e.g. 60"
                      />
                    </div>

                    <div className={styles.quizInputGroup}>
                      <label className={styles.quizLabel}>Days Since Last Donation</label>
                      <input
                        type="number"
                        value={quizDays}
                        onChange={(e) => setQuizDays(e.target.value)}
                        className={styles.quizInput}
                        placeholder="e.g. 100"
                      />
                    </div>

                    <div className={styles.quizInputGroup}>
                      <label className={styles.quizLabel}>Current Health (No Fever / No Meds)</label>
                      <select
                        value={quizHealthy}
                        onChange={(e) => setQuizHealthy(e.target.value)}
                        className={styles.quizInput}
                      >
                        <option value="yes">Healthy &amp; No Active Medication</option>
                        <option value="no">Currently Sick or Taking Antibiotics</option>
                      </select>
                    </div>
                  </div>

                  {Number(quizAge) >= 18 &&
                  Number(quizAge) <= 60 &&
                  Number(quizWeight) >= 45 &&
                  Number(quizDays) >= 90 &&
                  quizHealthy === "yes" ? (
                    <div className={`${styles.quizResultBox} ${styles.quizEligible}`}>
                      <div className={styles.quizResultTitle}>✓ You Are Eligible to Donate Blood!</div>
                      <p className={styles.quizResultDesc}>
                        Your physical parameters meet all Bangladesh DGHS and WHO health safety standards. Thank you for being ready to save lives!
                      </p>
                    </div>
                  ) : (
                    <div className={`${styles.quizResultBox} ${styles.quizDeferred}`}>
                      <div className={styles.quizResultTitle}>Temporary Rest or Criteria Not Met</div>
                      <p className={styles.quizResultDesc}>
                        {Number(quizAge) < 18 || Number(quizAge) > 60
                          ? "Donors must be between 18 and 60 years of age."
                          : Number(quizWeight) < 45
                          ? "Minimum body weight requirement is 45 kg."
                          : Number(quizDays) < 90
                          ? `You need ${90 - Number(quizDays)} more days to complete the mandatory 90-day cooldown.`
                          : "Please wait until your antibiotic course and fever recovery are complete before donating."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. COOLDOWN CALCULATOR */}
              {page.toolType === "cooldown-calculator" && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>90-DAY GUARDIAN WIDGET</div>
                      <h3 className={styles.toolTitle}>Cooldown Countdown &amp; Iron Recovery Tracker</h3>
                      <p className={styles.toolDesc}>
                        Enter your previous donation date to compute your exact recovery timeline and next eligible date.
                      </p>
                    </div>
                  </div>

                  <div style={{ maxWidth: "400px", marginBottom: "24px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px", display: "block" }}>
                      Date of Last Blood Donation:
                    </label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className={styles.quizInput}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className={styles.sliderStatsRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#EF4444" }}>
                        90 Days
                      </div>
                      <div className={styles.statLabel}>DGHS Standard Rest Interval</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#10B981" }}>
                        100%
                      </div>
                      <div className={styles.statLabel}>Bone Marrow Erythropoiesis</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#60A5FA" }}>
                        Day 91
                      </div>
                      <div className={styles.statLabel}>Notification on Next Eligible Date</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. EMERGENCY TRIAGE SIMULATOR */}
              {page.toolType === "triage-simulator" && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>EMERGENCY DISPATCH WIDGET</div>
                      <h3 className={styles.toolTitle}>Emergency Case Priority Matrix</h3>
                      <p className={styles.toolDesc}>
                        Select a case type to see how the Firebase push pipeline handles emergency priority and notification escalation.
                      </p>
                    </div>
                  </div>

                  <div className={styles.bloodSelectorRow}>
                    <button
                      type="button"
                      onClick={() => setTriageType("surgery")}
                      className={`${styles.bloodGroupPill} ${triageType === "surgery" ? styles.activeBloodPill : ""}`}
                    >
                      ICU Emergency Surgery
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriageType("trauma")}
                      className={`${styles.bloodGroupPill} ${triageType === "trauma" ? styles.activeBloodPill : ""}`}
                    >
                      Highway Trauma Accident
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriageType("thalassemia")}
                      className={`${styles.bloodGroupPill} ${triageType === "thalassemia" ? styles.activeBloodPill : ""}`}
                    >
                      Thalassemia Monthly Transfusion
                    </button>
                    <button
                      type="button"
                      onClick={() => setTriageType("csection")}
                      className={`${styles.bloodGroupPill} ${triageType === "csection" ? styles.activeBloodPill : ""}`}
                    >
                      Maternal Delivery &amp; C-Section
                    </button>
                  </div>

                  <div className={styles.sliderStatsRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#EF4444" }}>
                        {triageType === "surgery" ? "Tier 1: Critical" : triageType === "trauma" ? "Tier 1: Urgent" : triageType === "csection" ? "Tier 2: High" : "Tier 3: Scheduled"}
                      </div>
                      <div className={styles.statLabel}>Broadcast Escalation Level</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#10B981" }}>
                        {triageType === "surgery" ? "< 60 Secs" : triageType === "trauma" ? "< 90 Secs" : "< 3 Mins"}
                      </div>
                      <div className={styles.statLabel}>Target First Donor Match</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#60A5FA" }}>
                        {triageType === "thalassemia" ? "Standby Volunteer" : "High-Priority FCM Ring"}
                      </div>
                      <div className={styles.statLabel}>Notification Channel Protocol</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. IMPACT CALCULATOR */}
              {page.toolType === "impact-calculator" && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>COMMUNITY IMPACT WIDGET</div>
                      <h3 className={styles.toolTitle}>Lifetime Humanitarian Impact Estimator</h3>
                      <p className={styles.toolDesc}>
                        Enter the number of times you have voluntarily donated blood to calculate your lifetime contribution.
                      </p>
                    </div>
                  </div>

                  <div style={{ maxWidth: "320px", marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#E2E8F0", marginBottom: "8px", display: "block" }}>
                      Lifetime Blood Donations:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={donationCount}
                      onChange={(e) => setDonationCount(Math.max(1, Number(e.target.value)))}
                      className={styles.quizInput}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className={styles.sliderStatsRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#EF4444" }}>
                        {donationCount * 450} ml
                      </div>
                      <div className={styles.statLabel}>Total Whole Blood Given</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#10B981" }}>
                        {donationCount * 3} Lives
                      </div>
                      <div className={styles.statLabel}>Potential Lives Touched</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#60A5FA" }}>
                        {donationCount >= 10 ? "Gold Legend" : donationCount >= 3 ? "Silver Lifesaver" : "Bronze Hero"}
                      </div>
                      <div className={styles.statLabel}>Blood Banks Community Tier</div>
                    </div>
                  </div>
                </div>
              )}

              {/* DEFAULT / OTHER TOOLS */}
              {["inventory-explorer", "privacy-comparison", "guides-directory", "recovery-timeline", "protocol-checklist", "screening-standards", "legal-document"].includes(page.toolType) && (
                <div>
                  <div className={styles.toolHeader}>
                    <div>
                      <div className={styles.toolHeadingTag}>BANGLADESH CLINICAL STANDARD</div>
                      <h3 className={styles.toolTitle}>Key Verification &amp; Protocol Safeguards</h3>
                      <p className={styles.toolDesc}>
                        Engineered under WHO standards and Directorate General of Health Services (DGHS) regulations.
                      </p>
                    </div>
                  </div>

                  <div className={styles.sliderStatsRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#EF4444" }}>
                        100% Free
                      </div>
                      <div className={styles.statLabel}>Voluntary &amp; Non-Remunerated</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#10B981" }}>
                        64 Districts
                      </div>
                      <div className={styles.statLabel}>National BD Coverage</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statValue} style={{ color: "#60A5FA" }}>
                        Supabase SSL
                      </div>
                      <div className={styles.statLabel}>End-to-End Encrypted Records</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================== DEEP-DIVE FEATURE CARDS ===================== */}
        <section className={styles.cardsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingWrap}>
              <div className={styles.secEyebrow}>CORE SYSTEM CAPABILITIES</div>
              <h2 className={styles.secTitle}>Built for Absolute Reliability</h2>
              <p className={styles.secSub}>
                Every protocol is designed to maximize patient survival while protecting donor dignity and safety.
              </p>
            </div>

            <div className={styles.cardsGrid}>
              {page.cards.map((c) => (
                <div key={c.title} className={styles.featureCard}>
                  <span className={styles.cardTag}>{c.tag}</span>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardDesc}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== BANGLADESH LOCAL CONTEXT ===================== */}
        {page.localContext && (
          <section className={styles.contextSection}>
            <div className={styles.container}>
              <div className={styles.contextBox}>
                <div className={styles.contextTag}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{page.localContext.tag}</span>
                </div>

                <h3 className={styles.contextTitle}>{page.localContext.title}</h3>
                <p className={styles.contextDesc}>{page.localContext.desc}</p>

                <div className={styles.contextPointsGrid}>
                  {page.localContext.points.map((pt, i) => (
                    <div key={pt.title} className={styles.contextPointItem}>
                      <div className={styles.pointNumBadge}>{i + 1}</div>
                      <div>
                        <div className={styles.pointTitle}>{pt.title}</div>
                        <p className={styles.pointDesc}>{pt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================== FAQ ACCORDION SECTION ===================== */}
        {page.faqs && page.faqs.length > 0 && (
          <section className={styles.faqSection}>
            <div className={styles.container}>
              <div className={styles.sectionHeadingWrap}>
                <div className={styles.secEyebrow}>COMMONLY ASKED QUESTIONS</div>
                <h2 className={styles.secTitle}>Frequently Asked Questions</h2>
                <p className={styles.secSub}>
                  Clear medical answers regarding blood donation, safety, and procedures in Bangladesh.
                </p>
              </div>

              <div className={styles.faqStack}>
                {page.faqs.map((faq, idx) => (
                  <div
                    key={faq.q}
                    className={`${styles.faqItem} ${openFaq === idx ? styles.faqItemOpen : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                      className={styles.faqQuestionBtn}
                    >
                      <span>{faq.q}</span>
                      <svg
                        className={`${styles.chevronIcon} ${openFaq === idx ? styles.chevronRotated : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {openFaq === idx && (
                      <div className={styles.faqAnswer}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===================== RELATED GUIDES & SOLUTIONS ===================== */}
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF", marginBottom: "20px" }}>
              Related Solutions &amp; Guides
            </h3>

            <div className={styles.relatedGrid}>
              {relatedLinks.map((rel) => (
                <Link key={rel.href} href={rel.href} className={styles.relatedCard}>
                  <div>
                    <div className={styles.relatedTitleRow}>
                      <span>{rel.title}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                    <p className={styles.relatedDesc}>{rel.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CTA BANNER SECTION ===================== */}
        <section className={styles.ctaBannerSection}>
          <div className={styles.container}>
            <div className={styles.ctaBannerCard}>
              <div className={styles.ctaIconBox}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              <h2 className={styles.ctaHeading}>Be the Reason Someone Goes Home.</h2>
              <p className={styles.ctaSub}>
                Download the BloodBanks mobile app today on Android and iOS. 100% free, voluntary, and community-driven across 64 districts in Bangladesh.
              </p>

              <div className={styles.storeButtonsRow} style={{ marginBottom: 0 }}>
                <a
                  href="https://play.google.com/store/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.storeBtn}
                  style={{ background: "#0F172A", borderColor: "rgba(255,255,255,0.25)" }}
                >
                  <svg className={styles.storeSvg} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M48.7 18.5c-4.8 5.2-7.7 13-7.7 23v429c0 10 2.9 17.8 7.7 23l2.4 2.4L275 272v-5.8L51.1 16.1l-2.4 2.4z"></path>
                    <path fill="#FFBA00" d="M350.8 347.8l-75.8-75.8V266l75.8-75.8 1.8 1 89.8 51.1c25.7 14.6 25.7 38.5 0 53.1l-89.8 51.1-1.8 1.4z"></path>
                    <path fill="#00E676" d="M275 266.2L51.1 490.1c8.4 8.9 22.3 9.9 37.9 1.1l263.6-149.8-77.6-75.2z"></path>
                    <path fill="#FF3D00" d="M275 266.2l77.6-75.2L89 41.2c-15.6-8.9-29.5-7.8-37.9 1.1L275 266.2z"></path>
                  </svg>
                  <div style={{ textAlign: "left" }}>
                    <span className={styles.btnSub}>GET IT ON</span>
                    <span className={styles.btnMain}>Google Play</span>
                  </div>
                </a>

                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.storeBtn}
                  style={{ background: "#0F172A", borderColor: "rgba(255,255,255,0.25)" }}
                >
                  <svg className={styles.storeSvg} viewBox="0 0 384 512" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                  </svg>
                  <div style={{ textAlign: "left" }}>
                    <span className={styles.btnSub}>Download on the</span>
                    <span className={styles.btnMain}>App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
