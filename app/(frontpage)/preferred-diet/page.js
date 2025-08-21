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
                <p className="text-uppercase mb-5">Preferred Diet</p>
                <h3 className="mb-4">Do you have a preferred diet?</h3>
                <div className="px-135">
                  <form>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Anything"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Anything">Anything</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Keto"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Keto">Keto</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Mediterranean"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Mediterranean">Mediterranean</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Paleo"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Paleo">Paleo</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Vegan"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Vegan">Vegan</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Vegetarian"
                        name="achieving-goal"
                        className="d-none"
                      />
                      <label htmlFor="Vegetarian">Vegetarian</label>
                    </div>
                    <div className="text-center mt-3">
                      <Link
                        href="/favorite-food"
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
            <span>15/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
