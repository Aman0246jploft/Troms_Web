 import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <>
      <footer className="theme-footer">
        <div className="container px-0">
          <div className="theme-footer-innr">
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6">
                <div className="ftr-abt">
                  <img src="/images/white-logo.svg" alt="logo" />
                  <p>
                    Track your daily routines, stay consistent, <br /> and turn
                    goals into Trom — all in one <br /> beautiful app.
                  </p>
                  <div className="follow">
                    <Link href="#" target="_blank">
                      <img src="/images/facebook.svg" alt="Facebook" />
                    </Link>
                    <Link href="#" target="_blank">
                      <img src="/images/instagram.svg" alt="Instagram" />
                    </Link>
                    <Link href="#" target="_blank">
                      <img src="/images/grn-x.svg" alt="X" />
                    </Link>
                    <Link href="#" target="_blank">
                      <img src="/images/youtube.svg" alt="YouTube" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6">
                <h4 className="ftr-title">Download our app</h4>
                <div className="ftr-download">
                  <Link href="#" target="_blank">
                    <img src="/images/app-store.svg" alt="App Store" />
                  </Link>
                  <Link href="#" target="_blank">
                    <img src="/images/play-store.svg" alt="Google Play" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12">
                <div className="ftr-touch">
                  <h4 className="ftr-title">Stay updated</h4>
                  <p>Subscribe for event updates & exclusive content.</p>
                  <form>
                    <div className="frm-bx mb-4">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                      />
                    </div>
                    <button type="button" className="custom-btn light-btn">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="theme-footer-copyright">
            <p>© 2025 Troms. All rights reserved.</p>
            <div>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
