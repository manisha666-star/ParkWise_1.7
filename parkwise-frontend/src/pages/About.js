import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import {
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaCloudSun,
  FaDatabase,
  FaLeaf,
  FaMapMarkedAlt,
  FaParking,
  FaRoute,
  FaSearchLocation,
  FaUsers
} from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: <FaParking size={26} />,
      title: "Real-Time Parking",
      text: "Browse nearby parking facilities with availability, distance, and useful details."
    },
    {
      icon: <FaCalendarAlt size={26} />,
      title: "Event Awareness",
      text: "Consider concerts, festivals, and city events that can change parking demand."
    },
    {
      icon: <FaChartLine size={26} />,
      title: "Demand Forecasting",
      text: "Use historical and live signals to estimate future parking pressure."
    },
    {
      icon: <FaCloudSun size={26} />,
      title: "Weather Context",
      text: "Include weather information as another factor in mobility and demand patterns."
    },
    {
      icon: <FaMapMarkedAlt size={26} />,
      title: "Map-Based Search",
      text: "Explore parking options visually with an interactive map experience."
    },
    {
      icon: <FaUsers size={26} />,
      title: "Smarter Mobility",
      text: "Help drivers make better choices and reduce unnecessary circulation."
    }
  ];

  const steps = [
    {
      title: "Search a place",
      text: "Enter a destination or use your current location.",
      icon: <FaSearchLocation />
    },
    {
      title: "Compare parking",
      text: "Review nearby options by distance, availability, and location.",
      icon: <FaParking />
    },
    {
      title: "Plan smarter",
      text: "Use event-aware and forecast insights to avoid busy periods.",
      icon: <FaRoute />
    }
  ];

  const impactItems = [
    "Less time spent searching for parking",
    "Better decisions during peak hours and events",
    "Reduced congestion from unnecessary driving",
    "A cleaner, more data-driven urban mobility experience"
  ];

  const technologies = [
    "React",
    "FastAPI",
    "Python",
    "Supabase",
    "PostgreSQL",
    "Leaflet Maps",
    "Mapbox",
    "Vercel"
  ];

  const team = [
    {
      name: "Manisha Rai",
      role: "Frontend, product flow, and UI implementation"
    },
    {
      name: "Ashrutha Senthilkumar",
      role: "Backend APIs, integration, and data handling"
    },
    {
      name: "Balasuryha Lavakumar",
      role: "Forecasting, analytics, and deployment support"
    },
    {
      name: "Sakthi Keerthiga Ravichandran",
      role: "Database, testing, and feature validation"
    }
  ];

  return (
    <div className="about-page" style={styles.page}>
      <section className="about-hero" style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.eyebrow}>Smart Parking Prediction System</span>
          <h1 style={styles.heroTitle}>About ParkWise</h1>
          <p style={styles.heroText}>
            ParkWise helps drivers find better parking options by combining
            real-time data, maps, city events, weather signals, and demand
            forecasting into one simple experience.
          </p>

          <div style={styles.heroActions}>
            <Link to="/all-parking" style={styles.primaryButton}>
              Find Parking
            </Link>
            <Link to="/contact" style={styles.secondaryButton}>
              Contact Us
            </Link>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <div style={styles.panelIcon}>
            <FaMapMarkedAlt />
          </div>
          <h3 style={styles.panelTitle}>Built for city drivers</h3>
          <p style={styles.panelText}>
            Designed to reduce parking uncertainty before and during a trip.
          </p>
          <div style={styles.metricsGrid}>
            <div>
              <strong style={styles.metricValue}>Live</strong>
              <span style={styles.metricLabel}>parking data</span>
            </div>
            <div>
              <strong style={styles.metricValue}>Map</strong>
              <span style={styles.metricLabel}>navigation</span>
            </div>
            <div>
              <strong style={styles.metricValue}>Smart</strong>
              <span style={styles.metricLabel}>forecasting</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-two-column" style={styles.twoColumnSection}>
        <div>
          <span style={styles.sectionLabel}>The Problem</span>
          <h2 style={styles.sectionTitle}>Parking should not be guesswork.</h2>
        </div>
        <p style={styles.sectionText}>
          Finding parking in busy cities can waste time, increase fuel
          consumption, and add pressure to already crowded streets. The problem
          becomes harder during concerts, festivals, bad weather, and peak
          travel hours.
        </p>
      </section>

      <section className="about-two-column" style={styles.twoColumnSection}>
        <div>
          <span style={styles.sectionLabel}>Our Mission</span>
          <h2 style={styles.sectionTitle}>Make parking decisions clearer.</h2>
        </div>
        <p style={styles.sectionText}>
          ParkWise aims to support smarter urban mobility by helping users
          compare nearby parking, understand availability, and plan around
          changing demand using data-driven insights.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>How It Works</span>
          <h2 style={styles.sectionTitle}>From search to smarter arrival</h2>
        </div>

        <div style={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={step.title} style={styles.stepCard}>
              <div style={styles.stepTop}>
                <span style={styles.stepNumber}>0{index + 1}</span>
                <span style={styles.stepIcon}>{step.icon}</span>
              </div>
              <h3 style={styles.cardTitle}>{step.title}</h3>
              <p style={styles.cardText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>Key Features</span>
          <h2 style={styles.sectionTitle}>What ParkWise brings together</h2>
        </div>

        <div style={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-impact" style={styles.impactSection}>
        <div>
          <span style={styles.lightLabel}>Why It Matters</span>
          <h2 style={styles.impactTitle}>Better parking choices can improve the whole trip.</h2>
          <p style={styles.impactText}>
            ParkWise focuses on practical impact: fewer unnecessary loops around
            busy streets, better planning during demand spikes, and a smoother
            journey for drivers.
          </p>
        </div>

        <div style={styles.impactList}>
          {impactItems.map((item) => (
            <div key={item} style={styles.impactItem}>
              <FaCheckCircle />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>Technology</span>
          <h2 style={styles.sectionTitle}>Built with a modern full-stack setup</h2>
        </div>

        <div style={styles.techCard}>
          <div style={styles.techIntro}>
            <FaDatabase style={styles.techIcon} />
            <p style={styles.sectionText}>
              The project connects a React frontend with FastAPI backend
              services, Supabase/PostgreSQL data storage, mapping tools, and
              forecasting logic.
            </p>
          </div>

          <div style={styles.techList}>
            {technologies.map((tech) => (
              <span key={tech} style={styles.techPill}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>Project Team</span>
          <h2 style={styles.sectionTitle}>Created by EPITA Software Engineering students</h2>
        </div>

        <div style={styles.teamGrid}>
          {team.map((member) => (
            <div key={member.name} style={styles.teamCard}>
              <div style={styles.avatar}>{member.name.charAt(0)}</div>
              <h3 style={styles.cardTitle}>{member.name}</h3>
              <p style={styles.cardText}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.visionSection}>
        <FaLeaf style={styles.visionIcon} />
        <h2 style={styles.visionTitle}>Our Vision</h2>
        <p style={styles.visionText}>
          We envision smarter and more sustainable cities where drivers spend
          less time searching for parking, traffic congestion is reduced, and
          urban mobility becomes more efficient through data-driven decisions.
        </p>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#1f2937",
    padding: "48px 20px 64px"
  },
  hero: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 0.8fr)",
    gap: "24px",
    alignItems: "stretch"
  },
  heroContent: {
    background: "linear-gradient(135deg, #1886ff 0%, #1976d2 55%, #198754 100%)",
    color: "#fff",
    borderRadius: "16px",
    padding: "56px",
    minHeight: "380px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  eyebrow: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.28)",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "18px"
  },
  heroTitle: {
    fontSize: "48px",
    lineHeight: 1.05,
    fontWeight: 800,
    margin: "0 0 18px"
  },
  heroText: {
    maxWidth: "720px",
    fontSize: "18px",
    lineHeight: 1.75,
    margin: 0,
    color: "rgba(255,255,255,0.9)"
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "30px"
  },
  primaryButton: {
    background: "#fff",
    color: "#1976d2",
    borderRadius: "10px",
    padding: "12px 20px",
    fontWeight: 700,
    textDecoration: "none"
  },
  secondaryButton: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.36)",
    borderRadius: "10px",
    padding: "12px 20px",
    fontWeight: 700,
    textDecoration: "none"
  },
  heroPanel: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)"
  },
  panelIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "14px",
    background: "#e0f2fe",
    color: "#1976d2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "24px"
  },
  panelTitle: {
    margin: "0 0 10px",
    fontSize: "24px",
    fontWeight: 800
  },
  panelText: {
    color: "#6b7280",
    lineHeight: 1.7,
    marginBottom: "28px"
  },
  metricsGrid: {
    display: "grid",
    gap: "14px"
  },
  metricValue: {
    display: "block",
    fontSize: "22px",
    color: "#198754"
  },
  metricLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "14px"
  },
  twoColumnSection: {
    maxWidth: "1180px",
    margin: "28px auto 0",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "34px",
    display: "grid",
    gridTemplateColumns: "minmax(240px, 0.75fr) minmax(0, 1.25fr)",
    gap: "28px",
    alignItems: "start"
  },
  section: {
    maxWidth: "1180px",
    margin: "52px auto 0"
  },
  sectionHeader: {
    maxWidth: "760px",
    marginBottom: "24px"
  },
  sectionLabel: {
    color: "#198754",
    fontSize: "14px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  lightLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: "14px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  sectionTitle: {
    fontSize: "32px",
    lineHeight: 1.2,
    fontWeight: 800,
    margin: "8px 0 0"
  },
  sectionText: {
    color: "#6b7280",
    fontSize: "17px",
    lineHeight: 1.8,
    margin: 0
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px"
  },
  stepCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "26px"
  },
  stepTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px"
  },
  stepNumber: {
    color: "#cbd5e1",
    fontSize: "28px",
    fontWeight: 800
  },
  stepIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#e0f2fe",
    color: "#1976d2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px"
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px"
  },
  featureCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "26px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)"
  },
  featureIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#e0f2fe",
    color: "#1976d2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "18px"
  },
  cardTitle: {
    margin: "0 0 10px",
    fontSize: "19px",
    fontWeight: 800
  },
  cardText: {
    color: "#6b7280",
    lineHeight: 1.7,
    margin: 0
  },
  impactSection: {
    maxWidth: "1180px",
    margin: "52px auto 0",
    background: "linear-gradient(135deg, #1976d2 0%, #1886ff 62%, #198754 100%)",
    color: "#fff",
    borderRadius: "16px",
    padding: "40px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.9fr)",
    gap: "28px"
  },
  impactTitle: {
    fontSize: "32px",
    lineHeight: 1.2,
    fontWeight: 800,
    margin: "8px 0 16px"
  },
  impactText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: "17px",
    lineHeight: 1.8,
    margin: 0
  },
  impactList: {
    display: "grid",
    gap: "14px",
    alignContent: "center"
  },
  impactItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "12px",
    padding: "14px 16px",
    fontWeight: 600
  },
  techCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "30px"
  },
  techIntro: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    marginBottom: "24px"
  },
  techIcon: {
    color: "#1976d2",
    fontSize: "30px",
    flex: "0 0 auto"
  },
  techList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  },
  techPill: {
    background: "#eef6ff",
    color: "#1976d2",
    border: "1px solid #cfe8ff",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 700
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px"
  },
  teamCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "26px"
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#1976d2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    marginBottom: "18px"
  },
  visionSection: {
    maxWidth: "1180px",
    margin: "52px auto 0",
    textAlign: "center",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "44px"
  },
  visionIcon: {
    color: "#198754",
    fontSize: "34px",
    marginBottom: "14px"
  },
  visionTitle: {
    fontSize: "32px",
    fontWeight: 800,
    margin: "0 0 14px"
  },
  visionText: {
    maxWidth: "820px",
    margin: "0 auto",
    color: "#6b7280",
    fontSize: "17px",
    lineHeight: 1.8
  }
};
