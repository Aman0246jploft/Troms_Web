'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";

function RealisticTargetPage() {
  const router = useRouter();
  const { state, updateStep } = useOnboarding();
  const [targetWeightLoss, setTargetWeightLoss] = useState(0);
  
  // Use global unit system
  const isMetric = state.unitSystem === "metric";
  const weightUnit = isMetric ? "kg" : "lbs";
  
  // Convert weight loss value for display
  const getDisplayValue = (lbsValue) => {
    if (isMetric) {
      // Convert lbs to kg (1 lb = 0.453592 kg)
      return (lbsValue * 0.453592).toFixed(1);
    }
    return lbsValue.toFixed(1);
  };

  useEffect(() => {
    // Get the value from previous state, fallback to 1.5 if undefined
    setTargetWeightLoss(state.weeklyWeightLossGoal || 1.5);
  }, [state.weeklyWeightLossGoal]);

  useEffect(() => {
    updateStep(13);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  const handleContinue = () => {
    router.push('/result-trom');
  };

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
              <p className="text-uppercase mb-5">Realistic target</p>
              <h3 className="mb-3">
                Loosing <span>{getDisplayValue(targetWeightLoss)}{weightUnit}</span> Is Achievable - <br /> And Easier
                Than You Think!
              </h3>
              <p className="mb-5">
                90% of users notice a clear change with <br /> Troms, and it's
                hard to go back.
              </p>

              <div className="text-center mt-5">
                <button 
                  type="button" 
                  className="custom-btn continue-btn"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-bttm">
        <p>
          <span>{state.currentStep}/</span> {state.totalSteps}
        </p>
      </div>
    </section>
  );
}

export default RealisticTargetPage;
