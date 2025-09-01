"use client";
import HeightPicker from "../../../Components/HeightPicker";
import Link from "next/link";
import React from "react";

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
              <div className="auth-cards horizontal-height">
                <p className="text-uppercase mb-2">Your height</p>
                <h3 className="mb-2">What is your current height?</h3>
                <p className="mb-2">You can update it later if needed</p>
                <HeightPicker />
                <div className="text-center mt-3">
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
