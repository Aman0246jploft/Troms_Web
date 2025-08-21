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
              <div className="auth-cards weight-goal">
                <p className="text-uppercase mb-5">Weight Goal</p>
                <h3 className="mb-2">What is your goal?</h3>
                <p>Adjusting Your Calorie Intake for Optimal Performance</p>
                <div className="px-135">
                  <form>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="lose"
                        name="weight-goal"
                        className="d-none"
                      />
                      <label htmlFor="lose">Lose Weight</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Maintain"
                        name="weight-goal"
                        className="d-none"
                      />
                      <label htmlFor="Maintain">Maintain</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Gain"
                        name="weight-goal"
                        className="d-none"
                      />
                      <label htmlFor="Gain">Gain Weight</label>
                    </div>
                    <div className="text-center mt-5">
                      <Link
                        href="/desired-weight"
                        className="custom-btn continue-btn"
                      >
                        Continue
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>7/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
