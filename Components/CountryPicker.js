import { useState, useEffect, useRef } from "react";
import { apiService } from "../lib/api";

function CountryPicker({ onCountrySelect, selectedCountry, loading: externalLoading, isOpen, onToggle }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = isOpen !== undefined ? (value) => onToggle && onToggle(value ? 'country' : null) : setInternalOpen;
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (countries.length > 0) {
      const filtered = countries.filter(country =>
        country.countryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [countries, searchTerm]);

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

  // Auto-select first country if none is selected and countries are available
  // useEffect(() => {
  //   if (!selectedCountry && countries.length > 0 && onCountrySelect) {
  //     onCountrySelect(countries[0]);
  //   }
  // }, [countries, selectedCountry, onCountrySelect]);





useEffect(() => {
  if (!selectedCountry && countries.length > 0 && onCountrySelect) {
    const storedCountry = window.localStorage.getItem("country"); // get stored country

    let matchedCountry = null;

    if (storedCountry) {
      // find the index of the stored country
      const index = countries.findIndex(c => c.countryName === storedCountry);
      if (index !== -1) {
        matchedCountry = countries[index];
      }
    }

    // fallback to first country if no match
    if (!matchedCountry) {
      matchedCountry = countries[0];
    }

    // setSelectedCountry(matchedCountry);
    onCountrySelect(matchedCountry);
  }
}, [countries, selectedCountry, onCountrySelect]);






  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCountriesWithFlags();
      
      if (response.success && response.data) {
        // Filter out countries without flags and sort alphabetically
        const validCountries = response.data
          .filter(country => country.flagUrl && country.countryName)
          .sort((a, b) => a.countryName.localeCompare(b.countryName));
        
        setCountries(validCountries);
      } else {
        throw new Error(response.message || "Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load countries. Please try again.");
      // Fallback to basic countries list
      setCountries([
        { countryName: "United Arab Emirates", flagUrl: "https://flagcdn.com/48x36/ae.png", cities: [], isoCode: "AE" },
        { countryName: "India", flagUrl: "https://flagcdn.com/48x36/in.png", cities: [], isoCode: "IN" },
        { countryName: "United States", flagUrl: "https://flagcdn.com/48x36/us.png", cities: [], isoCode: "US" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (country) => {
    setOpen(false);
    setSearchTerm("");
    if (onCountrySelect) {
      onCountrySelect(country);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    setOpen(!open);
    if (!open) {
      setSearchTerm("");
    }
  };
  if (loading || externalLoading) {
    return (
      <div className="custom-select">
        <div className="selected">
          <span>Loading countries...</span>
              <span className="arrow">▼</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-select">
        <div className="selected" style={{color: '#dc3545'}}>
          <span>{error}</span>
              <span className="arrow">▼</span>
        </div>
      </div>
    );
  }

  const displayCountry = selectedCountry || (countries.length > 0 ? countries[0] : null);

  return (
    <>
      <div className={`custom-select ${open ? "open" : ""}`} ref={dropdownRef}>
        {/* Selected */}
        <div className="selected" onClick={toggleDropdown}>
          {displayCountry ? (
            <>
              <img src={displayCountry.flagUrl} alt={displayCountry.countryName} />
              <span>{displayCountry.countryName}</span>
            </>
          ) : (
            <span>Select a country</span>
          )}
              <span className="arrow">▼</span>
        </div>

        {/* Dropdown Options */}
        {open && (
          <div className="dropdown-content">
            <div className="search-box" style={{ padding: "8px" }}>
              <input
                type="text"
                placeholder="Search countries..."
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
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <li key={country.isoCode || index} onClick={() => handleSelect(country)}>
                    <img src={country.flagUrl} alt={country.countryName} />
                    {country.countryName}
                  </li>
                ))
              ) : (
                <li style={{ padding: "8px", color: "#666", textAlign: "center" }}>
                  No countries found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default CountryPicker;