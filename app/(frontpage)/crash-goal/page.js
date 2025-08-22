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
                <p className="text-uppercase mb-5">Injuries</p>
                <h3 className="mb-4">
                  Do you have any past injuries <br /> or movement limitations?
                </h3>
                <div className="d-flex justify-content-center py-5">
                  <img src="/images/chart.svg" alt="Crash your goal" />
                </div>
                <div className="text-center mt-3">
                  <Link href="/approach" className="custom-btn continue-btn">
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>22/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
