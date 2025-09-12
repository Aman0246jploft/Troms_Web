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
