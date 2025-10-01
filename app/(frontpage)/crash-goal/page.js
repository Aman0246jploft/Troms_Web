"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useRouter } from "next/navigation";

function page() {
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const router = useRouter();
  useEffect(() => {
    if (state.currentStep !== 29) {
      updateStep(30);
    }
  }, [state.currentStep]);

  const handleContinue = (e) => {
    e.preventDefault();

    router.push("/approach");
  };

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
              <div className="auth-cards food">
                <button type="button" className="new_back_btn">
                  Previous
                </button>
                <button type="button" className="new_skips_btn">
                  Skip
                </button>
                <p className="text-uppercase mb-2">Crash your goal</p>
                <h3 className="mb-4">
                  You have Great Potential <br /> to crush your goal
                </h3>
                <div className="d-flex justify-content-center py-2  ">
                  <img src="/images/chart.svg" alt="Crash your goal" />
                </div>
                <div className="text-center mt-3">
                  <button
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          {/* <p>
            <span>22/</span> 25
          </p> */}
          <p>
            <span>{state.currentStep}/</span> {state.totalSteps}
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
