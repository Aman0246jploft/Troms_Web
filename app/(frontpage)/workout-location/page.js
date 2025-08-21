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
              <div className="auth-cards gender">
                <p className="text-uppercase mb-5">Workout Location</p>
                <h3 className="mb-5">Choose your workout location</h3>
                <form>
                  <div className="gender-cards">
                    <div>
                      <input
                        type="radio"
                        id="male"
                        className="d-none"
                        name="location"
                        value="Home"
                      />
                      <label htmlFor="male">
                        <div className="gender-img">
                          <img src="/images/location-01.png" alt="Home" />
                        </div>
                        Home
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="Gym"
                        className="d-none"
                        name="location"
                        value="Gym"
                      />
                      <label htmlFor="Gym">
                        <div className="gender-img">
                          <img src="/images/location-02.png" alt="Gym" />
                        </div>
                        Gym
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="Outdoors"
                        className="d-none"
                        name="location"
                        value="Outdoors"
                      />
                      <label htmlFor="Outdoors">
                        <div className="gender-img">
                          <img src="/images/location-03.png" alt="Outdoors" />
                        </div>
                        Outdoors
                      </label>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/equipment" className="custom-btn continue-btn">
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
            <span>9/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
