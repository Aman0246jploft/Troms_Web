"use client";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true); // add class
      } else {
        setScrolled(false); // remove class
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <header
        className={`theme-header fixed-top ${scrolled ? "sticky-header" : ""}`}
      >
        <Navbar expand="lg" className="custom-nav">
          <Navbar.Brand href="#home">
            <img src="/images/dark-logo.svg" alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link"> Features</Nav.Link>
              <Nav.Link href="#link"> How it works</Nav.Link>
              <Nav.Link href="#link"> About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
}

export default Header;
