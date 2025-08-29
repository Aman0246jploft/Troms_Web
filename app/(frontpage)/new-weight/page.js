import React from "react";
import WeightPicker from "../../../Components/WeightPicker";
import Link from "next/link";

function page() {
  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>
              <div className="auth-cards weight-goal">
                <p className="text-uppercase mb-2">Your Weight</p>
                <h3 className="mb-2">What is your current weight?</h3>
                <p className="mb-2">You can update it later if needed</p>
                <div className="weight-switch">
                  <span>Imperial</span>
                  <label className="switch">
                    <input type="checkbox" className="d-none" />
                    <span className="slider"></span>
                  </label>
                  <span>Metric</span>
                </div>
                <WeightPicker />
                <div className="text-center mt-5">
                  <button type="submit" className="custom-btn continue-btn">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
