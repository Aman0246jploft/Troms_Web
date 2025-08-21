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
                <p className="text-uppercase mb-5">Cooking</p>
                <h3 className="mb-5">How good are you at cooking?</h3>
                <div className="px-135">
                  <form>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Beginner"
                        name="cooking-skill"
                        className="d-none"
                      />
                      <label htmlFor="Beginner">Beginner</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Intermediate"
                        name="cooking-skill"
                        className="d-none"
                      />
                      <label htmlFor="Intermediate">Intermediate</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Advanced"
                        name="cooking-skill"
                        className="d-none"
                      />
                      <label htmlFor="Advanced">Advanced</label>
                    </div>
                    <div className="text-center mt-5">
                      <Link
                        href="/accomplish"
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
            <span>17/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
