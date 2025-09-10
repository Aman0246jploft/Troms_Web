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
                <p className="text-uppercase mb-2">Shift</p>
                <h3 className="mb-4">When do you work?</h3>
                <form>
                  <div className="px-135">
                    <div className="custom-check budget-check">
                      <input
                        id="Day"
                        className="d-none"
                        type="radio"
                        name="shift"
                      />
                      <label htmlFor="Day" className="">
                        <img src="/images/low-icon.svg" alt="Day Shift" /> Day
                      </label>
                    </div>
                    <div className="custom-check budget-check">
                      <input
                        id="Night"
                        className="d-none"
                        type="radio"
                        name="shift"
                      />
                      <label htmlFor="Night" className="">
                        <img src="/images/medium-icon.svg" alt="Night Shift" />{" "}
                        Night
                      </label>
                    </div>
                    <div className="custom-check budget-check">
                      <input
                        id="Rotating"
                        className="d-none"
                        type="radio"
                        name="shift"
                      />
                      <label htmlFor="Rotating" className="">
                        <img
                          src="/images/high-icon.svg"
                          alt="Rotating shifts"
                        />{" "}
                        Rotating shifts
                      </label>
                    </div>
                    <div className="custom-check budget-check">
                      <input
                        id="Varies"
                        className="d-none"
                        type="radio"
                        name="shift"
                      />
                      <label htmlFor="Varies" className="">
                        <img src="/images/high-icon.svg" alt="Varies" /> Varies
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
