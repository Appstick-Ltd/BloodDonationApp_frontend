"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./page.module.css";

const supabase = createClient(
  "https://gdlyandsddfbmjauwgsz.supabase.co",
  "sb_publishable_hl1hxvuxiXQB2BXc70ESbw_F4ToDHFx"
);

// Blood Compatibility Logic for Interactive Matrix
const BLOOD_INFO = {
  "O-": {
    canGiveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
    badge: "Universal Red Cell Donor",
    rarity: "1.5% of BD Population",
    note: "Critically important for emergency transfusions when patient type is unknown."
  },
  "O+": {
    canGiveTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
    badge: "Most Common Donor",
    rarity: "32% of BD Population",
    note: "Highest daily demand in hospitals across all 64 districts."
  },
  "A-": {
    canGiveTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["A-", "O-"],
    badge: "Rare Negative Group",
    rarity: "2.1% of BD Population",
    note: "Immediate matching required when scheduled surgeries take place."
  },
  "A+": {
    canGiveTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    badge: "High Demand Group",
    rarity: "27% of BD Population",
    note: "Commonly needed for cancer care, surgeries and trauma patients."
  },
  "B-": {
    canGiveTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["B-", "O-"],
    badge: "Critical Shortage Group",
    rarity: "3.2% of BD Population",
    note: "Always on critical priority alert in our emergency broadcast engine."
  },
  "B+": {
    canGiveTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    badge: "Vital Blood Group",
    rarity: "31% of BD Population",
    note: "Second most prevalent group in Bangladesh with steady demand."
  },
  "AB-": {
    canGiveTo: ["AB-", "AB+"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    badge: "Ultra Rare Blood Type",
    rarity: "0.8% of BD Population",
    note: "The rarest blood type in the country requiring rapid notification network."
  },
  "AB+": {
    canGiveTo: ["AB+"],
    canReceiveFrom: ["All Blood Types (Universal Recipient)"],
    badge: "Universal Plasma Donor",
    rarity: "7.4% of BD Population",
    note: "Can safely receive red blood cells from any blood group in an emergency."
  },
};

const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogura", "Brahmanbaria",
  "Chandpur", "Chapainawabganj", "Chittagong", "Chuadanga", "Cox's Bazar", "Cumilla",
  "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
  "Habiganj", "Jamalpur", "Jessore", "Jhalokathi", "Jhenaidah", "Joypurhat",
  "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur",
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi",
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
  "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
  "Tangail", "Thakurgaon"
];

function useCountUp(end, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart || end === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, shouldStart]);
  return count;
}

export default function LandingPage() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [liveStats, setLiveStats] = useState({ donors: 0, livesSaved: 0, bloodRequests: 0, districts: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedBlood, setSelectedBlood] = useState("O-");
  const [recentRequests, setRecentRequests] = useState([]);

  // Live Donor Search States (Default: nothing pre-selected)
  const [searchBloodGroup, setSearchBloodGroup] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchAreaKeyword, setSearchAreaKeyword] = useState("");
  const [searchOnlyAvailable, setSearchOnlyAvailable] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showAllDonors, setShowAllDonors] = useState(false);
  const [searchTotalCount, setSearchTotalCount] = useState(0);
  const [searchAvailableCount, setSearchAvailableCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [dbDistricts, setDbDistricts] = useState(["Khulna", "Dhaka", "Chittagong", "Rajshahi", "Sylhet", "Barisal"]);

  const [bloodGroupDist, setBloodGroupDist] = useState([
    { group: "A+", pct: 0, count: 0, color: "#C5162E" },
    { group: "B+", pct: 0, count: 0, color: "#E01A34" },
    { group: "O+", pct: 0, count: 0, color: "#F04060" },
    { group: "AB+", pct: 0, count: 0, color: "#FF6B8A" },
    { group: "A-", pct: 0, count: 0, color: "#7B0A1A" },
    { group: "B-", pct: 0, count: 0, color: "#A01020" },
    { group: "O-", pct: 0, count: 0, color: "#8B1A2A" },
    { group: "AB-", pct: 0, count: 0, color: "#6B0F1A" },
  ]);

  const fetchStats = useCallback(async () => {
    try {
      const [donorsRes, requestsRes, emergencyListRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("emergency_requests").select("id", { count: "exact", head: true }),
        supabase.from("emergency_requests").select("id, patient_name, hospital_name, blood_group, urgency_level, district, status, created_at").order("created_at", { ascending: false }).limit(6),
      ]);
      const { count: completedCount } = await supabase
        .from("emergency_requests").select("id", { count: "exact", head: true }).eq("status", "Fulfilled");
      const { data: districtData } = await supabase
        .from("profiles").select("district").not("district", "is", null);
      const districtList = (districtData || []).map((p) => p.district?.trim()).filter(Boolean);
      const uniqueDistricts = new Set(districtList).size;
      const uniqueDistinctList = Array.from(new Set(districtList));
      if (uniqueDistinctList.length > 0) {
        setDbDistricts(uniqueDistinctList);
      }

      setLiveStats({
        donors: donorsRes.count || 0,
        livesSaved: completedCount || 0,
        bloodRequests: requestsRes.count || 0,
        districts: uniqueDistricts || 0,
      });

      if (emergencyListRes.data) {
        setRecentRequests(emergencyListRes.data);
      }

      const { data: bloodData } = await supabase
        .from("profiles").select("blood_group").not("blood_group", "is", null);
      if (bloodData && bloodData.length > 0) {
        const total = bloodData.length;
        const counts = {};
        bloodData.forEach(({ blood_group }) => {
          const bg = blood_group?.trim().toUpperCase();
          if (bg) counts[bg] = (counts[bg] || 0) + 1;
        });
        const bgColors = { "A+": "#C5162E", "B+": "#E01A34", "O+": "#F04060", "AB+": "#FF6B8A", "A-": "#7B0A1A", "B-": "#A01020", "O-": "#8B1A2A", "AB-": "#6B0F1A" };
        setBloodGroupDist(["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(g => ({
          group: g, pct: total > 0 ? Math.round(((counts[g] || 0) / total) * 100) : 0,
          color: bgColors[g], count: counts[g] || 0,
        })));
      }
      setLastUpdated(new Date());
      setStatsLoading(false);
    } catch (err) {
      console.error("Supabase fetch error:", err);
      setStatsLoading(false);
    }
  }, []);

  const executeDonorSearch = useCallback(async (overrideGroup, overrideDistrict, overrideOnlyAvail, overrideArea) => {
    const bg = overrideGroup !== undefined ? overrideGroup : searchBloodGroup;
    const dist = overrideDistrict !== undefined ? overrideDistrict : searchDistrict;
    const onlyAvail = overrideOnlyAvail !== undefined ? overrideOnlyAvail : searchOnlyAvailable;
    const area = overrideArea !== undefined ? overrideArea : searchAreaKeyword;

    setIsSearching(true);
    setSearchError(null);
    try {
      let query = supabase
        .from("profiles")
        .select("id, full_name, blood_group, district, area, is_available, is_eligible, last_donation_date, created_at, gender", { count: "exact" });

      if (bg && bg !== "All") {
        query = query.eq("blood_group", bg);
      }

      if (dist && dist !== "All") {
        query = query.or(`district.ilike.%${dist}%,area.ilike.%${dist}%`);
      }

      if (area && area.trim()) {
        const clean = area.trim();
        query = query.or(`area.ilike.%${clean}%,district.ilike.%${clean}%`);
      }

      if (onlyAvail) {
        query = query.eq("is_available", true);
      }

      query = query.order("is_available", { ascending: false }).order("created_at", { ascending: false }).limit(24);

      const { data, count, error } = await query;
      if (error) {
        console.error("Search donor error:", error);
        setSearchError(error.message);
      } else {
        const donorsList = data || [];
        setSearchResults(donorsList);
        setSearchTotalCount(count !== null && count !== undefined ? count : donorsList.length);
        const availCount = donorsList.filter((d) => d.is_available).length;
        setSearchAvailableCount(availCount);
      }
      setHasSearched(true);
    } catch (err) {
      console.error("Error executing donor search:", err);
      setSearchError(err.message || "Failed to search donors");
    } finally {
      setIsSearching(false);
    }
  }, [searchBloodGroup, searchDistrict, searchOnlyAvailable, searchAreaKeyword]);

  const handleQuickFilter = (group, district, onlyAvail = false) => {
    const scrollY = window.scrollY;
    setShowAllDonors(false);
    setSearchBloodGroup(group);
    setSearchDistrict(district);
    setSearchOnlyAvailable(onlyAvail);
    setSearchAreaKeyword("");
    executeDonorSearch(group, district, onlyAvail, "").then(() => {
      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
    });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const scrollY = window.scrollY;
    setShowAllDonors(false);
    executeDonorSearch().then(() => {
      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
    });
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Donor Count-ups
  const donorsCount = useCountUp(liveStats.donors, 2200, statsVisible && !statsLoading);
  const livesCount = useCountUp(liveStats.livesSaved, 2200, statsVisible && !statsLoading);
  const requestsCount = useCountUp(liveStats.bloodRequests, 2200, statsVisible && !statsLoading);
  const districtsCount = useCountUp(liveStats.districts, 2200, statsVisible && !statsLoading);

  const activeBloodData = useMemo(() => BLOOD_INFO[selectedBlood], [selectedBlood]);

  // Show only 2 lines (6 cards in a 3-col grid) by default
  const displayedDonors = useMemo(() => {
    return showAllDonors ? searchResults : searchResults.slice(0, 6);
  }, [showAllDonors, searchResults]);

  return (
    <main className={styles.main}>
      {/* Background Soft Ambient Light */}
      <div className={styles.ambientCanvas}>
        <div className={styles.orbTopGlow} />
        <div className={styles.orbSideGlow} />
        <div className={styles.subtleGrid} />
      </div>

      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className={styles.heroSection} id="home">
        <div className="container">
          <div className={styles.heroLayout}>
            {/* Left Content */}
            <div className={styles.heroCopy}>
              <div className={styles.pulseTag}>
                <span className={styles.pulseDot} />
                <span>BANGLADESH&apos;S REAL-TIME BLOOD NETWORK</span>
              </div>

              <h1 className={styles.heroMainTitle}>
                When Seconds Matter,<br />
                <span className={styles.crimsonGradient}>Every Drop Counts.</span>
              </h1>

              <p className={styles.heroParagraph}>
                An intelligent voluntary emergency platform connecting critical patients with verified donors within a 5km radius in real-time. Zero commercial brokers, zero delays.
              </p>

              {/* Action Area */}
              <div className={styles.heroActions}>
                <a href="#find-donors" className={styles.btnPrimaryLg}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Find Donors Now</span>
                </a>
                <a href="#download" className={styles.btnSecondaryLg}>
                  <span>Download App</span>
                  <span>↓</span>
                </a>
              </div>

              {/* Live Trust Metrics */}
              <div className={styles.heroTrustGrid}>
                <div className={styles.trustCard}>
                  <div className={styles.trustVal}>&lt; 60s</div>
                  <div className={styles.trustLbl}>Avg. Donor Match</div>
                </div>
                <div className={styles.trustDivider} />
                <div className={styles.trustCard}>
                  <div className={styles.trustVal}>100%</div>
                  <div className={styles.trustLbl}>Voluntary &amp; Free</div>
                </div>
                <div className={styles.trustDivider} />
                <div className={styles.trustCard}>
                  <div className={styles.trustVal}>64</div>
                  <div className={styles.trustLbl}>Districts Active</div>
                </div>
              </div>
            </div>

            {/* Right: Bespoke 3D Phone App Stage */}
            <div className={styles.heroDeviceStage}>
              {/* Backing Ambient Depth */}
              <div className={styles.stageBacklight} />

              {/* Floating Contextual Badges */}
              <div className={`${styles.floatBadge} ${styles.badgeTopLeft}`}>
                <div className={styles.badgeIcon}>⚡</div>
                <div>
                  <div className={styles.badgeTitle}>FCM Push Dispatched</div>
                  <div className={styles.badgeSub}>18 Compatible donors notified</div>
                </div>
              </div>

              <div className={`${styles.floatBadge} ${styles.badgeBottomRight}`}>
                <div className={styles.badgeIconRed}>🩸</div>
                <div>
                  <div className={styles.badgeTitle}>Direct Attendant Line</div>
                  <div className={styles.badgeSub}>Zero middleman fees</div>
                </div>
              </div>

              {/* The iPhone 15 Pro Titanium Frame */}
              <div className={styles.phoneChassis}>
                <div className={styles.phoneBezel}>
                  <div className={styles.phoneScreen}>
                    {/* Status Bar & Dynamic Island */}
                    <div className={styles.phoneTopBar}>
                      <span className={styles.clockTime}>09:41</span>
                      <div className={styles.dynamicIsland}>
                        <span className={styles.islandDot} />
                        <span className={styles.islandPulse}>Live SOS</span>
                      </div>
                      <div className={styles.signalGroup}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z" /></svg>
                        <svg width="14" height="10" viewBox="0 0 24 14" fill="currentColor"><rect x="1" y="1" width="22" height="12" rx="2" /><rect x="23" y="4" width="2" height="6" /></svg>
                      </div>
                    </div>

                    {/* App Internal Header */}
                    <div className={styles.appBar}>
                      <div>
                        <div className={styles.appHeaderTitle}>BloodBanks</div>
                        <div className={styles.appHeaderLoc}>📍 Dhaka Medical College Hospital</div>
                      </div>
                      <div className={styles.sosStatusBadge}>CRITICAL</div>
                    </div>

                    {/* Emergency Request Card Showcase */}
                    <div className={styles.emergencyCard}>
                      <div className={styles.ecTop}>
                        <span className={styles.ecPulsePill}>🚨 SURGERY CASE</span>
                        <span className={styles.ecBags}>2 Bags Needed</span>
                      </div>

                      <div className={styles.ecGroupRow}>
                        <div className={styles.ecBloodBig}>O- Negative</div>
                        <div className={styles.ecTag}>Rare Group</div>
                      </div>

                      <div className={styles.ecHospitalInfo}>
                        <strong>Dhaka Medical College &amp; Hospital</strong>
                        <p>ICU Bed #08 • Operation Scheduled Today</p>
                      </div>

                      {/* Donors Responded Progress */}
                      <div className={styles.ecDonorProgress}>
                        <div className={styles.ecAvGroup}>
                          <div className={styles.ecAv} style={{ background: "#C5162E" }}>R</div>
                          <div className={styles.ecAv} style={{ background: "#0F172A" }}>A</div>
                          <div className={styles.ecAv} style={{ background: "#2563EB" }}>T</div>
                        </div>
                        <span className={styles.ecProgressText}>3 Donors are on the way</span>
                      </div>

                      <button className={styles.ecActionBtn}>
                        <span>Accept &amp; Connect with Family</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* Nearby Hospitals Quick List */}
                    <div className={styles.nearbySection}>
                      <div className={styles.nearbyTitle}>Nearby Emergency Units</div>
                      <div className={styles.hospitalMiniItem}>
                        <div className={styles.hIcon}>🏥</div>
                        <div>
                          <div className={styles.hName}>BSMMU (PG Hospital)</div>
                          <div className={styles.hDist}>1.4 km • 6 Donors Ready</div>
                        </div>
                      </div>
                      <div className={styles.hospitalMiniItem}>
                        <div className={styles.hIcon}>🏥</div>
                        <div>
                          <div className={styles.hName}>Kurmitola General Hospital</div>
                          <div className={styles.hDist}>3.2 km • 11 Donors Ready</div>
                        </div>
                      </div>
                    </div>

                    {/* App Bottom Tab Navigation */}
                    <div className={styles.appTabBar}>
                      <div className={`${styles.tabBtn} ${styles.tabBtnActive}`}>
                        <span>🏠</span>
                        <small>Feed</small>
                      </div>
                      <div className={styles.tabBtn}>
                        <span>🚨</span>
                        <small>Emergency</small>
                      </div>
                      <div className={styles.tabBtn}>
                        <span>👥</span>
                        <small>Donors</small>
                      </div>
                      <div className={styles.tabBtn}>
                        <span>👤</span>
                        <small>Profile</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LIVE DONOR SEARCH & AVAILABILITY CHECKER ===================== */}
      <section className={styles.searchSection} id="find-donors">
        <div className="container">
          <div className={styles.searchContainerCard}>
            {/* Header info */}
            <div className={styles.searchCardHeader}>
              <div className={styles.searchTopBadge}>
                <span className={styles.searchPulseDot} />
                <span>REAL-TIME DONOR DATABASE (64 DISTRICTS)</span>
              </div>
              <h2 className={styles.searchSectionTitle}>
                Find Voluntary Donors <span className={styles.crimsonGradient}>in Your City</span>
              </h2>
              <p className={styles.searchSectionSub}>
                Select blood group and district to check registered voluntary donors ready to donate immediately.
              </p>
            </div>

            {/* Filter controls form */}
            <form onSubmit={handleSearchSubmit} className={styles.searchFormBox}>
              <div className={styles.searchControlsRow}>
                {/* Blood Group Select */}
                <div className={styles.searchControlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.controlIcon}>🩸</span> Blood Group
                  </label>
                  <select
                    value={searchBloodGroup}
                    onChange={(e) => setSearchBloodGroup(e.target.value)}
                    className={styles.controlSelect}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="All">All Blood Groups</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg} Blood Group
                      </option>
                    ))}
                  </select>
                </div>

                {/* District / City Select */}
                <div className={styles.searchControlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.controlIcon}>📍</span> District / City
                  </label>
                  <select
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    className={styles.controlSelect}
                  >
                    <option value="">Select District / City</option>
                    <option value="All">All Districts</option>
                    <optgroup label="Active Donor Regions">
                      {dbDistricts.map((d) => (
                        <option key={`active-${d}`} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All 64 Districts">
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={`all-${d}`} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Thana / Area Keyword */}
                <div className={styles.searchControlGroup}>
                  <label className={styles.controlLabel}>
                    <span className={styles.controlIcon}>🏘️</span> Area / Thana (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sonadanga, Khulna City..."
                    value={searchAreaKeyword}
                    onChange={(e) => setSearchAreaKeyword(e.target.value)}
                    className={styles.controlInput}
                  />
                </div>

                {/* Search Button */}
                <div className={styles.searchBtnWrap}>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={styles.searchSubmitBtn}
                  >
                    {isSearching ? (
                      <>
                        <span className={styles.searchSpinner} />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span>Check Donors</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-bar: Quick Filter Chips & Only Available toggle */}
              <div className={styles.searchSubControls}>
                <div className={styles.quickChipsBox}>
                  <span className={styles.quickLabel}>Quick:</span>
                  <button
                    type="button"
                    className={`${styles.quickChip} ${searchDistrict === "Khulna" && searchBloodGroup === "All" ? styles.quickChipActive : ""}`}
                    onClick={() => handleQuickFilter("All", "Khulna")}
                  >
                    🩸 All Khulna
                  </button>
                  <button
                    type="button"
                    className={`${styles.quickChip} ${searchDistrict === "Khulna" && searchBloodGroup === "B+" ? styles.quickChipActive : ""}`}
                    onClick={() => handleQuickFilter("B+", "Khulna")}
                  >
                    🩸 B+ Khulna
                  </button>
                  <button
                    type="button"
                    className={`${styles.quickChip} ${searchDistrict === "Khulna" && searchBloodGroup === "O+" ? styles.quickChipActive : ""}`}
                    onClick={() => handleQuickFilter("O+", "Khulna")}
                  >
                    🩸 O+ Khulna
                  </button>
                  <button
                    type="button"
                    className={`${styles.quickChip} ${searchDistrict === "Dhaka" ? styles.quickChipActive : ""}`}
                    onClick={() => handleQuickFilter("All", "Dhaka")}
                  >
                    🩸 Dhaka Donors
                  </button>
                  <button
                    type="button"
                    className={`${styles.quickChip} ${searchBloodGroup === "O-" ? styles.quickChipActive : ""}`}
                    onClick={() => handleQuickFilter("O-", "All")}
                  >
                    🩸 Urgent O-
                  </button>
                  <button
                    type="button"
                    className={`${styles.quickChip} ${searchDistrict === "All" && searchBloodGroup === "All" ? styles.quickChipActive : ""}`}
                    onClick={() => handleQuickFilter("All", "All")}
                  >
                    🌐 All BD
                  </button>
                </div>

                <label className={styles.availToggleContainer}>
                  <input
                    type="checkbox"
                    checked={searchOnlyAvailable}
                    onChange={(e) => {
                      const scrollY = window.scrollY;
                      setSearchOnlyAvailable(e.target.checked);
                      if (hasSearched) {
                        executeDonorSearch(undefined, undefined, e.target.checked).then(() => {
                          requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
                        });
                      }
                    }}
                    className={styles.availCheckbox}
                  />
                  <span className={styles.availToggleText}>Available Now Only</span>
                </label>
              </div>
            </form>

            {/* Results Live Indicator Header & Cards OR Initial Prompt */}
            {!hasSearched ? (
              <div className={styles.searchPromptCard}>
                <div className={styles.promptIconWrap}>
                  <span className={styles.promptIcon}>🩸</span>
                </div>
                <h3 className={styles.promptTitle}>Search Voluntary Donors in Real-Time</h3>
                <p className={styles.promptSub}>
                  Select your required blood group and district above to check available voluntary donors in real-time, or choose popular quick filters.
                </p>
                <div className={styles.promptStatsRow}>
                  <div className={styles.promptStatItem}>
                    <span className={styles.promptStatVal}>100% Free</span>
                    <span className={styles.promptStatLbl}>Voluntary Network</span>
                  </div>
                  <div className={styles.promptStatDivider} />
                  <div className={styles.promptStatItem}>
                    <span className={styles.promptStatVal}>64 Districts</span>
                    <span className={styles.promptStatLbl}>Bangladesh-wide</span>
                  </div>
                  <div className={styles.promptStatDivider} />
                  <div className={styles.promptStatItem}>
                    <span className={styles.promptStatVal}>Verified</span>
                    <span className={styles.promptStatLbl}>Protected Donors</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Results Live Indicator Header */}
                <div className={styles.resultsLiveBanner}>
                  <div className={styles.resultsCounterBlock}>
                    <div className={styles.bigCountNumber}>
                      {searchTotalCount}
                    </div>
                    <div className={styles.bigCountCopy}>
                      <div className={styles.bigCountHeading}>
                        {searchTotalCount > 0
                          ? `${searchTotalCount} Voluntary Donor${searchTotalCount > 1 ? "s" : ""} Found`
                          : "0 Donors Found for Selected Filter"}
                      </div>
                      <div className={styles.bigCountSub}>
                        {searchAvailableCount > 0 ? (
                          <span className={styles.readyHighlight}>
                            🟢 <strong>{searchAvailableCount} Available to donate right now</strong> in {searchDistrict === "All" || !searchDistrict ? "Bangladesh" : searchDistrict}
                          </span>
                        ) : searchTotalCount > 0 ? (
                          <span>All registered donors in this filter are currently in recovery/cooldown</span>
                        ) : (
                          <span>Try choosing &quot;All Districts&quot; or clearing area filters</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.activeFilterPillsRow}>
                    <span className={styles.filterPillItem}>
                      Blood: <strong>{searchBloodGroup || "All"}</strong>
                    </span>
                    <span className={styles.filterPillItem}>
                      Region: <strong>{searchDistrict === "All" || !searchDistrict ? "All Bangladesh" : searchDistrict}</strong>
                    </span>
                    {searchAreaKeyword && (
                      <span className={styles.filterPillItem}>
                        Area: <strong>{searchAreaKeyword}</strong>
                      </span>
                    )}
                    {searchOnlyAvailable && (
                      <span className={styles.filterPillItemReady}>
                        ✓ Ready Only
                      </span>
                    )}
                  </div>
                </div>

                {/* Donor Cards Grid or Empty State */}
                {searchResults.length > 0 ? (
                  <>
                    <div className={styles.donorsListGrid}>
                      {displayedDonors.map((donor) => {
                        const initials = (donor.full_name || "D")
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase();
                        const hasPhoto = donor.profile_image_url && donor.profile_image_url.startsWith("http");

                        return (
                          <div key={donor.id} className={styles.donorProfileCard}>
                            <div className={styles.cardHeaderArea}>
                              <div className={styles.avatarHolder}>
                                {hasPhoto ? (
                                  <img
                                    src={donor.profile_image_url}
                                    alt={donor.full_name}
                                    className={styles.avatarPhoto}
                                  />
                                ) : (
                                  <div className={styles.avatarInitialBadge}>
                                    {initials}
                                  </div>
                                )}
                                <span className={styles.bloodTypeCornerBadge}>
                                  {donor.blood_group || "B+"}
                                </span>
                              </div>

                              <div className={styles.nameBlock}>
                                <div className={styles.donorNameLine}>
                                  <h4 className={styles.cardDonorName}>{donor.full_name || "Registered Donor"}</h4>
                                  <span className={styles.verifiedCheckBadge} title="Verified Donor">✓</span>
                                </div>
                                <div className={styles.cardLocationLine}>
                                  <span className={styles.pinIcon}>📍</span>
                                  <span>{donor.district || "Bangladesh"}{donor.area ? `, ${donor.area}` : ""}</span>
                                </div>
                              </div>
                            </div>

                            <div className={styles.cardStatusRow}>
                              {donor.is_available ? (
                                <span className={styles.statusPillReady}>
                                  <span className={styles.statusDotGreen} /> Available Now
                                </span>
                              ) : (
                                <span className={styles.statusPillRest}>
                                  <span className={styles.statusDotAmber} /> In Cooldown
                                </span>
                              )}
                              <span className={styles.lastDonationMeta}>
                                {donor.last_donation_date ? `Last: ${donor.last_donation_date}` : "Ready to donate"}
                              </span>
                            </div>

                            <div className={styles.cardFooterAction}>
                              <a
                                href="#download"
                                className={styles.callDonorAction}
                                title="Connect via BloodBanks App"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Connect via App</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {searchResults.length > 6 && (
                      <div className={styles.showMoreContainer}>
                        <button
                          type="button"
                          className={styles.showMoreBtn}
                          onClick={() => setShowAllDonors(!showAllDonors)}
                        >
                          {showAllDonors ? (
                            <>
                              <span>Show Less</span>
                              <span>↑</span>
                            </>
                          ) : (
                            <>
                              <span>View More Donors ({searchResults.length - 6} more)</span>
                              <span>↓</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.noResultsBox}>
                    <div className={styles.noResultsIcon}>🩸</div>
                    <h3 className={styles.noResultsTitle}>No Registered Donors Found</h3>
                    <p className={styles.noResultsSub}>
                      No donors matching <strong>{searchBloodGroup || "this blood group"}</strong> in <strong>{searchDistrict || "this region"}</strong> were found right now.
                    </p>
                    <div className={styles.noResultsBtnsRow}>
                      <button
                        type="button"
                        className={styles.btnResetSearch}
                        onClick={() => handleQuickFilter("All", "Khulna")}
                      >
                        View All Khulna Donors
                      </button>
                      <button
                        type="button"
                        className={styles.btnResetAllSearch}
                        onClick={() => handleQuickFilter("All", "All")}
                      >
                        Search All Bangladesh
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===================== LIVE EMERGENCY RADAR TICKER ===================== */}
      <section className={styles.tickerSection}>
        <div className={styles.tickerContainer}>
          <div className={styles.tickerLabel}>
            <span className={styles.liveBlinker} />
            <span>LIVE EMERGENCY FEED</span>
          </div>
          <div className={styles.tickerTrack}>
            {recentRequests.length > 0 ? (
              recentRequests.concat(recentRequests).map((r, idx) => (
                <div key={`${r.id}-${idx}`} className={styles.tickerItem}>
                  <span className={styles.tickerBloodPill}>{r.blood_group}</span>
                  <span className={styles.tickerHospital}>{r.hospital_name || "Emergency Hospital"}</span>
                  <span className={styles.tickerDistrict}>({r.district || "Dhaka"})</span>
                  <span className={`${styles.tickerUrgency} ${r.urgency_level === "Critical" ? styles.urgCritical : styles.urgNormal}`}>
                    {r.urgency_level}
                  </span>
                  <span className={styles.tickerTime}>• {r.status || "Matching"}</span>
                </div>
              ))
            ) : (
              <div className={styles.tickerItem}>
                <span>Connecting live request stream to Supabase database across 64 districts...</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== INTERACTIVE BLOOD COMPATIBILITY MATRIX ===================== */}
      <section className={styles.compatibilitySection} id="compatibility">
        <div className="container">
          <div className={styles.sectionHeadingWrap}>
            <div className={styles.eyebrow}>MEDICAL ACCURACY &amp; TRANSPARENCY</div>
            <h2 className={styles.secTitle}>
              Know Your Match, <span className={styles.crimsonGradient}>Save a Life.</span>
            </h2>
            <p className={styles.secSub}>
              Select any blood type to explore universal compatibility rules, prevalence in Bangladesh, and immediate transfusion matching.
            </p>
          </div>

          <div className={styles.matrixBox}>
            {/* Blood Type Selection Bar */}
            <div className={styles.bloodSelectorRow}>
              {Object.keys(BLOOD_INFO).map((group) => (
                <button
                  key={group}
                  className={`${styles.bloodSelectBtn} ${selectedBlood === group ? styles.selectedBloodBtn : ""}`}
                  onClick={() => setSelectedBlood(group)}
                >
                  <span className={styles.btnBloodText}>{group}</span>
                  <span className={styles.btnRarityDot} />
                </button>
              ))}
            </div>

            {/* Compatibility Insight Card */}
            <div className={styles.matrixInsightCard}>
              <div className={styles.insightHeader}>
                <div className={styles.bigGroupTag}>{selectedBlood}</div>
                <div>
                  <div className={styles.badgePill}>{activeBloodData.badge}</div>
                  <div className={styles.rarityText}>Prevalence: <strong>{activeBloodData.rarity}</strong></div>
                </div>
              </div>

              <div className={styles.matchingColumns}>
                {/* Can Donate To */}
                <div className={styles.matchingCol}>
                  <div className={styles.matchColTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C5162E" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                    <span>Can Safely Donate To:</span>
                  </div>
                  <div className={styles.pillWrap}>
                    {activeBloodData.canGiveTo.map((g) => (
                      <span key={g} className={styles.givePill}>{g}</span>
                    ))}
                  </div>
                </div>

                {/* Can Receive From */}
                <div className={styles.matchingCol}>
                  <div className={styles.matchColTitle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                    <span>Can Safely Receive From:</span>
                  </div>
                  <div className={styles.pillWrap}>
                    {activeBloodData.canReceiveFrom.map((g) => (
                      <span key={g} className={styles.receivePill}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.medicalFootnote}>
                <strong>Clinical Note:</strong> {activeBloodData.note}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ASYMMETRIC BENTO GRID SHOWCASE ===================== */}
      <section className={styles.bentoSection} id="features">
        <div className="container">
          <div className={styles.sectionHeadingWrap}>
            <div className={styles.eyebrow}>BUILT FOR CRITICAL EMERGENCIES</div>
            <h2 className={styles.secTitle}>
              Engineered When <span className={styles.crimsonGradient}>Minutes Mean Everything.</span>
            </h2>
            <p className={styles.secSub}>
              Unlike social media posts that get lost in the feed, our automated pipeline connects the right donor in under 60 seconds.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Bento 1: Proximity Engine (Large 2-Column) */}
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoTag}>5KM RADIUS SCAN</div>
              <h3 className={styles.bentoTitle}>Smart Location Proximity Matching</h3>
              <p className={styles.bentoDesc}>
                Our spatial engine automatically maps verified voluntary donors within a 5-kilometer radius of the hospital, factoring in traffic density and live donor availability status.
              </p>

              {/* Graphic Simulation of Hospital & Nearby Donors */}
              <div className={styles.radarVisualStage}>
                <div className={styles.radarCircle3} />
                <div className={styles.radarCircle2} />
                <div className={styles.radarCircle1} />
                <div className={styles.radarCenterPin}>
                  🏥 <span>DMCH Central ICU</span>
                </div>
                <div className={`${styles.donorDotPin} ${styles.dot1}`}>
                  <span>🩸 Donor (1.2 km • 6m)</span>
                </div>
                <div className={`${styles.donorDotPin} ${styles.dot2}`}>
                  <span>🩸 Donor (2.8 km • 14m)</span>
                </div>
                <div className={`${styles.donorDotPin} ${styles.dot3}`}>
                  <span>🩸 Donor (3.5 km • 19m)</span>
                </div>
              </div>
            </div>

            {/* Bento 2: FCM Notification Engine */}
            <div className={styles.bentoCard}>
              <div className={styles.bentoTag}>FCM BROADCAST</div>
              <h3 className={styles.bentoTitle}>Instant Emergency Broadcast</h3>
              <p className={styles.bentoDesc}>
                High-priority Firebase push notifications bypass silent phone modes for critical surgery emergencies.
              </p>
              <div className={styles.pushMockCard}>
                <div className={styles.pushIcon}>🔔</div>
                <div>
                  <strong>Emergency B+ Alert</strong>
                  <p>ICU request 2.1km from you. Can you donate today?</p>
                </div>
              </div>
            </div>

            {/* Bento 3: 90-Day Health Guardian — span 2 to fill row */}
            <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoTag}>HEALTH SAFETY</div>
              <h3 className={styles.bentoTitle}>90-Day Donor Cooldown</h3>
              <p className={styles.bentoDesc}>
                Automated health guard protects donors with an exact 90-day cooldown countdown, preventing premature donation.
              </p>
              <div className={styles.cooldownBadge}>
                <div className={styles.cooldownNum}>68 Days</div>
                <div className={styles.cooldownLbl}>Until Next Eligible Donation</div>
              </div>
            </div>

            {/* Bento 3b: Verified Donor Badge — fills the 3rd column in row 2 */}
            <div className={styles.bentoCard}>
              <div className={styles.bentoTag}>TRUST & SAFETY</div>
              <h3 className={styles.bentoTitle}>Verified Donor Badges</h3>
              <p className={styles.bentoDesc}>
                Every registered donor is verified and receives a digital trust badge visible to patient families.
              </p>
              <div className={styles.cooldownBadge} style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)", border: "1.5px solid #BBF7D0" }}>
                <div className={styles.cooldownNum} style={{ color: "#16A34A", fontSize: "28px" }}>✓ Verified</div>
                <div className={styles.cooldownLbl}>Active Blood Donor</div>
              </div>
            </div>

            {/* Bento 4: Direct Calling Protection */}
            <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
              <div className={styles.bentoTag}>SECURITY &amp; PRIVACY</div>
              <h3 className={styles.bentoTitle}>Direct Connection Without Middlemen</h3>
              <p className={styles.bentoDesc}>
                Your contact details are never publicly visible on the internet. Only when a donor clicks &quot;Accept&quot; can the patient attendant initiate a secure, verified phone call. No brokers, no spam.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ===================== THE LIFE-SAVING TIMELINE ===================== */}
      <section className={styles.timelineSection} id="how-it-works">
        <div className="container">
          <div className={styles.sectionHeadingWrap}>
            <div className={styles.eyebrow}>SEAMLESS 4-STEP PIPELINE</div>
            <h2 className={styles.secTitle}>From Urgent Need to Successful Transfusion</h2>
            <p className={styles.secSub}>Every second is accounted for with zero bureaucracy.</p>
          </div>

          <div className={styles.timelineGrid}>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumBadge}>01</div>
              <h4 className={styles.stepHeader}>Post Emergency Request</h4>
              <p className={styles.stepBody}>Patient family enters patient blood group, hospital bed, required units, and urgency level in under 30 seconds.</p>
            </div>

            <div className={styles.timelineStep}>
              <div className={styles.stepNumBadge}>02</div>
              <h4 className={styles.stepHeader}>Instant Algorithm Scan</h4>
              <p className={styles.stepBody}>Our database scans verified compatible donors within radius and fires targeted FCM push notifications.</p>
            </div>

            <div className={styles.timelineStep}>
              <div className={styles.stepNumBadge}>03</div>
              <h4 className={styles.stepHeader}>Donor Accepts &amp; Connects</h4>
              <p className={styles.stepBody}>A voluntary donor accepts the call, gets direct hospital location directions, and communicates with the family.</p>
            </div>

            <div className={styles.timelineStep}>
              <div className={styles.stepNumBadge}>04</div>
              <h4 className={styles.stepHeader}>Life Saved &amp; Logged</h4>
              <p className={styles.stepBody}>Hospital completes the donation. Status is marked fulfilled in Supabase and the donor receives a digital certificate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LIVE SUPABASE METRICS SECTION ===================== */}
      <section className={styles.impactSection} id="statistics" ref={statsRef}>
        <div className="container">
          <div className={styles.sectionHeadingWrap}>
            <div className={styles.eyebrow}>REAL-TIME VERIFIED DATABASE IMPACT</div>
            <h2 className={styles.secTitle}>
              Real Numbers, <span className={styles.crimsonGradient}>Real Lives Saved.</span>
            </h2>
            <p className={styles.secSub}>
              Data pulled live from our Supabase PostgreSQL cluster — refreshed automatically every 30 seconds.
            </p>

            <div className={styles.liveClusterBadge}>
              <span className={styles.liveDotGreen} />
              <span>{statsLoading ? "Connecting to Supabase cluster..." : `Cluster Connected · Last synced at ${lastUpdated?.toLocaleTimeString() || ""}`}</span>
              <button className={styles.refreshIconBtn} onClick={fetchStats} title="Refresh Database Records">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              </button>
            </div>
          </div>

          <div className={styles.kpiCardsRow}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiIconWrap}>🩸</span>
                <span className={styles.kpiTag}>VOLUNTARY POOL</span>
              </div>
              <div className={styles.kpiFigure}>{statsLoading ? "..." : donorsCount.toLocaleString()}+</div>
              <div className={styles.kpiLabel}>Registered Blood Donors</div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiIconWrap}>❤️</span>
                <span className={styles.kpiTag}>FULFILLED CASES</span>
              </div>
              <div className={styles.kpiFigure} style={{ color: "#C5162E" }}>
                {statsLoading ? "..." : livesCount.toLocaleString()}+
              </div>
              <div className={styles.kpiLabel}>Lives Saved Across BD</div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiIconWrap}>⚡</span>
                <span className={styles.kpiTag}>TOTAL REQUESTS</span>
              </div>
              <div className={styles.kpiFigure}>{statsLoading ? "..." : requestsCount.toLocaleString()}+</div>
              <div className={styles.kpiLabel}>Emergency Requests Processed</div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiIconWrap}>📍</span>
                <span className={styles.kpiTag}>NATIONWIDE</span>
              </div>
              <div className={styles.kpiFigure}>{statsLoading ? "..." : districtsCount}</div>
              <div className={styles.kpiLabel}>Administrative Districts</div>
            </div>
          </div>

          {/* Blood Group Distribution Grid */}
          <div className={styles.inventoryDistributionCard}>
            <div className={styles.idcHeader}>
              <div>
                <h3 className={styles.idcTitle}>Live Blood Group Inventory Ratio</h3>
                <p className={styles.idcSubtitle}>Proportion of registered active donors by ABO &amp; Rh group</p>
              </div>
              <span className={styles.idcLivePill}>● Live Supabase Stream</span>
            </div>

            <div className={styles.barsGrid}>
              {bloodGroupDist.map((item) => (
                <div key={item.group} className={styles.barItem}>
                  <div className={styles.barTop}>
                    <span className={styles.barGroupBadge}>{item.group}</span>
                    <span className={styles.barCount}>{item.count} donors ({item.pct}%)</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: statsVisible && !statsLoading ? `${Math.max(item.pct, 5)}%` : "0%",
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                        transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DOWNLOAD CTA STAGE ===================== */}
      <section className={styles.downloadCtaSection} id="download">
        <div className="container">
          <div className={styles.ctaStageCard}>
            <div className={styles.ctaCardGrid}>
              <div className={styles.ctaCopyCol}>
                <div className={styles.ctaEyebrow}>JOIN THE HUMANITARIAN MISSION</div>
                <h2 className={styles.ctaHeading}>
                  Be the Reason Someone Goes Home to Their Family.
                </h2>
                <p className={styles.ctaDesc}>
                  Download the BloodBanks app today on Android or iOS. 100% free, voluntary, and community-driven.
                </p>

                {/* App Store Buttons */}
                <div className={styles.storeBadgesRow}>
                  <a
                    href="https://play.google.com/store/apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.appStoreBtn}
                  >
                    <svg className={styles.appStoreSvg} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#4285F4" d="M48.7 18.5c-4.8 5.2-7.7 13-7.7 23v429c0 10 2.9 17.8 7.7 23l2.4 2.4L275 272v-5.8L51.1 16.1l-2.4 2.4z"></path>
                      <path fill="#FFBA00" d="M350.8 347.8l-75.8-75.8V266l75.8-75.8 1.8 1 89.8 51.1c25.7 14.6 25.7 38.5 0 53.1l-89.8 51.1-1.8 1.4z"></path>
                      <path fill="#00E676" d="M275 266.2L51.1 490.1c8.4 8.9 22.3 9.9 37.9 1.1l263.6-149.8-77.6-75.2z"></path>
                      <path fill="#FF3D00" d="M275 266.2l77.6-75.2L89 41.2c-15.6-8.9-29.5-7.8-37.9 1.1L275 266.2z"></path>
                    </svg>
                    <div>
                      <span className={styles.appBtnPre}>GET IT ON</span>
                      <span className={styles.appBtnMain}>Google Play</span>
                    </div>
                  </a>

                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.appStoreBtn}
                  >
                    <svg className={styles.appStoreSvg} viewBox="0 0 384 512" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                    </svg>
                    <div>
                      <span className={styles.appBtnPre}>Download on the</span>
                      <span className={styles.appBtnMain}>App Store</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <Footer />
    </main>
  );
}
