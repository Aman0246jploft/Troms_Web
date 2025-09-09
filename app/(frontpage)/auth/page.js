"use client";
import Link from "next/link";
import { useState } from "react";

function page() {
  const [step, setStep] = useState(1);
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
              <div className="auth-cards">
                {step === 1 && (
                  <div className="track-bar">
                    <div className="track-img">
                      <img src="/images/track-img-01.png" alt="Track Image 1" />
                    </div>
                    <h3>
                      Build, Track, Generate your <br /> fitness plans with Al
                    </h3>
                    <p>Become the strongest, healthiest version of yourself.</p>
                    <div className="track-button">
                      <Link href="/register" className="prev-link">
                        <span>Skip</span>
                      </Link>
                      <button
                        onClick={() => setStep(2)}
                        className="custom-btn d-flex gap-2 align-items-center"
                      >
                        Next{" "}
                        <img src="/images/right-arrow.svg" alt="Arrow Right" />
                      </button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="track-bar">
                    <div className="track-img">
                      <img src="/images/track-img-02.png" alt="Track Image 1" />
                    </div>
                    <h3>
                      Al-Powered Fitness & <br /> Nutrition
                    </h3>
                    <p>
                      Reach your health goals with tailored daily missions
                      created with Al
                    </p>
                    <div className="track-button">
                      <button onClick={() => setStep(1)} className="prev-link">
                        <span>Previous</span>
                      </button>
                      <Link
                        href="/register"
                        className="custom-btn d-flex gap-2 align-items-center"
                      >
                        Next{" "}
                        <img src="/images/right-arrow.svg" alt="Arrow Right" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
