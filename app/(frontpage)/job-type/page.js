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
                <p className="text-uppercase mb-2">Job Type</p>
                <h3 className="mb-4">What is your occupation?</h3>
                <div className="food-list">
                  <div className="food-card ">
                    <div className="food-bx">
                      <input type="checkbox" id="Desk" className="d-none" />
                      <label htmlFor="Desk">Office / Desk</label>
                    </div>
                    <div className="food-bx">
                      <input type="checkbox" id="Retail" className="d-none" />
                      <label htmlFor="Retail">Retail / Service</label>
                    </div>
                    <div className="food-bx">
                      <input type="checkbox" id="Delivery" className="d-none" />
                      <label htmlFor="Delivery">Driver / Delivery</label>
                    </div>

                    <div className="food-bx">
                      <input
                        type="checkbox"
                        id="Construction"
                        className="d-none"
                      />
                      <label htmlFor="Construction">Construction</label>
                    </div>
                    <div className="food-bx">
                      <input
                        type="checkbox"
                        id="Healthcare"
                        className="d-none"
                      />
                      <label htmlFor="Healthcare">Healthcare</label>
                    </div>
                    <div className="food-bx">
                      <input type="checkbox" id="Student" className="d-none" />
                      <label htmlFor="Student">Student</label>
                    </div>
                    <div className="food-bx">
                      <input type="checkbox" id="Parent" className="d-none" />
                      <label htmlFor="Parent">Parent / Care at home</label>
                    </div>
                    <div className="food-bx">
                      <input type="checkbox" id="Shift" className="d-none" />
                      <label htmlFor="Shift">Shift Worker</label>
                    </div>
                    <div className="food-bx">
                      <input type="checkbox" id="Other" className="d-none" />
                      <label htmlFor="Other">Other</label>
                    </div>
                  </div>
                </div>
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
