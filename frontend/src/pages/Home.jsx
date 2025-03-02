import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Events from "../components/Events";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Events/>
      <Testimonial />
      <Footer />
    </>
  );
};

export default Home;
