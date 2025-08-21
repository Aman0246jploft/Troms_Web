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
                <p className="text-uppercase mb-5">Favourite Food</p>
                <h3 className="mb-4">
                  What's your favourite treat? <br /> We'll find a smart way to
                  fit it in
                </h3>
                <div className="food-card">
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="pizza" />
                    <label htmlFor="pizza">
                      🍕 Pizza{" "}
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Tacos" />
                    <label htmlFor="Tacos">
                      🌮 Tacos{" "}
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Burger" />
                    <label htmlFor="Burger">
                      🍔 Burger{" "}
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input
                      type="checkbox"
                      className="d-none"
                      id="FrenchFries"
                    />
                    <label htmlFor="FrenchFries">
                      🍟 French Fries{" "}
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input
                      type="checkbox"
                      className="d-none"
                      id="FriedChicken"
                    />
                    <label htmlFor="FriedChicken">
                      🍗 Fried Chicken{" "}
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Ramen" />
                    <label htmlFor="Ramen">
                      🍜 Ramen{" "}
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Salad" />
                    <label htmlFor="Salad">
                      🥗 Salad
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Pancakes" />
                    <label htmlFor="Pancakes">
                      🥞 Pancakes
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Chocolate" />
                    <label htmlFor="Chocolate">
                      🍫 Chocolate
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input
                      type="checkbox"
                      className="d-none"
                      id="Strawberries"
                    />
                    <label htmlFor="Strawberries">
                      🍓 Strawberries
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Donut" />
                    <label htmlFor="Donut">
                      🍩 Donut
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Sandwich" />
                    <label htmlFor="Sandwich">
                      🥪 Sandwich
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Cream" />
                    <label htmlFor="Cream">
                      🍦 Ice Cream
                      <button type="button">
                        <img src="/images/close.svg" />
                      </button>
                    </label>
                  </div>
                  <div className="food-bx">
                    <input type="checkbox" className="d-none" id="Watermelon" />
                    <label htmlFor="Watermelon">
                      🍉 Watermelon
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
                  <Link href="/cooking" className="custom-btn continue-btn">
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>16/</span> 25
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
