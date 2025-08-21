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
                <p className="text-uppercase mb-5">Reaching your Goals</p>
                <h3 className="mb-4">
                  What's preventing you from <br /> achieving your goals?
                </h3>
                <div className="px-135">
                  <form>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Absence"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Absence">Absence of regularity</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Unhealthy"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Unhealthy">Unhealthy eating habits</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Lack"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Lack">Lack of motivation</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="busy"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="busy">Too busy</label>
                    </div>
                    <div className="text-center mt-3">
                      <Link
                        href="/preferred-diet"
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
            <span>14/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
