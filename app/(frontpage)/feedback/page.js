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
              <div className="auth-cards feedback">
                <p className="text-uppercase mb-5">Feedback</p>
                <h3 className="mb-2">
                  Have you tracked your calories <br /> with other apps?
                </h3>
                <form>
                  <div className="feedback-list">
                    <div className="feedback-bx">
                      <input
                        type="radio"
                        className="d-none"
                        id="unlike"
                        name="feedback"
                      />
                      <label htmlFor="unlike">
                        <div>
                          <img src="/images/unlike.svg" alt="Unlike" />
                          <span className="d-block">No</span>
                        </div>
                      </label>
                    </div>
                    <div className="feedback-bx">
                      <input
                        type="radio"
                        className="d-none"
                        id="like"
                        name="feedback"
                      />
                      <label htmlFor="like">
                        <div>
                          <img src="/images/like.svg" alt="Like" />
                          <span className="d-block">Yes</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/weight" className="custom-btn continue-btn">
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
            <span>5/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
