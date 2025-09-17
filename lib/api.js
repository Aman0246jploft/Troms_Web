const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== "string") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'API request failed');
      // }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth APIs
  async socialLogin(payload) {
    // Ensure required fields are present
    const requiredPayload = {
      email: payload.email,
      username: payload.username,
      platform: payload.platform,
      ...(payload.userInfoId && { userInfoId: payload.userInfoId }),
    };

    return this.request("/auth/social-login", {
      method: "POST",
      body: requiredPayload,
    });
  }

  async createUserInfo(payload) {
    return this.request("/users/create-user-info", {
      method: "POST",
      body: payload,
    });
  }

  // Equipment APIs
  async getEquipments() {
    return this.request("/workout/accesible-equipments");
  }

  // Food APIs
  async getCheatMeals() {
    return this.request("/food/cheat-meals-list");
  }

  async getAllergicFoodItems() {
    return this.request("/food/allergic-food-items-list");
  }

  async getDislikedFoodItems() {
    return this.request("/food/disliked-food-items-list");
  }

  // Injuries API
  async getInjuries() {
    return this.request("/workout/get-injuries-from-db");
  }

  // Health Conditions API
  async getHealthyConditions() {
    return this.request("/healthy-conditions");
  }
  //privacy-policy
  async privacyPolicy() {
    return this.request("/admin/privacy-policy");
  }

  //termsAndConditions
  async termsandconditions() {
    return this.request("/admin/terms-and-conditions");
  }

  // Subscription APIs
  async getSubscriptionPlans() {
    return this.request("/stripeWEB/get-subscription-plans");
  }

  async purchaseSubscription(priceId, paymentData) {
    console.log("paymentData", paymentData);
    return this.request(`/stripeWEB/purchase-subscription/${priceId}`, {
      method: "POST",
      body: paymentData,
    });
  }

  // Razorpay APIs - Using existing Stripe endpoints with Razorpay payment data
  async createRazorpayPaymentMethod(paymentData) {
    // Simulate payment method creation for compatibility with existing backend
    return {
      success: true,
      paymentMethod: {
        id: `pm_razorpay_${Date.now()}`, // Simulated payment method ID
        type: "card",
        ...paymentData,
      },
    };
  }

  async purchaseSubscriptionWithRazorpay(priceId, razorpayData) {
    // Use existing Stripe endpoint but with Razorpay payment data
    const paymentMethodData = {
      paymentMethodId: `pm_razorpay_${razorpayData.razorpay_payment_id}`,
      userInfoId: razorpayData.userInfoId,
      razorpayPaymentId: razorpayData.razorpay_payment_id,
      razorpayOrderId: razorpayData.razorpay_order_id,
      razorpaySignature: razorpayData.razorpay_signature,
    };

    return this.request(`/stripeWEB/purchase-subscription/${priceId}`, {
      method: "POST",
      body: paymentMethodData,
    });
  }

  // Countries API - Uses external API
  async getCountriesWithFlags() {
    try {
      // Fetch countries from external API
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const data = await response.json();

      if (!data.data) {
        throw new Error("Invalid response format");
      }

      // Complete country name to ISO code mapping
      const countryIsoMap = {
        Afghanistan: "af",
        Albania: "al",
        Algeria: "dz",
        Andorra: "ad",
        Angola: "ao",
        Anguilla: "ai",
        "Antigua and Barbuda": "ag",
        Argentina: "ar",
        Armenia: "am",
        Aruba: "aw",
        Australia: "au",
        Austria: "at",
        Azerbaijan: "az",
        Bahamas: "bs",
        Bahrain: "bh",
        Bangladesh: "bd",
        Barbados: "bb",
        Belarus: "by",
        Belgium: "be",
        Belize: "bz",
        Benin: "bj",
        Bermuda: "bm",
        Bhutan: "bt",
        Bolivia: "bo",
        "Bosnia and Herzegovina": "ba",
        Botswana: "bw",
        Brazil: "br",
        "British Indian Ocean Territory": "io",
        Brunei: "bn",
        Bulgaria: "bg",
        "Burkina Faso": "bf",
        Burundi: "bi",
        Cambodia: "kh",
        Cameroon: "cm",
        Canada: "ca",
        "Cape Verde": "cv",
        "Cayman Islands": "ky",
        "Central African Republic": "cf",
        Chad: "td",
        Chile: "cl",
        China: "cn",
        "Christmas Island": "cx",
        "Cocos (Keeling) Islands": "cc",
        Colombia: "co",
        Comoros: "km",
        Congo: "cg",
        "Cook Islands": "ck",
        "Costa Rica": "cr",
        Croatia: "hr",
        Cuba: "cu",
        Cyprus: "cy",
        "Czech Republic": "cz",
        Denmark: "dk",
        Djibouti: "dj",
        Dominica: "dm",
        "Dominican Republic": "do",
        Ecuador: "ec",
        Egypt: "eg",
        "El Salvador": "sv",
        "Equatorial Guinea": "gq",
        Eritrea: "er",
        Estonia: "ee",
        Ethiopia: "et",
        "Falkland Islands": "fk",
        "Faroe Islands": "fo",
        Fiji: "fj",
        Finland: "fi",
        France: "fr",
        "French Polynesia": "pf",
        Gabon: "ga",
        Gambia: "gm",
        Georgia: "ge",
        Germany: "de",
        Ghana: "gh",
        Gibraltar: "gi",
        Greece: "gr",
        Greenland: "gl",
        Grenada: "gd",
        Guadeloupe: "gp",
        Guam: "gu",
        Guatemala: "gt",
        Guernsey: "gg",
        Guinea: "gn",
        "Guinea-Bissau": "gw",
        Guyana: "gy",
        Haiti: "ht",
        "Heard Island and McDonald Islands": "hm",
        Honduras: "hn",
        "Hong Kong": "hk",
        Hungary: "hu",
        Iceland: "is",
        India: "in",
        Indonesia: "id",
        Iran: "ir",
        Iraq: "iq",
        Ireland: "ie",
        "Isle of Man": "im",
        Israel: "il",
        Italy: "it",
        "Ivory Coast": "ci",
        Jamaica: "jm",
        Japan: "jp",
        Jersey: "je",
        Jordan: "jo",
        Kazakhstan: "kz",
        Kenya: "ke",
        Kiribati: "ki",
        Kosovo: "xk",
        Kuwait: "kw",
        Kyrgyzstan: "kg",
        Laos: "la",
        Latvia: "lv",
        Lebanon: "lb",
        Lesotho: "ls",
        Liberia: "lr",
        Libya: "ly",
        Liechtenstein: "li",
        Lithuania: "lt",
        Luxembourg: "lu",
        Macau: "mo",
        Macedonia: "mk",
        Madagascar: "mg",
        Malawi: "mw",
        Malaysia: "my",
        Maldives: "mv",
        Mali: "ml",
        Malta: "mt",
        "Marshall Islands": "mh",
        Martinique: "mq",
        Mauritania: "mr",
        Mauritius: "mu",
        Mayotte: "yt",
        Mexico: "mx",
        Moldova: "md",
        Monaco: "mc",
        Mongolia: "mn",
        Montenegro: "me",
        Montserrat: "ms",
        Morocco: "ma",
        Mozambique: "mz",
        Myanmar: "mm",
        Namibia: "na",
        Nauru: "nr",
        Nepal: "np",
        Netherlands: "nl",
        "New Caledonia": "nc",
        "New Zealand": "nz",
        Nicaragua: "ni",
        Niger: "ne",
        Nigeria: "ng",
        Niue: "nu",
        "Norfolk Island": "nf",
        "North Korea": "kp",
        "Northern Mariana Islands": "mp",
        Norway: "no",
        Oman: "om",
        Pakistan: "pk",
        Palau: "pw",
        Panama: "pa",
        "Papua New Guinea": "pg",
        Paraguay: "py",
        Peru: "pe",
        Philippines: "ph",
        Pitcairn: "pn",
        Poland: "pl",
        Portugal: "pt",
        "Puerto Rico": "pr",
        Qatar: "qa",
        Réunion: "re",
        Romania: "ro",
        Russia: "ru",
        Rwanda: "rw",
        "Saint Kitts and Nevis": "kn",
        "Saint Lucia": "lc",
        "Saint Pierre and Miquelon": "pm",
        "Saint Vincent and the Grenadines": "vc",
        Samoa: "ws",
        "San Marino": "sm",
        "Sao Tome and Principe": "st",
        "Saudi Arabia": "sa",
        Senegal: "sn",
        Serbia: "rs",
        Seychelles: "sc",
        "Sierra Leone": "sl",
        Singapore: "sg",
        Slovakia: "sk",
        Slovenia: "si",
        "Solomon Islands": "sb",
        Somalia: "so",
        "South Africa": "za",
        "South Georgia and the South Sandwich Islands": "gs",
        "South Korea": "kr",
        Spain: "es",
        "Sri Lanka": "lk",
        Sudan: "sd",
        Suriname: "sr",
        Swaziland: "sz",
        Sweden: "se",
        Switzerland: "ch",
        Syria: "sy",
        Taiwan: "tw",
        Tanzania: "tz",
        Thailand: "th",
        "Timor-Leste": "tl",
        Togo: "tg",
        Tokelau: "tk",
        Tonga: "to",
        "Trinidad and Tobago": "tt",
        Tunisia: "tn",
        Turkey: "tr",
        Turkmenistan: "tm",
        "Turks and Caicos Islands": "tc",
        Uganda: "ug",
        Ukraine: "ua",
        "United Arab Emirates": "ae",
        "United Kingdom": "gb",
        "United States": "us",
        Uruguay: "uy",
        Uzbekistan: "uz",
        Vanuatu: "vu",
        "Vatican City State (Holy See)": "va",
        Venezuela: "ve",
        Vietnam: "vn",
        "Wallis and Futuna": "wf",
        Yemen: "ye",
        Zambia: "zm",
        Zimbabwe: "zw",
      };

      const result = data.data.map((item) => {
        // Normalize country name for better matching
        const normalizedCountry = item.country.trim();

        // Try exact match first
        let isoCode = countryIsoMap[normalizedCountry];

        // If no exact match, try partial matching for common variations
        if (!isoCode) {
          const countryLower = normalizedCountry.toLowerCase();

          // Handle common variations
          if (
            countryLower.includes("united states") ||
            countryLower.includes("usa")
          ) {
            isoCode = "us";
          } else if (
            countryLower.includes("united kingdom") ||
            countryLower.includes("uk")
          ) {
            isoCode = "gb";
          } else if (
            countryLower.includes("uae") ||
            countryLower.includes("emirates")
          ) {
            isoCode = "ae";
          } else {
            // Try to find partial match in our mapping
            for (const [country, code] of Object.entries(countryIsoMap)) {
              if (
                country.toLowerCase().includes(countryLower) ||
                countryLower.includes(country.toLowerCase())
              ) {
                isoCode = code;
                break;
              }
            }
          }
        }

        // Build flag URL if ISO code exists
        const flagUrl = isoCode
          ? `https://flagcdn.com/48x36/${isoCode.toLowerCase()}.png`
          : `https://flagcdn.com/48x36/xx.png`; // Default flag

        return {
          countryName: item.country,
          cities: item.cities || [],
          flagUrl,
          isoCode: isoCode || "xx",
        };
      });

      // Log first few countries for debugging (remove in production)
      console.log("Sample countries with flags:", result.slice(0, 5));

      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching countries:", error);
      return { success: false, message: "Failed to fetch countries", data: [] };
    }
  }

  // Get occupations
  async getOccupations() {
    try {
      const response = await fetch(
        "http://stage.tasksplan.com:5010/api/v1/occupations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching occupations:", error);
      return {
        success: false,
        message: "Failed to fetch occupations",
        result: [],
      };
    }
  }
}

export const apiService = new ApiService();
export { BASE_URL };
