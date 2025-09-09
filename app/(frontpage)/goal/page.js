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
              <div className="auth-cards goal">
                <p className="text-uppercase mb-2">Goal</p>
                <h3 className="mb-4">What is your goal?</h3>
                <div className="px-135">
                  <form>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="healthy"
                        className="d-none"
                        name="goal"
                      />
                      <label htmlFor="healthy">Be healthy?</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="confident"
                        className="d-none"
                        name="goal"
                      />
                      <label htmlFor="confident">Be confident?</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="clothes"
                        className="d-none"
                        name="goal"
                      />
                      <label htmlFor="clothes">Look good in clothes?</label>
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
        </div>
      </section>
    </>
  );
}

export default page;
