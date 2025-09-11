import { useState } from "react";

const countries = [
  { code: "uae", name: "United Arab Emirates (UAE)", flag: "images/uae-flag.png" },
  { code: "india", name: "India", flag: "images/india-flag.png" },
  { code: "usa", name: "United States", flag: "images/usa-flag.png" },
  { code: "uk", name: "United Kingdom", flag: "images/uk-flag.png" },
  { code: "canada", name: "Canada", flag: "images/canada-flag.png" },
];

function CountryPicker() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);

  const handleSelect = (country) => {
    setSelected(country);
    setOpen(false);
  };
  return (
    <>
      <div className={`custom-select ${open ? "open" : ""}`}>
        {/* Selected */}
        <div className="selected" onClick={() => setOpen(!open)}>
          <img src={selected.flag} alt={selected.name} />
          <span>{selected.name}</span>
          <span className="arrow">▼</span>
        </div>

        {/* Dropdown Options */}
        {open && (
          <ul className="options">
            {countries.map((country) => (
              <li key={country.code} onClick={() => handleSelect(country)}>
                <img src={country.flag} alt={country.name} />
                {country.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default CountryPicker;
