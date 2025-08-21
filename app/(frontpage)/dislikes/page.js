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
              <div className="auth-cards food">
                <p className="text-uppercase mb-5">Dislikes</p>
                <h3 className="mb-4">
                  Are there any ingredients <br /> you'd prefer to avoid?
                </h3>
                <div className="food-card px-135">
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="peanuts" />
                    <label htmlFor="peanuts">
                      peanuts
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="mushrooms" />
                    <label htmlFor="mushrooms">
                      mushrooms
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Lamb" />
                    <label htmlFor="Lamb">
                      Lamb
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Tomatoes" />
                    <label htmlFor="Tomatoes">
                      Tomatoes
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="tofu" />
                    <label htmlFor="tofu">
                      tofu
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                </div>
                <div className="custom-frm-bx mt-4 px-135">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="If other (please specify)"
                  />
                </div>
                <div className="text-center mt-3">
                  <Link href="/injuries" className="custom-btn continue-btn">
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>20/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
