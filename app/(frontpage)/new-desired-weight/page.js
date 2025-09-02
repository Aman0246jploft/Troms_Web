import DesiredWeightPicker from "../../../Components/DesiredWeightPicker";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>
              <div className="auth-cards new-desired-weight">
                <p className="text-uppercase mb-2">Desired Weight</p>
                <h3 className="mb-2">What is desired weight?</h3>
                <div className="weight-switch">
                  <span>Imperial</span>
                  <label className="switch">
                    <input type="checkbox" className="d-none" />
                    <span className="slider"></span>
                  </label>
                  <span>Metric</span>
                </div>
                <DesiredWeightPicker />
                <div className="text-center mt-2">
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
