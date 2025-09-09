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
              <div className="auth-cards health-conditions">
                <p className="text-uppercase mb-2">Health Conditions</p>
                <h3 className="mb-4">Common Health Conditions for Fitness</h3>
                {/* <div className="food-list">
                  <div className="food-card ">
                    <div className="food-bx">
                      <input type="checkbox" id="running" className="d-none" />
                      <label htmlFor="running">
                        Running
                        <button type="button">
                          <img alt="Remove" src="/images/close.svg" />
                        </button>
                      </label>
                    </div>
                  </div>
                </div> */}
                <div className="custom-frm-bx mt-4 px-135">
                  <input
                    className="form-control"
                    placeholder="If other (please specify)"
                    type="text"
                    defaultValue=""
                  />
                </div>
                <div className="text-center mt-3">
                  <button type="submit" className="custom-btn continue-btn">
                    Continue
                  </button>
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
