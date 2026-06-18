import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          "✅ Thank you! Your message has been sent successfully.",
        );

        setErrorMessage("");

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);

      setErrorMessage("Unable to connect to server.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "40px",
          }}
        >
          Have questions about parking availability, event predictions, or
          ParkWise? We'd love to hear from you.
        </p>

        {successMessage && (
          <div className="alert alert-success mb-3">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="alert alert-danger mb-3">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your Name"
            />

            {errors.name && (
              <small
                style={{
                  color: "#dc3545",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {errors.name}
              </small>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="your@email.com"
            />

            {errors.email && (
              <small
                style={{
                  color: "#dc3545",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {errors.email}
              </small>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-control"
              placeholder="Subject"
            />
            {errors.subject && (
              <small
                style={{
                  color: "#dc3545",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {errors.subject}
              </small>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Message</label>
            <textarea
              rows="6"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              placeholder="Write your message..."
            />
            {errors.message && (
              <small
                style={{
                  color: "#dc3545",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {errors.message}
              </small>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send Message
          </button>
        </form>
        {/* 
        <hr style={{ margin: "40px 0" }} /> */}

        {/* <div style={{ textAlign: "center" }}>
          <h4>ParkWise</h4>

          <p>📍 Paris, France</p>

          <p>📧 support@parkwise.com</p>

          <p>🚗 Smart Event-Aware Parking Prediction System</p>
        </div> */}
      </div>
    </div>
  );
}
