'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useOnboarding } from "../../../context/OnboardingContext";

function page() {
  const { state } = useOnboarding();
  const [targetWeightLoss, setTargetWeightLoss] = useState(0);

  useEffect(() => {
    // Get the value from previous state, fallback to 5 if undefined
    setTargetWeightLoss(state.weeklyWeightLossGoal || 5);
  }, [state.weeklyWeightLossGoal]);

  return (
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
     
              <h3 className="mb-3">
                Loosing <span>{targetWeightLoss}lbs</span> Is Achievable - <br /> And Easier
                Than You Think!
              </h3>
              <p className="mb-5">
                90% of users notice a clear change with <br /> Troms, and it's
                hard to go back.
              </p>

              <div className="text-center mt-5">
                <Link href="/result-trom" className="custom-btn continue-btn">
                  Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-bttm">
        <p>
          <span>12/</span> 25
        </p>
      </div>
    </section>
  );
}

export default page;
