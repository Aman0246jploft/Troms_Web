"use client";
import React, { useState, useRef, useEffect } from "react";

const WeightPicker = () => {
  const minWeight = 60;
  const maxWeight = 100;
  const [weight, setWeight] = useState(75);
  const [dragging, setDragging] = useState(false);

  const pickerRef = useRef(null);

  // Calculate the number of ticks between min and max
  const totalTicks = (maxWeight - minWeight) * 4; // quarter steps (0.25)

  // Convert weight to position in pixels within the slider
  const getPosFromWeight = (weightVal) => {
    const pickerWidth = pickerRef.current ? pickerRef.current.clientWidth : 0;
    const relativeWeight = (weightVal - minWeight) / (maxWeight - minWeight);
    return relativeWeight * pickerWidth;
  };

  // Convert position in pixels to weight value
  const getWeightFromPos = (pos) => {
    const pickerWidth = pickerRef.current ? pickerRef.current.clientWidth : 0;
    const relativePos = Math.min(Math.max(pos, 0), pickerWidth) / pickerWidth;
    // Round to nearest 0.25 Kg
    return (
      Math.round((minWeight + relativePos * (maxWeight - minWeight)) * 4) / 4
    );
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    moveHandle(e);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    moveHandle(e);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const moveHandle = (e) => {
    if (!pickerRef.current) return;
    const bounds = pickerRef.current.getBoundingClientRect();
    let posX = e.clientX - bounds.left;
    let newWeight = getWeightFromPos(posX);
    setWeight(newWeight);
  };

  // Keyboard navigation support
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setWeight((w) => Math.max(minWeight, Math.round((w - 0.25) * 4) / 4));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setWeight((w) => Math.min(maxWeight, Math.round((w + 0.25) * 4) / 4));
    }
  };

  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    // 4 ticks per number: 0.25 divisions; long ticks every 1 Kg
    for (let i = 0; i <= totalTicks; i++) {
      const tickWeight = minWeight + i * 0.25;
      const isLongTick = i % 4 === 0;
      const isMediumTick = i % 2 === 0 && !isLongTick;
      ticks.push(
        <div
          key={i}
          className={`tick ${
            isLongTick ? "long" : isMediumTick ? "medium" : "short"
          }`}
          style={{ left: `${(i / totalTicks) * 100}%` }}
        />
      );
    }
    return ticks;
  };

  // Render the numbers visible above the slider (two left, current, two right)
  const renderNumbers = () => {
    const numbers = [];
    for (let offset = -2; offset <= 2; offset++) {
      let number = Math.round((weight + offset) * 1) / 1; // Keep integer for display
      // Only display numbers inside range
      if (number >= minWeight && number <= maxWeight) {
        let className = "number";
        if (offset === 0) className += " current";
        else if (Math.abs(offset) === 1) className += " near";
        else className += " far";
        numbers.push(
          <span
            key={number}
            className={className}
            style={{ left: `${50 + offset * 25}%` }}
          >
            {number}
          </span>
        );
      }
    }
    return numbers;
  };

  return (
    <div className="weight-picker-container">
      <div className="numbers-wrapper">{renderNumbers()}</div>

      <div
        className="slider"
        ref={pickerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={minWeight}
        aria-valuemax={maxWeight}
        aria-valuenow={weight}
        aria-label="Weight picker"
      >
        {/* Tick marks */}
        <div className="ticks-wrapper">{renderTicks()}</div>

        {/* Middle highlight line */}
        <div className="middle-line" />

        {/* Selector pointer */}
        <div
          className="pointer"
          style={{
            left: `${((weight - minWeight) / (maxWeight - minWeight)) * 100}%`,
          }}
        />
        {/* Bottom triangle */}
        <span
          className="bottom-triangle"
          style={{
            left: `${((weight - minWeight) / (maxWeight - minWeight)) * 100}%`,
          }}
        />
      </div>

      <div className="selected-weight">
        <span className="weight-number">
          {weight.toFixed(weight % 1 === 0 ? 0 : 2)}
        </span>
        <span className="weight-unit">Kg</span>
      </div>
    </div>
  );
};

export default WeightPicker;
