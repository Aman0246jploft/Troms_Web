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
              <div className="auth-cards ">
                <p className="text-uppercase mb-2">Budget</p>
                <h3 className="mb-4">Select your preferred budget.</h3>
                <form>
                  <div className="px-135">
                    <div className="custom-check budget-check">
                      <input
                        id="low"
                        className="d-none"
                        type="radio"
                        name="budget"
                      />
                      <label htmlFor="low" className="">
                        <img src="/images/low-icon.svg" alt="Low Budget" /> Low
                      </label>
                    </div>
                    <div className="custom-check budget-check">
                      <input
                        id="Medium"
                        className="d-none"
                        type="radio"
                        name="budget"
                      />
                      <label htmlFor="Medium" className="">
                        <img
                          src="/images/medium-icon.svg"
                          alt="Medium Budget"
                        />{" "}
                        Medium
                      </label>
                    </div>
                    <div className="custom-check budget-check">
                      <input
                        id="high"
                        className="d-none"
                        type="radio"
                        name="budget"
                      />
                      <label htmlFor="high" className="">
                        <img src="/images/high-icon.svg" alt="High Budget" />{" "}
                        High
                      </label>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <button type="submit" className="custom-btn continue-btn">
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
