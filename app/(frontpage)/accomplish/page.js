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
                <p className="text-uppercase mb-3">Accomplish</p>
                <h3 className="mb-3">
                  What would you like <br /> to accomplish?
                </h3>
                <div className="px-135">
                  <form>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Stay"
                        name="Accomplish"
                        className="d-none"
                      />
                      <label htmlFor="Stay">Stay active daily</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="energy"
                        name="Accomplish"
                        className="d-none"
                      />
                      <label htmlFor="energy">Boost your energy</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="focus"
                        name="Accomplish"
                        className="d-none"
                      />
                      <label htmlFor="focus">Improve your focus</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="confidence"
                        name="Accomplish"
                        className="d-none"
                      />
                      <label htmlFor="confidence">Gain more confidence</label>
                    </div>
                    <div className="text-center mt-3">
                      <Link
                        href="/allergies"
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
            <span>18/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
