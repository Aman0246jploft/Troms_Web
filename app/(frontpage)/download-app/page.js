import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <section className="dowload-sec">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-12">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 col-sm-6">
              <div className="dowload-lft">
                <img src="/images/success.svg" />
                <h3>Payment Successful!</h3>
                <p>
                  Your transaction is complete - thank you for <br /> your
                  purchase!
                </p>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 col-sm-6">
              <div className="dowload-rgt">
                <img src="/images/work-img.png" />
                <h4>
                  Take charge of your health <br /> Download Troms Now
                </h4>
                <div className="dowload-rgt-btn">
                  <Link
                    href="https://apps.apple.com/ae/app/troms/id6747479780/"
                    target="_blank"
                  >
                    <img src="/images/app-store.svg" />
                  </Link>
                  {/* <Link
                    href="https://play.google.com/store/games?hl=en_IN&pli=1"
                    target="_blank"
                  >
                    <img src="/images/play-store.svg" />
                  </Link> */}
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
