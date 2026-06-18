import React from "react";
import {
  FaMapMarkedAlt,
  FaParking,
  FaChartLine,
  FaCloudSun,
  FaCalendarAlt,
  FaUsers
} from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: <FaParking size={30} />,
      title: "Real-Time Parking",
      text: "View available parking facilities and occupancy information in real time."
    },
    {
      icon: <FaCalendarAlt size={30} />,
      title: "Event Aware",
      text: "Parking recommendations adapt to concerts, festivals and city events."
    },
    {
      icon: <FaChartLine size={30} />,
      title: "Predictive Analytics",
      text: "Forecast future parking demand using historical and live data."
    },
    {
      icon: <FaCloudSun size={30} />,
      title: "Weather Insights",
      text: "Weather conditions are considered when predicting parking demand."
    },
    {
      icon: <FaMapMarkedAlt size={30} />,
      title: "Interactive Maps",
      text: "Explore parking facilities through a user-friendly map interface."
    },
    {
      icon: <FaUsers size={30} />,
      title: "Smart Mobility",
      text: "Reduce congestion and improve urban transportation efficiency."
    }
  ];

  const team = [
    "Manisha Rai",
    "Ashrutha Senthilkumar",
    "Balasuryha Lavakumar",
    "Sakthi Keerthiga Ravichandran"
  ];

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* HERO */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "60px 40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <h1
            style={{
              fontWeight: "700",
              fontSize: "3rem",
              marginBottom: "20px"
            }}
          >
            About ParkWise
          </h1>

          <h3
            style={{
              color: "#198754",
              marginBottom: "20px"
            }}
          >
            Smart Event-Aware Parking Prediction System
          </h3>

          <p
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              fontSize: "18px",
              color: "#666",
              lineHeight: "1.8"
            }}
          >
            ParkWise helps drivers find parking faster by combining real-time
            parking data, event awareness, weather information and predictive
            analytics. Our goal is to reduce traffic congestion, save time and
            make urban mobility smarter.
          </p>
        </div>

        {/* MISSION */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            marginTop: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Our Mission</h2>

          <p
            style={{
              color: "#666",
              lineHeight: "1.8",
              fontSize: "17px"
            }}
          >
            Finding parking in large cities often causes unnecessary stress,
            traffic and fuel consumption. ParkWise aims to solve this problem by
            providing intelligent parking recommendations powered by real-time
            city data and forecasting technology.
          </p>
        </div>

        {/* FEATURES */}
        <div style={{ marginTop: "40px" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontWeight: "700"
            }}
          >
            Key Features
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px"
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "25px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
                }}
              >
                <div
                  style={{
                    color: "#198754",
                    marginBottom: "15px"
                  }}
                >
                  {feature.icon}
                </div>

                <h5>{feature.title}</h5>

                <p
                  style={{
                    color: "#666",
                    marginTop: "10px"
                  }}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNOLOGY */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            marginTop: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ marginBottom: "25px" }}>Technology Stack</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px"
            }}
          >
            {[
              "React",
              "Python",
              "FastAPI",
              "Supabase",
              "PostgreSQL",
              "Leaflet Maps",
              "AWS",
              "Vercel"
            ].map((tech) => (
              <span
                key={tech}
                style={{
                  background: "#198754",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: "30px",
                  fontWeight: "500"
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* TEAM */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            marginTop: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ marginBottom: "30px" }}>Project Team</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px"
            }}
          >
            {team.map((member) => (
              <div
                key={member}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "16px",
                  padding: "25px",
                  textAlign: "center"
                }}
              >
                <h5>{member}</h5>

                <p
                  style={{
                    color: "#666",
                    marginTop: "10px"
                  }}
                >
                  EPITA Software Engineering
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* VISION */}
        <div
          style={{
            background: "#198754",
            color: "#fff",
            borderRadius: "20px",
            padding: "50px",
            marginTop: "40px",
            textAlign: "center"
          }}
        >
          <h2>Our Vision</h2>

          <p
            style={{
              maxWidth: "800px",
              margin: "20px auto 0",
              lineHeight: "1.8",
              fontSize: "18px"
            }}
          >
            We envision smarter and more sustainable cities where drivers spend
            less time searching for parking, traffic congestion is reduced and
            urban mobility becomes more efficient through data-driven decision
            making.
          </p>
        </div>
      </div>
    </div>
  );
}