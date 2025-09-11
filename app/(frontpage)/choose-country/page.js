"use client"; // add this if you’re using Next.js 13+ with app router
import CountryPicker from "../../../Components/CountryPicker";
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
              <div className="auth-cards health-conditions">
                <p className="text-uppercase mb-2">Choose a country</p>
                <h3 className="mb-4">
                  Choose a country and city to see foods that match your
                  location.
                </h3>
                <div className="px-135">
                  <form>
                    <div className="custom-frm-bx">
                      <CountryPicker />
                    </div>
                    <div className="custom-frm-bx">
                      <select className="form-select">
                        <option>Select City</option>
                      </select>
                    </div>
                    <div className="text-center mt-3">
                      <button type="submit" className="custom-btn continue-btn">
                        Continue
                      </button>
                    </div>
                  </form>
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
