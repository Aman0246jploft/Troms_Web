import { useState, useEffect, useRef } from "react";

function CityPicker({ cities, onCitySelect, selectedCity, disabled, loading: externalLoading, isOpen, onToggle }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = isOpen !== undefined ? (value) => onToggle && onToggle(value ? 'city' : null) : setInternalOpen;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const dropdownRef = useRef(null);

  // Filter cities based on search term
  useEffect(() => {
    if (cities.length > 0) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [cities, searchTerm]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearchTerm("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  // Auto-select first city if none is selected and cities are available
  useEffect(() => {
    if (!selectedCity && cities.length > 0 && onCitySelect && !disabled) {
      onCitySelect(cities[0]);
    }
  }, [cities, selectedCity, onCitySelect, disabled]);

  const handleSelect = (city) => {
    setOpen(false);
    setSearchTerm("");
    if (onCitySelect && !disabled) {
      onCitySelect(city);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setOpen(!open);
      if (!open) {
        setSearchTerm("");
      }
    }
  };

  if (externalLoading) {
    return (
      <div className="custom-select">
        <div className="selected">
          <span>Loading cities...</span>
          <span className="arrow">▼</span>
        </div>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="custom-select disabled">
        <div className="selected" style={{color: '#6c757d', cursor: 'not-allowed'}}>
          <span>
            {cities.length === 0 
              ? "No cities available" 
              : "Select a country first"
            }
          </span>
          <span className="arrow">▼</span>
        </div>
      </div>
    );
  }

  const displayCity = selectedCity || "";

  return (
    <>
      <div className={`custom-select ${open ? "open" : ""}`} ref={dropdownRef}>
        {/* Selected */}
        <div className="selected" onClick={toggleDropdown}>
          <span>{displayCity || "Select City"}</span>
          <span className="arrow">▼</span>
        </div>

        {/* Dropdown Options */}
        {open && (
          <div className="dropdown-content">
            <div className="search-box" style={{ padding: "8px" }}>
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
                className="form-control"
                style={{
                  height: "40px",
                  borderRadius: "50px",
                  color: "#000",
                  padding: "8px 15px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  background: "rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.08) inset, 0 4px 20px 0 rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(7.5px)",
                  width: "100%",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
            <ul className="options"
                style={{
                  maxHeight: "200px", // reduced to account for search box
                  overflowY: "auto",  // enable vertical scroll
                  margin: "0",
                  padding: "0"
                }}
            >
              {filteredCities.length > 0 ? (
                filteredCities.map((city, index) => (
                  <li key={index} onClick={() => handleSelect(city)}>
                    {city}
                  </li>
                ))
              ) : (
                <li style={{ padding: "8px", color: "#666", textAlign: "center" }}>
                  No cities found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default CityPicker;
