"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";

function page() {
  const router = useRouter();
  const { state, updateStep } = useOnboarding();
  const [isProcessing, setIsProcessing] = useState(true);

  // useEffect(() => {
  //   // Redirect if not authenticated
  //   if (state.isAuthChecked && state.isAuthenticated === false) {
  //     router.push("/register");
  //     return;
  //   }

  //   // Update current step
  //   if (state.currentStep !== 24) {
  //     updateStep(25);
  //   }

  //   // Simulate BMR calculation process
  //   const timer = setTimeout(() => {
  //     setIsProcessing(false);
  //     // Redirect to subscriptions after BMR calculation
  //     setTimeout(() => {
  //       router.push("/subscriptions");
  //     }, 1500);
  //   }, 3000); // 3 seconds for BMR calculation simulation

  //   return () => clearTimeout(timer);
  // }, [state.isAuthChecked, state.isAuthenticated, state.currentStep, router, updateStep]);


  useEffect(() => {
  // Redirect if not authenticated
  if (state.isAuthChecked && state.isAuthenticated === false) {
    router.push("/register");
    return;
  }


    // updateStep(31);


  const timer = setTimeout(() => {
    setIsProcessing(false);
    setTimeout(() => router.push("/subscriptions"), 1500);
  }, 3000);

  return () => clearTimeout(timer);
}, [state.isAuthChecked, state.isAuthenticated, state.currentStep, router, updateStep]);




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
                <h3 className="mb-4">
                  {isProcessing ? (
                    <>
                      We're setting <br /> everything up for you
                    </>
                  ) : (
                    <>
                      Your BMR has been <br /> calculated successfully!
                    </>
                  )}
                </h3>
                <p>
                  {isProcessing ? "Applying BMR Formula" : "Redirecting to subscription plans..."}
                </p>
                <div className="text-center mt-5 mb-5">
                  {isProcessing ? (
                    <img src="/images/loader.svg" className="bmr-img" alt="BMR Graph" />
                  ) : (
                    <img src="/images/check-mark.svg" alt="Success" />
                  )}
                </div>

                {!isProcessing && (
                  <div className="text-center mt-3">
                    <button
                      onClick={() => router.push("/subscriptions")}
                      className="custom-btn continue-btn"
                    >
                      Continue to Subscription
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          {/* <p>
            <span>24/</span> 25
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
