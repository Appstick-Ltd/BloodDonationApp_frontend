"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import styles from "./page.module.css";

const supabase = createClient(
  "https://gdlyandsddfbmjauwgsz.supabase.co",
  "sb_publishable_hl1hxvuxiXQB2BXc70ESbw_F4ToDHFx"
);

const ALL_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const BLOOD_COLORS = {
  "O+": "#F04060",
  "O-": "#8B1A2A",
  "A+": "#C5162E",
  "A-": "#7B0A1A",
  "B+": "#E01A34",
  "B-": "#A01020",
  "AB+": "#FF6B8A",
  "AB-": "#6B0F1A",
};

function formatRequestId(id) {
  if (!id) return "";
  const clean = String(id).replace(/-/g, "").toUpperCase();
  return `#REQ-${clean.slice(0, 8)}`;
}

function parseRequestNotes(notes) {
  if (!notes) return { hasContent: false, conditionText: "", details: {}, others: {} };
  const raw = String(notes).trim();
  if (!raw) return { hasContent: false, conditionText: "", details: {}, others: {} };

  // 1. JSON Format
  if ((raw.startsWith("{") && raw.endsWith("}")) || (raw.startsWith("[") && raw.endsWith("]"))) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        const details = {};
        let conditionText = "";

        if (parsed.schedule_display || parsed.schedule) {
          details.schedule = String(parsed.schedule_display || parsed.schedule).trim();
        }
        if (parsed.contact_person || parsed.contactPerson || parsed.attendant) {
          details.contactPerson = String(parsed.contact_person || parsed.contactPerson || parsed.attendant).trim();
        }
        if (parsed.relationship || parsed.relation) {
          details.relationship = String(parsed.relationship || parsed.relation).trim();
        }
        if (parsed.ward || parsed.ward_no || parsed.wardNo) {
          details.ward = String(parsed.ward || parsed.ward_no || parsed.wardNo).trim();
        }
        if (parsed.bed || parsed.bed_no || parsed.cabin) {
          details.bed = String(parsed.bed || parsed.bed_no || parsed.cabin).trim();
        }

        const noteCandidates = [
          parsed.medical_condition,
          parsed.condition,
          parsed.reason,
          parsed.medical_reason,
          parsed.notes,
          parsed.note,
          parsed.description,
          parsed.details
        ].filter(Boolean);

        if (noteCandidates.length > 0) {
          conditionText = String(noteCandidates[0]).trim();
        }

        const handledKeys = new Set([
          "schedule_display", "schedule", "contact_person", "contactPerson", "attendant",
          "relationship", "relation", "ward", "ward_no", "wardNo", "bed", "bed_no", "cabin",
          "medical_condition", "condition", "reason", "medical_reason", "notes", "note", "description", "details"
        ]);

        const others = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (!handledKeys.has(k) && v !== null && v !== undefined && v !== "") {
            const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            others[label] = String(v);
          }
        }

        return {
          hasContent: true,
          isJson: true,
          conditionText,
          details,
          others,
          raw
        };
      }
    } catch {
      // not valid JSON, proceed to other checks
    }
  }

  // 2. Direct Request: DIRECT_REQ_FOR:<uid>|<reason>
  if (raw.includes("DIRECT_REQ_FOR:")) {
    const parts = raw.split("|");
    const reason = parts.slice(1).join(" | ").trim();
    return {
      hasContent: Boolean(reason),
      isJson: false,
      isDirectReq: true,
      conditionText: reason || "Direct emergency blood request",
      details: {},
      others: {},
      raw
    };
  }

  // 3. TAG:id|reason
  if (/^[A-Z0-9_]+:[a-zA-Z0-9_-]+\|/.test(raw)) {
    const cleaned = raw.replace(/^[A-Z0-9_]+:[a-zA-Z0-9_-]+\|/, "").trim();
    return {
      hasContent: Boolean(cleaned),
      isJson: false,
      conditionText: cleaned,
      details: {},
      others: {},
      raw
    };
  }

  // 4. Plain text
  return {
    hasContent: true,
    isJson: false,
    conditionText: raw,
    details: {},
    others: {},
    raw
  };
}

function cleanNotes(notes) {
  const parsed = parseRequestNotes(notes);
  return parsed.conditionText || "";
}

function formatDynamicSchedule(neededDateTime, staticSchedule) {
  if (!neededDateTime) return staticSchedule || "";

  const target = new Date(neededDateTime);
  if (isNaN(target.getTime())) return staticSchedule || "";

  const now = new Date();

  // Normalize to local midnight for accurate calendar day difference
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayDiff = Math.round((targetMidnight - todayMidnight) / oneDay);

  const timeStr = target.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  const isBengali = staticSchedule && /[\u0980-\u09FF]/.test(staticSchedule);

  if (dayDiff === 0) {
    return isBengali ? `আজ by ${timeStr}` : `Today by ${timeStr}`;
  } else if (dayDiff === 1) {
    return isBengali ? `আগামীকাল by ${timeStr}` : `Tomorrow by ${timeStr}`;
  } else if (dayDiff === -1) {
    return isBengali ? `গতকাল by ${timeStr}` : `Yesterday by ${timeStr}`;
  } else if (dayDiff > 1) {
    return isBengali ? `${dayDiff} দিন পর by ${timeStr}` : `In ${dayDiff} days by ${timeStr}`;
  } else {
    const pastDays = Math.abs(dayDiff);
    return isBengali ? `${pastDays} দিন আগে by ${timeStr}` : `${pastDays} days ago by ${timeStr}`;
  }
}

// -------------------------------------------------------------
// Interactive SVG Donut Chart Component
// -------------------------------------------------------------
function BloodDonutChart({ counts, total }) {
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const radius = 68;
  const cx = 95;
  const cy = 95;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const slices = useMemo(() => {
    let offset = 0;
    return ALL_BLOOD_GROUPS.map((group) => {
      const count = counts[group] || 0;
      const pct = total > 0 ? (count / total) : 0;
      const length = pct * circumference;
      const currentOffset = offset;
      offset += length;
      return {
        group,
        count,
        pct: Math.round(pct * 100),
        length,
        offset: currentOffset,
        color: BLOOD_COLORS[group] || "#C5162E"
      };
    });
  }, [counts, total, circumference]);

  const activeData = hoveredGroup
    ? slices.find((s) => s.group === hoveredGroup)
    : null;

  return (
    <div className={styles.donutChartWrapper}>
      <div className={styles.donutSvgContainer}>
        <svg width="190" height="190" viewBox="0 0 190 190">
          {/* Background Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth="24"
          />

          {/* Slices */}
          {slices.map((slice) => {
            if (slice.count === 0) return null;
            const isHovered = hoveredGroup === slice.group;
            return (
              <circle
                key={slice.group}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? 28 : 24}
                strokeDasharray={`${slice.length} ${circumference - slice.length}`}
                strokeDashoffset={-slice.offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                onMouseEnter={() => setHoveredGroup(slice.group)}
                onMouseLeave={() => setHoveredGroup(null)}
                style={{
                  cursor: "pointer",
                  transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                  opacity: hoveredGroup && !isHovered ? 0.45 : 1
                }}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className={styles.donutCenterText}>
          <span className={styles.donutCenterVal}>
            {activeData ? activeData.count : total}
          </span>
          <span className={styles.donutCenterLbl}>
            {activeData ? `${activeData.group} (${activeData.pct}%)` : "Total Donors"}
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className={styles.donutLegendGrid}>
        {slices.map((slice) => (
          <div
            key={slice.group}
            className={`${styles.legendItem} ${hoveredGroup === slice.group ? styles.legendHovered : ""}`}
            onMouseEnter={() => setHoveredGroup(slice.group)}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <span className={styles.legendColorDot} style={{ background: slice.color }} />
            <span className={styles.legendGroup}>{slice.group}</span>
            <span className={styles.legendCount}>{slice.count}</span>
            <span className={styles.legendPct}>({slice.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Interactive SVG Spline & Modern Bar Chart Component
// -------------------------------------------------------------
function createSmoothSpline(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  if (points.length === 2) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)},${points[1].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  const tension = 0.22;

  for (let i = 0; i < points.length - 1; i++) {
    const pPrev = points[i === 0 ? 0 : i - 1];
    const pCurr = points[i];
    const pNext = points[i + 1];
    const pNextNext = points[i + 2 >= points.length ? points.length - 1 : i + 2];

    const cp1x = pCurr.x + (pNext.x - pPrev.x) * tension;
    const cp1y = pCurr.y + (pNext.y - pPrev.y) * tension;

    const cp2x = pNext.x - (pNextNext.x - pCurr.x) * tension;
    const cp2y = pNext.y - (pNextNext.y - pCurr.y) * tension;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pNext.x.toFixed(1)},${pNext.y.toFixed(1)}`;
  }
  return d;
}

function createAreaPath(points, bottomY) {
  if (!points || points.length === 0) return "";
  const spline = createSmoothSpline(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${spline} L ${last.x.toFixed(1)},${bottomY.toFixed(1)} L ${first.x.toFixed(1)},${bottomY.toFixed(1)} Z`;
}

function ActivityTrendChart({ requests }) {
  const [timeRange, setTimeRange] = useState("7d");
  const [chartMode, setChartMode] = useState("wave"); // "wave" | "bars" | "combined"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate trend based on selected period
  const chartData = useMemo(() => {
    const countDays = timeRange === "30d" ? 30 : timeRange === "14d" ? 14 : 7;
    const days = [];
    const today = new Date();

    for (let i = countDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const reqCount = requests.filter((r) => {
        if (!r.created_at) return false;
        const rd = new Date(r.created_at);
        return rd.toDateString() === d.toDateString();
      }).length;

      const fulfilledCount = requests.filter((r) => {
        if (!r.created_at || (r.status !== "Fulfilled" && r.status !== "Completed")) return false;
        const rd = new Date(r.created_at);
        return rd.toDateString() === d.toDateString();
      }).length;

      days.push({
        label: countDays > 14 ? (i % 4 === 0 ? dayName : "") : dayName,
        fullDay: dayName,
        date: dateStr,
        requests: reqCount,
        fulfilled: fulfilledCount,
      });
    }
    return days;
  }, [requests, timeRange]);

  // Totals for the selected period
  const totalReqsInPeriod = useMemo(
    () => chartData.reduce((acc, d) => acc + d.requests, 0),
    [chartData]
  );
  const totalFulInPeriod = useMemo(
    () => chartData.reduce((acc, d) => acc + d.fulfilled, 0),
    [chartData]
  );
  const fulfillmentRate =
    totalReqsInPeriod > 0
      ? Math.round((totalFulInPeriod / totalReqsInPeriod) * 100)
      : 100;

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.requests, d.fulfilled)),
    4
  );

  const width = 720;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  const bottomY = paddingTop + chartH;

  const getX = (idx) => paddingLeft + (idx / Math.max(chartData.length - 1, 1)) * chartW;
  const getY = (val) => paddingTop + chartH - (val / maxVal) * chartH;

  // Compute point arrays for smooth spline
  const reqPoints = useMemo(
    () => chartData.map((d, i) => ({ x: getX(i), y: getY(d.requests) })),
    [chartData, maxVal, chartW, chartH]
  );

  const fulPoints = useMemo(
    () => chartData.map((d, i) => ({ x: getX(i), y: getY(d.fulfilled) })),
    [chartData, maxVal, chartW, chartH]
  );

  const reqSpline = useMemo(() => createSmoothSpline(reqPoints), [reqPoints]);
  const reqArea = useMemo(() => createAreaPath(reqPoints, bottomY), [reqPoints, bottomY]);

  const fulSpline = useMemo(() => createSmoothSpline(fulPoints), [fulPoints]);
  const fulArea = useMemo(() => createAreaPath(fulPoints, bottomY), [fulPoints, bottomY]);

  const activeDay = hoveredIndex !== null ? chartData[hoveredIndex] : null;
  const barWidth = Math.max(Math.min((chartW / chartData.length) * 0.28, 14), 6);
  const columnWidth = chartW / chartData.length;

  return (
    <div className={styles.trendChartBox}>
      {/* Header with Title and Mode Switchers */}
      <div className={styles.trendHeader}>
        <div className={styles.trendTitleGroup}>
          <div className={styles.trendIconBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div>
            <h3 className={styles.chartTitle}>Emergency Demand &amp; Transfusions</h3>
            <p className={styles.chartSub}>Real-time patient request volume vs. fulfilled donations</p>
          </div>
        </div>

        <div className={styles.trendFilters}>
          {/* Mode Switcher */}
          <div className={styles.modeToggleGroup}>
            <button
              className={`${styles.modeBtn} ${chartMode === "wave" ? styles.modeBtnActive : ""}`}
              onClick={() => setChartMode("wave")}
              title="Smooth Bezier Wave Area"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12c4-8 8 8 12 0s6-4 8-2" />
              </svg>
              Wave
            </button>
            <button
              className={`${styles.modeBtn} ${chartMode === "bars" ? styles.modeBtnActive : ""}`}
              onClick={() => setChartMode("bars")}
              title="Modern Capsule Bars"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="10" width="4" height="10" rx="1" />
                <rect x="10" y="5" width="4" height="15" rx="1" />
                <rect x="17" y="2" width="4" height="18" rx="1" />
              </svg>
              Bars
            </button>
            <button
              className={`${styles.modeBtn} ${chartMode === "combined" ? styles.modeBtnActive : ""}`}
              onClick={() => setChartMode("combined")}
              title="Combined Bars & Wave"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-5 4 3 5-8" />
              </svg>
              Combined
            </button>
          </div>

          {/* Time Range Pills */}
          <div className={styles.timePillGroup}>
            <button
              className={`${styles.timeBtn} ${timeRange === "7d" ? styles.timeBtnActive : ""}`}
              onClick={() => setTimeRange("7d")}
            >
              7D
            </button>
            <button
              className={`${styles.timeBtn} ${timeRange === "14d" ? styles.timeBtnActive : ""}`}
              onClick={() => setTimeRange("14d")}
            >
              14D
            </button>
            <button
              className={`${styles.timeBtn} ${timeRange === "30d" ? styles.timeBtnActive : ""}`}
              onClick={() => setTimeRange("30d")}
            >
              30D
            </button>
          </div>
        </div>
      </div>

      {/* Modern KPI Summary Micro-Bar */}
      <div className={styles.chartKpiBar}>
        <div className={styles.chartKpiItem}>
          <span className={styles.kpiDotRed} />
          <span>Period Requests: <strong>{totalReqsInPeriod}</strong></span>
        </div>
        <div className={styles.chartKpiDivider} />
        <div className={styles.chartKpiItem}>
          <span className={styles.kpiDotGreen} />
          <span>Fulfilled: <strong>{totalFulInPeriod}</strong></span>
        </div>
        <div className={styles.chartKpiDivider} />
        <div className={styles.chartKpiItem}>
          <span>Fulfillment Rate: <strong>{fulfillmentRate}%</strong></span>
        </div>
        <span className={styles.kpiRateBadge}>
          {totalReqsInPeriod > 0 ? "⚡ Live Supabase Data" : "● Stable Standby"}
        </span>
      </div>

      {/* SVG Canvas */}
      <div className={styles.svgContainer}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={styles.trendSvg}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Soft Radiant Gradient for Requests */}
            <linearGradient id="reqAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#FB7185" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0.0" />
            </linearGradient>

            {/* Soft Emerald Gradient for Fulfilled */}
            <linearGradient id="fulAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
              <stop offset="65%" stopColor="#34D399" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.0" />
            </linearGradient>

            {/* Pillar Bar Gradients */}
            <linearGradient id="barReqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>

            <linearGradient id="barFulGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Line Glow Filters */}
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#E11D48" floodOpacity="0.3" />
            </filter>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10B981" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Clean Horizontal Gridlines */}
          {[0, 0.33, 0.66, 1].map((pct, idx) => {
            const y = paddingTop + chartH * pct;
            const val = Math.round(maxVal * (1 - pct));
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1.2"
                  strokeDasharray={pct === 1 ? "none" : "5 5"}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94A3B8"
                  fontWeight="600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Frosted Hover Column Highlights */}
          {chartData.map((d, i) => {
            const cx = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <rect
                key={`hover-bg-${i}`}
                x={cx - columnWidth / 2}
                y={paddingTop}
                width={columnWidth}
                height={chartH}
                fill={isHovered ? "rgba(241, 245, 249, 0.85)" : "transparent"}
                rx="6"
                style={{ transition: "fill 0.15s ease" }}
              />
            );
          })}

          {/* CAPSULE BARS (if "bars" or "combined") */}
          {(chartMode === "bars" || chartMode === "combined") &&
            chartData.map((d, i) => {
              const cx = getX(i);
              const reqH = Math.max(bottomY - getY(d.requests), 0);
              const fulH = Math.max(bottomY - getY(d.fulfilled), 0);
              const isCombined = chartMode === "combined";
              const opacity = isCombined ? 0.45 : 1;

              return (
                <g key={`bars-${i}`} opacity={opacity}>
                  {/* Background Pillar Capsule */}
                  <rect
                    x={cx - barWidth - 2}
                    y={paddingTop + 6}
                    width={barWidth * 2 + 4}
                    height={chartH - 6}
                    rx="5"
                    fill="#F8FAFC"
                  />

                  {/* Requests Bar */}
                  {d.requests > 0 && (
                    <rect
                      x={cx - barWidth - 1}
                      y={getY(d.requests)}
                      width={barWidth}
                      height={reqH}
                      rx="3.5"
                      fill="url(#barReqGrad)"
                    />
                  )}

                  {/* Fulfilled Bar */}
                  {d.fulfilled > 0 && (
                    <rect
                      x={cx + 1}
                      y={getY(d.fulfilled)}
                      width={barWidth}
                      height={fulH}
                      rx="3.5"
                      fill="url(#barFulGrad)"
                    />
                  )}
                </g>
              );
            })}

          {/* SMOOTH BEZIER SPLINE (if "wave" or "combined") */}
          {(chartMode === "wave" || chartMode === "combined") && (
            <>
              {/* Soft Radiant Area Fills */}
              <path d={reqArea} fill="url(#reqAreaGrad)" />
              <path d={fulArea} fill="url(#fulAreaGrad)" />

              {/* Silky Spline Stroke Waves */}
              <path
                d={reqSpline}
                fill="none"
                stroke="#E11D48"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowRed)"
              />
              <path
                d={fulSpline}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowGreen)"
              />
            </>
          )}

          {/* Interactive Data Nodes & Hover Guide */}
          {chartData.map((d, i) => {
            const cx = getX(i);
            const cyReq = getY(d.requests);
            const cyFul = getY(d.fulfilled);
            const isHovered = hoveredIndex === i;

            return (
              <g key={`nodes-${i}`}>
                {/* Vertical cursor guide line on hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={bottomY}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Requests Node */}
                {(isHovered || (d.requests > 0 && chartMode !== "bars")) && (
                  <g>
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cyReq}
                        r="10"
                        fill="#E11D48"
                        opacity="0.2"
                        className={styles.pulseRing}
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cyReq}
                      r={isHovered ? 5.5 : 3.5}
                      fill="#FFFFFF"
                      stroke="#E11D48"
                      strokeWidth={isHovered ? "3" : "2"}
                    />
                  </g>
                )}

                {/* Fulfilled Node */}
                {(isHovered || (d.fulfilled > 0 && chartMode !== "bars")) && (
                  <g>
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cyFul}
                        r="9"
                        fill="#10B981"
                        opacity="0.2"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cyFul}
                      r={isHovered ? 4.5 : 3}
                      fill="#FFFFFF"
                      stroke="#10B981"
                      strokeWidth={isHovered ? "2.5" : "1.8"}
                    />
                  </g>
                )}

                {/* X-Axis Date / Day Label */}
                {d.label && (
                  <text
                    x={cx}
                    y={height - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isHovered ? "#0F172A" : "#64748B"}
                    fontWeight={isHovered ? "700" : "500"}
                  >
                    {d.label}
                  </text>
                )}

                {/* Full-column transparent hitbox for effortless mouse tracking */}
                <rect
                  x={cx - columnWidth / 2}
                  y={paddingTop}
                  width={columnWidth}
                  height={chartH + 30}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Glassmorphic Tooltip */}
        {activeDay !== null && hoveredIndex !== null && (
          <div
            className={styles.chartTooltip}
            style={{
              left: `${Math.min(
                Math.max((getX(hoveredIndex) / width) * 100, 16),
                84
              )}%`,
            }}
          >
            <div className={styles.tooltipDate}>
              <span>{activeDay.fullDay}, {activeDay.date}</span>
              <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                Day {hoveredIndex + 1}
              </span>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className={styles.kpiDotRed} /> Emergency Requests:
              </span>
              <strong>{activeDay.requests}</strong>
            </div>
            <div className={styles.tooltipRow}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className={styles.kpiDotGreen} /> Donors Fulfilled:
              </span>
              <strong style={{ color: "#34D399" }}>{activeDay.fulfilled}</strong>
            </div>
            <div className={styles.tooltipTag}>
              {activeDay.requests > 0
                ? activeDay.fulfilled >= activeDay.requests
                  ? "✓ 100% Demand Met"
                  : `⏳ ${activeDay.requests - activeDay.fulfilled} Pending Transfusions`
                : "Standby Day (No emergencies)"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Top Districts Ranking Component
// -------------------------------------------------------------
function DistrictRankWidget({ donors, requests }) {
  const districtStats = useMemo(() => {
    const map = {};
    donors.forEach((d) => {
      const dist = d.district?.trim() || "Unspecified";
      if (!map[dist]) map[dist] = { name: dist, donors: 0, requests: 0 };
      map[dist].donors++;
    });

    requests.forEach((r) => {
      const dist = r.district?.trim() || "Unspecified";
      if (!map[dist]) map[dist] = { name: dist, donors: 0, requests: 0 };
      map[dist].requests++;
    });

    return Object.values(map)
      .sort((a, b) => (b.donors + b.requests) - (a.donors + a.requests))
      .slice(0, 5);
  }, [donors, requests]);

  const maxDistrictCount = Math.max(
    ...districtStats.map((d) => Math.max(d.donors, d.requests)),
    6
  );

  return (
    <div className={styles.districtWidgetCard}>
      <div className={styles.widgetHeader}>
        <div>
          <h3 className={styles.chartTitle}>District Demand &amp; Donors</h3>
          <p className={styles.chartSub}>Regional supply vs urgent requests</p>
        </div>
        <span className={styles.topBadge}>Top 5 Districts</span>
      </div>

      <div className={styles.districtList}>
        {districtStats.map((item) => {
          const donorPct = Math.round((item.donors / maxDistrictCount) * 100);
          const reqPct = Math.round((item.requests / maxDistrictCount) * 100);

          return (
            <div key={item.name} className={styles.districtRow}>
              <div className={styles.distMeta}>
                <span className={styles.distName}>{item.name}</span>
                <span className={styles.distCounts}>
                  <strong style={{ color: "#C5162E" }}>{item.donors}</strong> Donors • <strong style={{ color: "#2563EB" }}>{item.requests}</strong> Requests
                </span>
              </div>
              <div className={styles.dualBarTrack}>
                <div
                  className={styles.barDonors}
                  style={{ width: `${Math.max(donorPct, 6)}%` }}
                  title={`${item.donors} Donors`}
                />
                <div
                  className={styles.barReqs}
                  style={{ width: `${Math.max(reqPct, 4)}%` }}
                  title={`${item.requests} Requests`}
                />
              </div>
            </div>
          );
        })}

        {districtStats.length === 0 && (
          <div className={styles.emptyCell}>No district data registered yet.</div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN ADMIN DASHBOARD
// -------------------------------------------------------------
export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  useEffect(() => {
    try {
      const isAuth =
        sessionStorage.getItem("admin_auth") === "true" ||
        localStorage.getItem("admin_auth") === "true";
      if (!isAuth) {
        router.replace("/mc-portal/auth");
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      router.replace("/mc-portal/auth");
    }
  }, [router]);

  // Data states
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch all admin data
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);

      const [profilesRes, requestsRes, responsesRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, phone, email, blood_group, district, area, is_available, is_eligible, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("emergency_requests")
          .select("id, patient_name, hospital_name, blood_group, units_required, urgency_level, district, area, needed_date_time, status, contact_number, notes, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("request_responses")
          .select("id, request_id, donor_firebase_uid, response_type, status, created_at")
          .order("created_at", { ascending: false })
      ]);

      if (profilesRes.data) setDonors(profilesRes.data);
      if (requestsRes.data) setRequests(requestsRes.data);
      if (responsesRes.data) setResponses(responsesRes.data);

      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 45000); // 45s polling
    return () => clearInterval(interval);
  }, [fetchData, isAuthenticated]);

  // Derived metrics
  const metrics = useMemo(() => {
    const totalDonors = donors.length;
    const availableDonors = donors.filter((d) => d.is_available).length;
    const totalRequests = requests.length;
    const activeRequests = requests.filter((r) => ["Matching", "Responded", "Connected"].includes(r.status)).length;
    const criticalRequests = requests.filter((r) => r.urgency_level === "Critical" && r.status !== "Fulfilled" && r.status !== "Cancelled").length;
    const fulfilledRequests = requests.filter((r) => r.status === "Fulfilled").length;

    // Blood distribution
    const counts = {};
    ALL_BLOOD_GROUPS.forEach((g) => { counts[g] = 0; });
    donors.forEach((d) => {
      const bg = d.blood_group?.trim().toUpperCase();
      if (counts[bg] !== undefined) counts[bg]++;
    });

    return {
      totalDonors,
      availableDonors,
      totalRequests,
      activeRequests,
      criticalRequests,
      fulfilledRequests,
      counts
    };
  }, [donors, requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesBlood = filterBloodGroup === "ALL" || req.blood_group?.toUpperCase() === filterBloodGroup;
      const matchesStatus = filterStatus === "ALL" || req.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        req.patient_name?.toLowerCase().includes(q) ||
        req.hospital_name?.toLowerCase().includes(q) ||
        req.district?.toLowerCase().includes(q) ||
        req.contact_number?.toLowerCase().includes(q);

      return matchesBlood && matchesStatus && matchesSearch;
    });
  }, [requests, filterBloodGroup, filterStatus, searchQuery]);

  // Filtered donors
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchesBlood = filterBloodGroup === "ALL" || d.blood_group?.toUpperCase() === filterBloodGroup;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        d.full_name?.toLowerCase().includes(q) ||
        d.district?.toLowerCase().includes(q) ||
        d.area?.toLowerCase().includes(q) ||
        d.phone?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q);

      return matchesBlood && matchesSearch;
    });
  }, [donors, filterBloodGroup, searchQuery]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_email");
      localStorage.removeItem("admin_user");
    } catch (err) {
      console.error("Logout error:", err);
    }
    router.replace("/mc-portal/auth");
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060B16",
        color: "#94A3B8",
        fontSize: "14px",
        fontWeight: "500",
        gap: "12px"
      }}>
        <span>Authenticating Super Admin...</span>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.logoIcon}>
            <Image
              src="/appIcon.png"
              alt="Blood Banks Logo"
              width={26}
              height={26}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <div className={styles.logoTitle}>Blood<span>Banks</span></div>
            <div className={styles.logoSubtitle}>Admin Console</div>
          </div>
        </div>

        <div className={styles.navCategory}>MAIN MENU</div>
        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            onClick={() => { setActiveTab("overview"); setFilterBloodGroup("ALL"); setFilterStatus("ALL"); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Overview &amp; Analytics</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === "requests" ? styles.active : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>Emergency Requests</span>
            {metrics.activeRequests > 0 && (
              <span className={styles.badgeCount}>{metrics.activeRequests}</span>
            )}
          </button>

          <button
            className={`${styles.navItem} ${activeTab === "donors" ? styles.active : ""}`}
            onClick={() => setActiveTab("donors")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Donors Directory</span>
            <span className={styles.badgeNeutral}>{metrics.totalDonors}</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === "inventory" ? styles.active : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
            <span>Blood Inventory</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.footerLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Public Website</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Navbar */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageHeading}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "requests" && "Emergency Blood Requests"}
              {activeTab === "donors" && "Registered Donors Directory"}
              {activeTab === "inventory" && "Blood Group & Donor Stock"}
            </h1>
            <p className={styles.pageSub}>
              {lastRefreshed ? `Last updated at ${lastRefreshed.toLocaleTimeString()}` : "Fetching live records from Supabase..."}
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.statusIndicator}>
              <span className={styles.liveDot} />
              <span>Supabase Connected</span>
            </div>

            <button
              onClick={fetchData}
              disabled={refreshing}
              className={`${styles.refreshBtn} ${refreshing ? styles.spinning : ""}`}
              title="Refresh Data"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>

            <div className={styles.adminUser}>
              <div className={styles.avatar}>A</div>
              <div className={styles.adminMeta}>
                <span className={styles.adminName}>Admin User</span>
                <span className={styles.adminRole}>Superadmin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className={styles.contentScroll}>
          {/* Quick Metrics Bar */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Total Donors</span>
                <span className={styles.metricIconWrap} style={{ background: "#FFE8EC", color: "#C5162E" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </span>
              </div>
              <div className={styles.metricVal}>{loading ? "..." : metrics.totalDonors}</div>
              <div className={styles.metricSub}>
                <span className={styles.highlightGreen}>{metrics.availableDonors} Available</span> now
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Active Requests</span>
                <span className={styles.metricIconWrap} style={{ background: "#FFF3E0", color: "#E65100" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
              </div>
              <div className={styles.metricVal}>{loading ? "..." : metrics.activeRequests}</div>
              <div className={styles.metricSub}>
                Total received: <strong>{metrics.totalRequests}</strong>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Critical Emergencies</span>
                <span className={styles.metricIconWrap} style={{ background: "#FFEBEE", color: "#D32F2F" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </span>
              </div>
              <div className={styles.metricVal} style={{ color: "#D32F2F" }}>{loading ? "..." : metrics.criticalRequests}</div>
              <div className={styles.metricSub}>Immediate attention needed</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>Lives Fulfilled</span>
                <span className={styles.metricIconWrap} style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </span>
              </div>
              <div className={styles.metricVal} style={{ color: "#2E7D32" }}>{loading ? "..." : metrics.fulfilledRequests}</div>
              <div className={styles.metricSub}>Successful donations</div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className={styles.overviewGrid}>
              {/* ROW 1 OF GRAPHS: 2-COLUMN (Activity Trend 60% + Blood Donut 40%) */}
              <div className={styles.chartsSplitRow}>
                {/* Graph 1: Requests & Fulfillment Trend Area Chart */}
                <div className={styles.chartColLarge}>
                  <ActivityTrendChart requests={requests} />
                </div>

                {/* Graph 2: Interactive Blood Group Donut Chart */}
                <div className={styles.chartColSmall}>
                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <div>
                        <h3 className={styles.chartTitle}>Blood Group Ratio</h3>
                        <p className={styles.chartSub}>Donors breakdown by group</p>
                      </div>
                      <span className={styles.liveStreamBadge}>● Live</span>
                    </div>
                    <BloodDonutChart counts={metrics.counts} total={metrics.totalDonors} />
                  </div>
                </div>
              </div>

              {/* ROW 2: District Ranking Chart + Blood Quick Inventory */}
              <div className={styles.chartsSplitRow}>
                <div className={styles.chartColSmall}>
                  <DistrictRankWidget donors={donors} requests={requests} />
                </div>

                <div className={styles.chartColLarge}>
                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <div>
                        <h3 className={styles.chartTitle}>Blood Stock Availability Bar</h3>
                        <p className={styles.chartSub}>Current registered donor volume</p>
                      </div>
                      <button className={styles.linkBtn} onClick={() => setActiveTab("inventory")}>
                        Full Inventory →
                      </button>
                    </div>

                    <div className={styles.bloodMiniGrid}>
                      {ALL_BLOOD_GROUPS.map((bg) => {
                        const count = metrics.counts[bg] || 0;
                        const pct = metrics.totalDonors > 0 ? Math.round((count / metrics.totalDonors) * 100) : 0;
                        return (
                          <div key={bg} className={styles.bloodMiniCard}>
                            <div className={styles.bgBadge}>{bg}</div>
                            <div className={styles.bgCount}>{count}</div>
                            <div className={styles.bgSub}>{pct}% donors</div>
                            <div className={styles.bgProgressBar}>
                              <div className={styles.bgProgressFill} style={{ width: `${Math.max(pct, 5)}%`, background: BLOOD_COLORS[bg] }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Emergency Requests Table */}
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h3 className={styles.chartTitle}>Recent Emergency Requests</h3>
                    <p className={styles.chartSub}>Latest requests logged across hospitals</p>
                  </div>
                  <button className={styles.linkBtn} onClick={() => setActiveTab("requests")}>
                    View All ({requests.length}) →
                  </button>
                </div>

                <div className={styles.tableResponsive}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Case ID</th>
                        <th>Patient</th>
                        <th>Hospital &amp; Location</th>
                        <th>Group</th>
                        <th>Urgency</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.slice(0, 5).map((req) => (
                        <tr key={req.id} onClick={() => setSelectedRequest(req)} className={styles.clickableRow}>
                          <td>
                            <span className={styles.reqTableId}>{formatRequestId(req.id)}</span>
                          </td>
                          <td>
                            <strong>{req.patient_name || "Emergency Patient"}</strong>
                          </td>
                          <td>
                            <div className={styles.hospitalText}>{req.hospital_name || "Hospital"}</div>
                            <div className={styles.subLocation}>{req.district}{req.area ? `, ${req.area}` : ""}</div>
                          </td>
                          <td>
                            <span className={styles.bloodPill}>{req.blood_group}</span>
                          </td>
                          <td>
                            <span className={`${styles.badge} ${req.urgency_level === "Critical" ? styles.badgeCritical : req.urgency_level === "Urgent" ? styles.badgeUrgent : styles.badgeStandard}`}>
                              {req.urgency_level}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.statusDotText} ${req.status === "Fulfilled" ? styles.statusGreen : req.status === "Matching" ? styles.statusOrange : styles.statusBlue}`}>
                              ● {req.status}
                            </span>
                          </td>
                          <td className={styles.dateCell}>
                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && !loading && (
                        <tr><td colSpan="7" className={styles.emptyCell}>No emergency requests logged yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROW 3: Recent Donors + Quick Actions */}
              <div className={styles.chartsSplitRow}>
                {/* Recent Donors Panel */}
                <div className={styles.chartColLarge}>
                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <div>
                        <h3 className={styles.chartTitle}>Recent Donors</h3>
                        <p className={styles.chartSub}>Latest registered voluntary donors</p>
                      </div>
                      <button className={styles.linkBtn} onClick={() => setActiveTab("donors")}>
                        View All ({donors.length}) →
                      </button>
                    </div>
                    <div className={styles.recentDonorsList}>
                      {donors.slice(0, 5).map((donor) => {
                        const initials = (donor.full_name || "D").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
                        return (
                          <div key={donor.id} className={styles.recentDonorRow}>
                            <div className={styles.recentDonorAvatar}>{initials}</div>
                            <div className={styles.recentDonorInfo}>
                              <div className={styles.recentDonorName}>{donor.full_name || "Anonymous Donor"}</div>
                              <div className={styles.recentDonorMeta}>
                                📍 {donor.district || "—"}{donor.area ? `, ${donor.area}` : ""}
                              </div>
                            </div>
                            <div className={styles.recentDonorRight}>
                              <span className={styles.bloodPill} style={{ background: BLOOD_COLORS[donor.blood_group] || "#C5162E" }}>
                                {donor.blood_group || "?"}
                              </span>
                              <span className={donor.is_available ? styles.statusGreen : styles.statusOrange} style={{ fontSize: "11px", fontWeight: 600 }}>
                                {donor.is_available ? "● Ready" : "● Cooldown"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {donors.length === 0 && !loading && (
                        <div className={styles.emptyCell}>No donors registered yet.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className={styles.chartColSmall}>
                  <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <div>
                        <h3 className={styles.chartTitle}>Quick Actions</h3>
                        <p className={styles.chartSub}>Common admin shortcuts</p>
                      </div>
                    </div>
                    <div className={styles.quickActionsGrid}>
                      <button className={styles.quickActionBtn} onClick={() => setActiveTab("requests")}>
                        <span className={styles.quickActionIcon} style={{ background: "#FFEBEE", color: "#C5162E" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </span>
                        <span className={styles.quickActionLabel}>Manage Requests</span>
                        {metrics.activeRequests > 0 && (
                          <span className={styles.quickActionBadge}>{metrics.activeRequests}</span>
                        )}
                      </button>

                      <button className={styles.quickActionBtn} onClick={() => setActiveTab("donors")}>
                        <span className={styles.quickActionIcon} style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </span>
                        <span className={styles.quickActionLabel}>Donor Directory</span>
                      </button>

                      <button className={styles.quickActionBtn} onClick={() => setActiveTab("inventory")}>
                        <span className={styles.quickActionIcon} style={{ background: "#E3F2FD", color: "#1565C0" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                          </svg>
                        </span>
                        <span className={styles.quickActionLabel}>Blood Inventory</span>
                      </button>

                      <button className={styles.quickActionBtn} onClick={fetchData}>
                        <span className={styles.quickActionIcon} style={{ background: "#F3E5F5", color: "#6A1B9A" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                          </svg>
                        </span>
                        <span className={styles.quickActionLabel}>Refresh Data</span>
                      </button>

                      <div className={styles.quickStatRow}>
                        <div className={styles.quickStat}>
                          <span className={styles.quickStatVal} style={{ color: "#C5162E" }}>{metrics.availableDonors}</span>
                          <span className={styles.quickStatLbl}>Ready Donors</span>
                        </div>
                        <div className={styles.quickStatDivider} />
                        <div className={styles.quickStat}>
                          <span className={styles.quickStatVal} style={{ color: "#E65100" }}>{metrics.criticalRequests}</span>
                          <span className={styles.quickStatLbl}>Critical Cases</span>
                        </div>
                        <div className={styles.quickStatDivider} />
                        <div className={styles.quickStat}>
                          <span className={styles.quickStatVal} style={{ color: "#2E7D32" }}>{metrics.fulfilledRequests}</span>
                          <span className={styles.quickStatLbl}>Fulfilled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* TAB 2: EMERGENCY REQUESTS */}
          {activeTab === "requests" && (
            <div className={styles.panelCard}>
              <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by patient, hospital, district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && <button onClick={() => setSearchQuery("")}>✕</button>}
                </div>

                <div className={styles.filterGroup}>
                  <label>Blood Group:</label>
                  <select value={filterBloodGroup} onChange={(e) => setFilterBloodGroup(e.target.value)}>
                    <option value="ALL">All Groups</option>
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Status:</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="ALL">All Statuses</option>
                    <option value="Matching">Matching</option>
                    <option value="Responded">Responded</option>
                    <option value="Connected">Connected</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className={styles.recordCount}>
                  Showing <strong>{filteredRequests.length}</strong> of {requests.length} requests
                </div>
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Patient Name</th>
                      <th>Hospital</th>
                      <th>Group</th>
                      <th>Units</th>
                      <th>Urgency</th>
                      <th>District / Area</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id} onClick={() => setSelectedRequest(req)} className={styles.clickableRow}>
                        <td><span className={styles.reqTableId}>{formatRequestId(req.id)}</span></td>
                        <td><strong>{req.patient_name}</strong></td>
                        <td>{req.hospital_name}</td>
                        <td><span className={styles.bloodPill}>{req.blood_group}</span></td>
                        <td>{req.units_required || 1} Bag(s)</td>
                        <td>
                          <span className={`${styles.badge} ${req.urgency_level === "Critical" ? styles.badgeCritical : req.urgency_level === "Urgent" ? styles.badgeUrgent : styles.badgeStandard}`}>
                            {req.urgency_level}
                          </span>
                        </td>
                        <td>{req.district} {req.area ? `(${req.area})` : ""}</td>
                        <td><a href={`tel:${req.contact_number}`} className={styles.phoneLink} onClick={(e) => e.stopPropagation()}>{req.contact_number}</a></td>
                        <td>
                          <span className={`${styles.statusDotText} ${req.status === "Fulfilled" ? styles.statusGreen : req.status === "Matching" ? styles.statusOrange : styles.statusBlue}`}>
                            ● {req.status}
                          </span>
                        </td>
                        <td className={styles.dateCell}>
                          {req.created_at ? new Date(req.created_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && !loading && (
                      <tr><td colSpan="10" className={styles.emptyCell}>No matching blood requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DONORS DIRECTORY */}
          {activeTab === "donors" && (
            <div className={styles.panelCard}>
              <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by donor name, phone, district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && <button onClick={() => setSearchQuery("")}>✕</button>}
                </div>

                <div className={styles.filterGroup}>
                  <label>Blood Group:</label>
                  <select value={filterBloodGroup} onChange={(e) => setFilterBloodGroup(e.target.value)}>
                    <option value="ALL">All Groups</option>
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.recordCount}>
                  Showing <strong>{filteredDonors.length}</strong> of {donors.length} donors
                </div>
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Donor Name</th>
                      <th>Blood Group</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>District</th>
                      <th>Area</th>
                      <th>Status</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonors.map((donor) => (
                      <tr key={donor.id}>
                        <td><strong>{donor.full_name}</strong></td>
                        <td><span className={styles.bloodPill}>{donor.blood_group}</span></td>
                        <td><a href={`tel:${donor.phone}`} className={styles.phoneLink}>{donor.phone}</a></td>
                        <td className={styles.subLocation}>{donor.email || "—"}</td>
                        <td>{donor.district || "—"}</td>
                        <td>{donor.area || "—"}</td>
                        <td>
                          <span className={`${styles.badge} ${donor.is_available ? styles.badgeAvailable : styles.badgeUnavailable}`}>
                            {donor.is_available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className={styles.dateCell}>
                          {donor.created_at ? new Date(donor.created_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                    {filteredDonors.length === 0 && !loading && (
                      <tr><td colSpan="8" className={styles.emptyCell}>No matching donors found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === "inventory" && (
            <div className={styles.inventoryContainer}>
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h3 className={styles.chartTitle}>Registered Donors By Blood Group</h3>
                    <p className={styles.chartSub}>Comprehensive platform inventory breakdown</p>
                  </div>
                  <span className={styles.liveStreamBadge}>● Live Database</span>
                </div>

                <div className={styles.inventoryGrid}>
                  {ALL_BLOOD_GROUPS.map((bg) => {
                    const count = metrics.counts[bg] || 0;
                    const pct = metrics.totalDonors > 0 ? ((count / metrics.totalDonors) * 100).toFixed(1) : 0;
                    const activeReqCount = requests.filter(r => r.blood_group === bg && ["Matching", "Responded"].includes(r.status)).length;

                    return (
                      <div key={bg} className={styles.inventoryCard}>
                        <div className={styles.invCardHeader}>
                          <div className={styles.invBloodGroup} style={{ color: BLOOD_COLORS[bg] }}>{bg}</div>
                          <div className={styles.invCountBadge}>{count} Donors</div>
                        </div>
                        <div className={styles.invStats}>
                          <div className={styles.invStatItem}>
                            <span>Platform Share</span>
                            <strong>{pct}%</strong>
                          </div>
                          <div className={styles.invStatItem}>
                            <span>Active Demands</span>
                            <strong style={{ color: activeReqCount > 0 ? "#C5162E" : "#64748B" }}>{activeReqCount}</strong>
                          </div>
                        </div>
                        <div className={styles.invBar}>
                          <div className={styles.invBarFill} style={{ width: `${Math.max(Number(pct), 4)}%`, background: BLOOD_COLORS[bg] }} />
                        </div>
                        <button
                          className={styles.invFilterBtn}
                          onClick={() => {
                            setFilterBloodGroup(bg);
                            setActiveTab("donors");
                          }}
                        >
                          Find {bg} Donors →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Request Details Modal */}
      {selectedRequest && (() => {
        const parsedNotes = parseRequestNotes(selectedRequest.notes);
        return (
          <div className={styles.modalOverlay} onClick={() => setSelectedRequest(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div>
                  <h2>Emergency Request Details</h2>
                  <div className={styles.reqIdRow}>
                    <span className={styles.reqIdBadge}>{formatRequestId(selectedRequest.id)}</span>
                    <span className={styles.reqIdType}>
                      {parsedNotes.isDirectReq || selectedRequest.notes?.includes("DIRECT_REQ_FOR:") ? "Direct Request" : "Public Emergency"}
                    </span>
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={() => setSelectedRequest(null)}>✕</button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalGrid}>
                  <div className={styles.modalItem}>
                    <label>Patient Name</label>
                    <p>{selectedRequest.patient_name}</p>
                  </div>
                  <div className={styles.modalItem}>
                    <label>Blood Group Needed</label>
                    <p><span className={styles.bloodPill}>{selectedRequest.blood_group}</span> ({selectedRequest.units_required || 1} Bag)</p>
                  </div>
                  <div className={styles.modalItem}>
                    <label>Hospital</label>
                    <p>{selectedRequest.hospital_name}</p>
                  </div>
                  {(parsedNotes.details.ward || parsedNotes.details.bed) && (
                    <div className={styles.modalItem}>
                      <label>Ward / Bed / Cabin</label>
                      <p>
                        {parsedNotes.details.ward ? `Ward: ${parsedNotes.details.ward}` : ""}
                        {parsedNotes.details.ward && parsedNotes.details.bed ? " • " : ""}
                        {parsedNotes.details.bed ? `Bed/Cabin: ${parsedNotes.details.bed}` : ""}
                      </p>
                    </div>
                  )}
                  <div className={styles.modalItem}>
                    <label>Urgency Level</label>
                    <p>
                      <span className={`${styles.badge} ${selectedRequest.urgency_level === "Critical" ? styles.badgeCritical : selectedRequest.urgency_level === "Urgent" ? styles.badgeUrgent : styles.badgeStandard}`}>
                        {selectedRequest.urgency_level}
                      </span>
                    </p>
                  </div>
                  <div className={styles.modalItem}>
                    <label>Location</label>
                    <p>{selectedRequest.district}, {selectedRequest.area || "N/A"}</p>
                  </div>
                  <div className={styles.modalItem}>
                    <label>Contact Number</label>
                    <p><a href={`tel:${selectedRequest.contact_number}`} className={styles.phoneLink}>{selectedRequest.contact_number}</a></p>
                  </div>
                  {(parsedNotes.details.contactPerson || parsedNotes.details.relationship) && (
                    <div className={styles.modalItem}>
                      <label>Contact Person / Attendant</label>
                      <p>
                        {parsedNotes.details.contactPerson || "Attendant"}
                        {parsedNotes.details.relationship && (
                          <span className={styles.relationBadge}>{parsedNotes.details.relationship}</span>
                        )}
                      </p>
                    </div>
                  )}
                  <div className={styles.modalItem}>
                    <label>Status</label>
                    <p><strong>{selectedRequest.status}</strong></p>
                  </div>
                  <div className={styles.modalItem}>
                    <label>Required Date/Time</label>
                    <div>
                      <p>{selectedRequest.needed_date_time ? new Date(selectedRequest.needed_date_time).toLocaleString() : "Immediate"}</p>
                      {parsedNotes.details.schedule && (
                        <div className={styles.scheduleBadge}>
                          🕒 {formatDynamicSchedule(selectedRequest.needed_date_time, parsedNotes.details.schedule)}
                        </div>
                      )}
                    </div>
                  </div>
                  {parsedNotes.others && Object.keys(parsedNotes.others).length > 0 && Object.entries(parsedNotes.others).map(([key, val]) => (
                    <div key={key} className={styles.modalItem}>
                      <label>{key}</label>
                      <p>{val}</p>
                    </div>
                  ))}
                </div>

                {parsedNotes.conditionText && (
                  <div className={styles.modalNotes}>
                    <label>Notes / Patient Medical Condition:</label>
                    <p>{parsedNotes.conditionText}</p>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.btnSecondary} onClick={() => setSelectedRequest(null)}>Close</button>
                <a href={`tel:${selectedRequest.contact_number}`} className={styles.btnPrimary}>
                  Call {parsedNotes.details.contactPerson || "Attendant"} ({selectedRequest.contact_number})
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
