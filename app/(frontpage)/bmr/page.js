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
              <div className="auth-cards">
                <h3 className="mb-4">
                  We're setting <br /> everything up for you
                </h3>
                <p>Applying BMR Formula</p>
                <div className="text-center mt-5 mb-5">
                  <img src="/images/loader.svg" alt="BMR Graph" />
                </div>

                {/* <div className="text-center mt-3">
                  <Link href="/bmr" className="custom-btn continue-btn">
                    Continue
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>24/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
