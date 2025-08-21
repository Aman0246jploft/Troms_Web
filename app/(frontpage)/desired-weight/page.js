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
              <div className="auth-cards weight">
                <p className="text-uppercase mb-5">Desired Weight</p>
                <h3 className="mb-2">What is desired weight?</h3>
                <form>
                  <div className="weight-switch">
                    <span>Imperial</span>
                    <label className="switch">
                      <input type="checkbox" className="d-none" />
                      <span className="slider"></span>
                    </label>
                    <span>Metric</span>
                  </div>
                  <div className="weight-input">
                    <div className="height-bx-main">
                      <p className="text-center mb-2">Weight</p>
                      <div className="height-bx lbs-weight">
                        <div className="height-input border-0">
                          <input type="number" min="0" value="170" />
                          <span>lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <Link
                      href="/workout-location"
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
        <div className="auth-bttm">
          <p>
            <span>8/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
