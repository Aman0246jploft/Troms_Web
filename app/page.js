"use client";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Link from "next/link";
import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

export default function Home() {
  const [activeStep, setActiveStep] = useState(2); // default active = 02

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
        }/contact-us/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactForm),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        // Reset form
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        // Hide success message after 2 seconds
        setTimeout(() => {
          setSubmitStatus({ type: "", message: "" });
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again.",
      });
      // Hide error message after 2 seconds
      setTimeout(() => {
        setSubmitStatus({ type: "", message: "" });
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Header />
      <section className="banner-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 order-2 order-lg-1 order-md-1">
              <div className="banner-content">
                <h6>
                  <img src="/images/banner-barbell.svg" alt="" />
                  #1 CUTTING EDGE HEALTH & FITNESS SOLUTION
                </h6>
                <h1>
                  Ai That Transform <br /> Your Fitness
                </h1>
                <p>
                  Personalised workouts and meal plans designed just for you -
                  powered by Al.
                </p>
                <Link className="thm-btn" href="/auth">
                  <span>Get Started Free</span>
                </Link>
                {/* <Link className="thm-btn dark-btn" href="">
                  <span>Watch Demo</span>
                </Link> */}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 order-1 order-lg-2 order-md-2 text-end">
              <img src="/images/banner-img.png" alt="banner" />
            </div>
          </div>
          <ul className="banner-icon-list">
            <li>
              <img src="/images/banner-icon-01.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-02.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-03.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-04.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-05.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-06.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-07.svg" alt="" />
            </li>
            <li>
              <img src="/images/banner-icon-08.svg" alt="" />
            </li>
          </ul>
        </div>
      </section>
      <section className="features-sec">
        <div className="container">
          <h2 className="title">Why you’ll love it</h2>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="features-cards">
                <div className="features-innr">
                  <img src="/images/feature-icon-01.svg" alt="" />
                  <h4>Workout Recommendations</h4>
                  <p>At tailers every workout to your fitness.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="features-cards">
                <div className="features-innr">
                  <img src="/images/feature-icon-02.svg" alt="" />
                  <h4>Al Meal Planner</h4>
                  <p>Get custom workouts and ordigos.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="features-cards">
                <div className="features-innr">
                  <img src="/images/feature-icon-03.svg" alt="" />
                  <h4>Progress Tracking</h4>
                  <p>Nutrition, workouts, and minseti:</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="how-works">
        <div className="container">
          <h2 className="title text-center mb-2">How It Works</h2>
          <p className="text-center">
            Troms tailors your fitness journey with personalized workouts,
            nutrition plans, and progress tracking. <br /> Ready to experience
            it?
          </p>
          <div className="row mt-5 align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="works-img">
                <img src="/images/work-img.png" alt="" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <ul className="step-list">
                <li
                  className={`step ${activeStep === 1 ? "active" : ""}`}
                  onClick={() => setActiveStep(1)}
                >
                  <h6 className="step-count">01</h6>
                  <h4>Sign Up & Assessment</h4>
                  <p>Create your account and complete a fitness assessment.</p>
                </li>
                <li
                  className={`step ${activeStep === 2 ? "active" : ""}`}
                  onClick={() => setActiveStep(2)}
                >
                  <h6 className="step-count">02</h6>
                  <h4>Personalised Plan Creation</h4>
                  <p>Our AI generates a customized workout and meal plan.</p>
                  <div className="step-content"></div>
                </li>
                <li
                  className={`step ${activeStep === 3 ? "active" : ""}`}
                  onClick={() => setActiveStep(3)}
                >
                  <h6 className="step-count">03</h6>
                  <h4>Achieve Your Goals</h4>
                  <p>
                    Navigate the app with ease. Our interactive tour guides you{" "}
                    <br />
                    through key features and functionalities.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="short-sec pt-80 pb-80">
        <div className="container">
          <h2 className="title text-center mb-5">How to Create AI Shorts?</h2>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="short-cards">
                <h5>1</h5>
                <h4>Set You Goals</h4>
                <p>Input your fitness details</p>
                <div className="d-flex justify-content-center align-items-center p-4">
                  <img src="/images/short-img-01.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="short-cards">
                <h5>2</h5>
                <h4>AI Generates Plan</h4>
                <p>Input your fitness details</p>
                <div className="d-flex justify-content-center align-items-center p-4">
                  <img src="/images/short-img-02.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="short-cards">
                <h5>3</h5>
                <h4>Track & Improve</h4>
                <p>Input your fitness details</p>
                <div className="d-flex justify-content-center align-items-center p-4">
                  <img src="/images/short-img-03.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container pb-80">
        <div className="habits-cards">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6 col-md-7 col-sm-6">
              <div className="habits-lft">
                <img src="/images/dark-logo.svg" className="build-img" alt="" />
                <h2 className="title">Ready to build better habits?</h2>
                <p>
                  Take control of your daily routines, stay consistent with the
                  goals that matter, and build meaningful progress — one habit
                  at a time. With Habitus, you’re just a step away from creating
                  a better version of yourself.{" "}
                </p>
                <div className="download-btn">
                  <h6>Download our app</h6>
                  <Link href="#" className="">
                    <img src="/images/app-store.svg" alt="App Store" />
                  </Link>
                  <Link href="#" className="">
                    <img src="/images/play-store.svg" alt="Play Store" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-6">
              <div className="habits-img">
                <img src="/images/habits-img.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container pb-80">
        <div className="cta-innr">
          <div className="row">
            <div className="col-lg-7 col-md-12">
              <div className="cta-lft">
                <h2 className="title">We’re here to connect and assist you</h2>
                <p>
                  Have questions about the summit? <br />
                  Need help with registration or travel? <br />
                  Our team is ready to assist you.
                </p>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="cta-cards">
                      <h4>Contact Us</h4>
                      <Link href="tel:+31 20 123 4567">+31 20 123 4567</Link>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="cta-cards">
                      <h4>Event Location</h4>
                      <p>Horizon Convention Center Amsterdam, Netherlands</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="cta-cards">
                      <h4>email</h4>
                      <Link href="mailto:info@troms.com">info@troms.com</Link>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="cta-cards ">
                      <h4>Follow Us</h4>
                      <div className="follow">
                        <Link href="#" target="_blank">
                          <img src="/images/facebook.svg" alt="Facebook" />
                        </Link>
                        <Link href="#" target="_blank">
                          <img src="/images/instagram.svg" alt="Instagram" />
                        </Link>
                        <Link href="#" target="_blank">
                          <img src="/images/x.svg" alt="X" />
                        </Link>
                        <Link href="#" target="_blank">
                          <img src="/images/youtube.svg" alt="YouTube" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <div className="cta-form">
                <h3>get in touch</h3>
                <p>
                  Reach out with inquiries about tickets, partnerships, or event
                  details.
                </p>

                {/* Success/Error Message */}
                {submitStatus.message && (
                  <div
                    className={`alert ${
                      submitStatus.type === "success"
                        ? "alert-success"
                        : "alert-danger"
                    } mb-3`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="frm-bx">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                  <div className="frm-bx">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      maxLength={255}
                    />
                  </div>
                  <div className="frm-bx">
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      minLength={5}
                      maxLength={200}
                    />
                  </div>
                  <div className="frm-bx">
                    <textarea
                      name="message"
                      className="form-control"
                      placeholder="Message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      minLength={10}
                      maxLength={1000}
                    ></textarea>
                  </div>
                  <div>
                    <button
                      className={`custom-btn light-btn ${
                        isSubmitting ? "disabled" : ""
                      }`}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container pb-80">
        <h2 className="text-center title mb-3">Frequently Asked Questions</h2>
        <p className="text-center text-black">
          Everything you need to know before getting started
        </p>
        <div className="faq-cards">
          <Accordion defaultActiveKey={null}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>How does Fitness AI work? </Accordion.Header>
              <Accordion.Body>
                <p>
                  It is shown by default, until the collapse plugin adds the
                  appropriate classes that we use to style each element. These
                  classes control the overall appearance, as well as the showing
                  and hiding
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                Can I use it without equipment?{" "}
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  It is shown by default, until the collapse plugin adds the
                  appropriate classes that we use to style each element. These
                  classes control the overall appearance, as well as the showing
                  and hiding
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                How does the AI personalise my plan?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  It is shown by default, until the collapse plugin adds the
                  appropriate classes that we use to style each element. These
                  classes control the overall appearance, as well as the showing
                  and hiding
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                Can I adjust my plan based on my progress?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  It is shown by default, until the collapse plugin adds the
                  appropriate classes that we use to style each element. These
                  classes control the overall appearance, as well as the showing
                  and hiding
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      <Footer />
    </>
  );
}
