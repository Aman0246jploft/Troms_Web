import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>
              <div className="auth-cards gender">
                <p className="text-uppercase mb-2">Results Troms</p>
                <h3 className="mb-2">
                  Double Your Weight Loss <br /> Results with Troms
                </h3>
                <div className="d-flex justify-content-center mt-3">
                  <img
                    src="/images/trom-img.svg"
                    alt="Results Troms"
                    className=""
                  />
                </div>
                <p>Troms makes it easy and holds accountable</p>

                <div className="text-center mt-4">
                  <Link
                    href="/achieve-goal"
                    className="custom-btn continue-btn"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>13/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
