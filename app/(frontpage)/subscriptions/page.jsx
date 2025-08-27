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
              <div className="auth-cards">
                <p className="text-uppercase mb-2">Subscriptions</p>
                <h3 className="mb-2">
                  Unlock Your Personalized <br /> Fitness Plan
                </h3>
                <p>
                  Get full access to your custom Meal and Workout <br /> Plans
                  by subscribing to Trom.
                </p>
                <div className="choose-plan px-135">
                  <h6 className="text-center">Choose a plan to begin:</h6>
                  <div className="form-check choose-plan-bx">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="plan"
                      id="monthly"
                    />
                    <label className="form-check-label" htmlFor="monthly">
                      <div>
                        <strong>Monthly Plan</strong>
                        <p>3 days free, then $9.99/month</p>
                      </div>
                    </label>
                  </div>
                  <div className="form-check choose-plan-bx">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="plan"
                      id="yearly"
                    />
                    <label className="form-check-label" htmlFor="yearly">
                      <div>
                        <strong>Yearly Plan</strong>
                        <p>3 days free, then $9.99/month</p>
                      </div>
                    </label>
                  </div>
                  <div class="form-check choose-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkDefault"
                    />
                    <label class="form-check-label" for="checkDefault">
                      I agree to the app's{" "}
                      <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
                      <Link href="/terms-and-conditions">
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>
                  <div className="text-center mt-3">
                    <button className="custom-btn continue-btn">Pay</button>
                  </div>
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
