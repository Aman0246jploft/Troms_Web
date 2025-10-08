"use client";

import { useRef, useEffect, useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function WheelColumn({ items, selectedIndex, onSelectionChange }) {
  const containerRef = useRef(null);
  const itemHeight = 40;
const scrollTimeoutRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const scrollTop = selectedIndex * itemHeight;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [selectedIndex]);

  // const handleScroll = () => {
  //   if (containerRef.current) {
  //     const scrollTop = containerRef.current.scrollTop;
  //     const newIndex = Math.round(scrollTop / itemHeight);
  //     if (
  //       newIndex !== selectedIndex &&
  //       newIndex >= 0 &&
  //       newIndex < items.length
  //     ) {
  //       onSelectionChange(newIndex);
  //     }
  //   }
  // };


const handleScroll = () => {
  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

  scrollTimeoutRef.current = setTimeout(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / itemHeight);

      // snap to nearest item
      containerRef.current.scrollTo({
        top: newIndex * itemHeight,
        behavior: "smooth",
      });

      if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < items.length) {
        onSelectionChange(newIndex);
      }
    }
  }, 100); // wait 100ms after scrolling stops
};

  return (
    <div className="wheel-column">
      <div
        className="wheel-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div className="wheel-padding"></div>
        {items.map((item, index) => (
          <div
            key={index}
            className={`wheel-item ${
              index === selectedIndex ? "selected" : ""
            }`}
          >
            {item}
          </div>
        ))}
        <div className="wheel-padding"></div>
      </div>
      <div className="wheel-highlight"></div>
    </div>
  );
}

export default function WheelPicker({ 
  initialMonth = 0, 
  initialDay = 0, 
  initialYear = 0,
  onChange,
  onMonthChange,
  onDayChange,
  onYearChange,
  // Height picker props
  mode = "date", // "date", "height", "weight"
  isMetric = true,
  initialHeight = 165,
  initialWeight = 75,
  onHeightChange,
  onWeightChange,
  onUnitChange
}) {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  
  // Height states
  const [selectedFeet, setSelectedFeet] = useState(5);
  const [selectedInches, setSelectedInches] = useState(5);
  const [selectedCm, setSelectedCm] = useState(165);
  
  // Weight states
  const [selectedKg, setSelectedKg] = useState(45);
  const [selectedLbs, setSelectedLbs] = useState(90);

  // Generate years (from current year - 100 to current year - 13)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 13; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  // Generate days based on selected month and year
  const generateDays = () => {
    const years = generateYears();
    if (selectedMonth === undefined || selectedYear === undefined || selectedYear >= years.length) {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }

    const year = years[selectedYear];
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = generateDays();
  const years = generateYears();

  // Height data generation
  const generateHeightData = () => {
    if (mode === "height") {
      if (isMetric) {
        return {
          columns: [Array.from({ length: 131 }, (_, i) => i + 120)], // 120cm to 250cm
          labels: ["cm"]
        };
      } else {
        return {
          columns: [
            Array.from({ length: 6 }, (_, i) => i + 3), // 3ft to 8ft
            Array.from({ length: 12 }, (_, i) => i) // 0 to 11 inches
          ],
          labels: ["ft", "in"]
        };
      }
    }
    return { columns: [], labels: [] };
  };

  // Weight data generation
  const generateWeightData = () => {
    if (mode === "weight") {
      if (isMetric) {
        return {
          columns: [Array.from({ length: 271 }, (_, i) => i + 30)], // 30kg to 300kg
          labels: ["kg"]
        };
      } else {
        return {
          columns: [Array.from({ length: 541 }, (_, i) => i + 60)], // 60lbs to 600lbs
          labels: ["lbs"]
        };
      }
    }
    return { columns: [], labels: [] };
  };

  const handleMonthChange = (index) => {
    setSelectedMonth(index);
    if (onMonthChange) onMonthChange(index);
    if (onChange) onChange({ month: index, day: selectedDay, year: selectedYear });
  };

  const handleDayChange = (index) => {
    setSelectedDay(index);
    if (onDayChange) onDayChange(index);
    if (onChange) onChange({ month: selectedMonth, day: index, year: selectedYear });
  };

  const handleYearChange = (index) => {
    setSelectedYear(index);
    if (onYearChange) onYearChange(index);
    if (onChange) onChange({ month: selectedMonth, day: selectedDay, year: index });
  };

  // Height handlers
  const handleHeightChange = (columnIndex, valueIndex) => {
    if (mode === "height") {
      if (isMetric) {
        setSelectedCm(valueIndex);
        const heightInCm = 120 + valueIndex;
        if (onHeightChange) onHeightChange(heightInCm);
      } else {
        if (columnIndex === 0) {
          setSelectedFeet(valueIndex);
          const feet = 3 + valueIndex;
          const inches = selectedInches;
          const totalInches = (feet * 12) + inches;
          const cm = Math.round(totalInches * 2.54);
          if (onHeightChange) onHeightChange(cm);
        } else {
          setSelectedInches(valueIndex);
          const feet = 3 + selectedFeet;
          const inches = valueIndex;
          const totalInches = (feet * 12) + inches;
          const cm = Math.round(totalInches * 2.54);
          if (onHeightChange) onHeightChange(cm);
        }
      }
    }
  };

  // Weight handlers
  const handleWeightChange = (columnIndex, valueIndex) => {
    if (mode === "weight") {
      if (isMetric) {
        setSelectedKg(valueIndex);
        const weightInKg = 30 + valueIndex;
        if (onWeightChange) onWeightChange(weightInKg);
      } else {
        setSelectedLbs(valueIndex);
        const weightInLbs = 60 + valueIndex;
        if (onWeightChange) onWeightChange(weightInLbs);
      }
    }
  };

  // Initialize height/weight values
  useEffect(() => {
    if (mode === "height" && initialHeight) {
      if (isMetric) {
        setSelectedCm(initialHeight - 120);
      } else {
        const totalInches = initialHeight / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        setSelectedFeet(feet - 3);
        setSelectedInches(inches);
      }
    } else if (mode === "weight" && initialWeight) {
      if (isMetric) {
        setSelectedKg(initialWeight - 30);
      } else {
        setSelectedLbs(initialWeight - 60);
      }
    }
  }, [mode, initialHeight, initialWeight, isMetric]);

  // Render appropriate columns based on mode
  const renderColumns = () => {
    if (mode === "date") {
      return (
        <>
          <WheelColumn
            items={months}
            selectedIndex={selectedMonth}
            onSelectionChange={handleMonthChange}
          />
          <WheelColumn
            items={days}
            selectedIndex={selectedDay}
            onSelectionChange={handleDayChange}
          />
          <WheelColumn
            items={years}
            selectedIndex={selectedYear}
            onSelectionChange={handleYearChange}
          />
        </>
      );
    } else if (mode === "height") {
      const heightData = generateHeightData();
      if (isMetric) {
        return (
          <WheelColumn
            items={heightData.columns[0]}
            selectedIndex={selectedCm}
            onSelectionChange={(index) => handleHeightChange(0, index)}
          />
        );
      } else {
        return (
          <>
            <WheelColumn
              items={heightData.columns[0]}
              selectedIndex={selectedFeet}
              onSelectionChange={(index) => handleHeightChange(0, index)}
            />
            <WheelColumn
              items={heightData.columns[1]}
              selectedIndex={selectedInches}
              onSelectionChange={(index) => handleHeightChange(1, index)}
            />
          </>
        );
      }
    } else if (mode === "weight") {
      const weightData = generateWeightData();
      return (
        <WheelColumn
          items={weightData.columns[0]}
          selectedIndex={isMetric ? selectedKg : selectedLbs}
          onSelectionChange={(index) => handleWeightChange(0, index)}
        />
      );
    }
    return null;
  };

  return (
    <div className="wheel-picker">
      {renderColumns()}
    </div>
  );
}