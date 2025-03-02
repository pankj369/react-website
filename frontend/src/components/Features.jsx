import React from "react";
import "./Features.css";

const featuresData = [
  {
    title: "Quiet Study Spaces",
    description: "Enjoy a distraction-free environment for focused learning.",
  },
  {
    title: "Free Wi-Fi",
    description: "High-speed internet to access online resources and research.",
  },
  {
    title: "E-Books & Journals",
    description: "Access a vast collection of digital books and academic journals.",
  },
  {
    title: "Reference Materials",
    description: "A collection of encyclopedias, dictionaries, and research papers.",
  },
  {
    title: "Personalized Study Plans",
    description: "Tailored study schedules to boost your efficiency.",
  },
  {
    title: "Group Study Rooms",
    description: "Collaborate with peers in dedicated group study areas.",
  },
  {
    title: "Magazine & Newspapers",
    description: "Stay updated with daily newspapers and magazines.",
  },
  {
    title: "Student Dashboard",
    description: "Track progress, manage book loans, and view upcoming events.",
  },
];

const Features = () => {
  return (
    <section className="features">
      <h2 className="section-title">Library Facilities & Features</h2>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-content">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
