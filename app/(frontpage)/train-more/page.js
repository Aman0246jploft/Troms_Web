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
                <p className="text-uppercase mb-2">train more than</p>
                <h3 className="mb-4">Do you train more than once a day? </h3>
                <form>
                  <div className="px-135">
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="yes"
                        className="d-none"
                        name="gym"
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="no"
                        className="d-none"
                        name="gym"
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  <h5 className="text-center mt-3">
                    Selection of specific days
                  </h5>
                  <ul className="days-list">
                    <li className="days-list-item">
                      <input
                        type="radio"
                        name="select-days"
                        id="mon"
                        className="d-none"
                      />
                      <label htmlFor="mon">
                        <span>Sep 1 </span>
                        Mon
                      </label>
                    </li>
                    <li className="days-list-item">
                      <input
                        type="radio"
                        name="select-days"
                        id="Tue"
                        className="d-none"
                      />
                      <label htmlFor="Tue">
                        <span>Sep 2 </span>
                        Tue
                      </label>
                    </li>
                    <li className="days-list-item">
                      <input
                        type="radio"
                        name="select-days"
                        id="Wed"
                        className="d-none"
                      />
                      <label htmlFor="Wed">
                        <span>Sep 3 </span>
                        Wed
                      </label>
                    </li>
                    <li className="days-list-item">
                      <input
                        type="radio"
                        name="select-days"
                        id="Thu"
                        className="d-none"
                      />
                      <label htmlFor="Thu">
                        <span>Sep 4 </span>
                        Thu
                      </label>
                    </li>
                    <li className="days-list-item">
                      <input
                        type="radio"
                        name="select-days"
                        id="Fri"
                        className="d-none"
                      />
                      <label htmlFor="Fri">
                        <span>Sep 5 </span>
                        Fri
                      </label>
                    </li>
                    <li className="days-list-item">
                      <input
                        type="radio"
                        name="select-days"
                        id="Sat"
                        className="d-none"
                      />
                      <label htmlFor="Sat">
                        <span>Sep 6 </span>
                        Sat
                      </label>
                    </li>
                  </ul>
                </form>
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
