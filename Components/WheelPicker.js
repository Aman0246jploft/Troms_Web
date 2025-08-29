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

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 50 }, (_, i) => 1980 + i);

function WheelColumn({ items, selectedIndex, onSelectionChange }) {
  const containerRef = useRef(null);
  const itemHeight = 40;

  useEffect(() => {
    if (containerRef.current) {
      const scrollTop = selectedIndex * itemHeight;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / itemHeight);
      if (
        newIndex !== selectedIndex &&
        newIndex >= 0 &&
        newIndex < items.length
      ) {
        onSelectionChange(newIndex);
      }
    }
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

export default function WheelPicker() {
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedDay, setSelectedDay] = useState(25);
  const [selectedYear, setSelectedYear] = useState(20);

  return (
    <div className="wheel-picker">
      <WheelColumn
        items={months}
        selectedIndex={selectedMonth}
        onSelectionChange={setSelectedMonth}
      />
      <WheelColumn
        items={days}
        selectedIndex={selectedDay}
        onSelectionChange={setSelectedDay}
      />
      <WheelColumn
        items={years}
        selectedIndex={selectedYear}
        onSelectionChange={setSelectedYear}
      />
    </div>
  );
}
