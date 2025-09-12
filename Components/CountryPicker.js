import { useState, useEffect } from "react";
import { apiService } from "../lib/api";

function CountryPicker({ onCountrySelect, selectedCountry, loading: externalLoading }) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

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
    if (onCountrySelect) {
      onCountrySelect(country);
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
      <div className={`custom-select ${open ? "open" : ""}`}>
        {/* Selected */}
        <div className="selected" onClick={() => setOpen(!open)}>
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
          <ul className="options">
            {countries.map((country, index) => (
              <li key={country.isoCode || index} onClick={() => handleSelect(country)}>
                <img src={country.flagUrl} alt={country.countryName} />
                {country.countryName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default CountryPicker;