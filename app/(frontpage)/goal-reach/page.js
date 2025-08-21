"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";

function page() {
  const [value, setValue] = useState(1.2);

  // Update CSS variable for fill
  useEffect(() => {
    const percent = ((value - 0.5) / (2 - 0.5)) * 100;
    document.documentElement.style.setProperty(
      "--range-percent",
      `${percent}%`
    );
  }, [value]);
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
              <div className="auth-cards gender">
                <p className="text-uppercase mb-5">Reach your goal</p>
                <h3 className="mb-2">How fast do you wanna reach your goal?</h3>
                <p>Weight lose speed per week</p>
                <div className="goal-range">
                  <h5 className="text-center">{value} lbs</h5>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="slider"
                  />

                  <div className="labels">
                    <span>0.5 lbs</span>
                    <span>2.0 lbs</span>
                  </div>

                  <p className="mt-2 text-center fw-bold"></p>
                </div>
                <div className="text-center mt-5">
                  <Link
                    href="/realistic-target"
                    className="custom-btn continue-btn"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>11/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
