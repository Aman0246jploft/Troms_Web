"use client";
import React, { useState, useRef, useEffect } from "react";

const DesiredWeightPicker = ({
  weight: externalWeight = 75,
  isMetric = true,
  onChange,
  minWeight = null,
  maxWeight = null,
  currentWeight = null,
  weightGoal = null,
  currentWeightUnit = null,
}) => {
  // Use provided min/max or default based on unit
  const defaultMinWeight = isMetric ? 30 : 60;
  const defaultMaxWeight = isMetric ? 300 : 600;

  const min = minWeight || defaultMinWeight;
  const max = maxWeight || defaultMaxWeight;

  const [weight, setWeight] = useState(externalWeight);
  const [dragging, setDragging] = useState(false);

  const pickerRef = useRef(null);

  // Update internal state when external weight changes
  useEffect(() => {
    setWeight(externalWeight);
  }, [externalWeight]);

  // Cleanup function to remove event listeners
  useEffect(() => {
    return () => {
      // Cleanup any remaining event listeners
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handlePointerUp);
    };
  }, []);

  // Calculate the number of ticks between min and max
  const totalTicks = (max - min) * 4; // quarter steps (0.25)

  // Convert weight to position in pixels within the slider
  const getPosFromWeight = (weightVal) => {
    const pickerWidth = pickerRef.current ? pickerRef.current.clientWidth : 0;
    const relativeWeight = (weightVal - min) / (max - min);
    return relativeWeight * pickerWidth;
  };

  // Convert position in pixels to weight value
  const getWeightFromPos = (pos) => {
    const pickerWidth = pickerRef.current ? pickerRef.current.clientWidth : 0;
    const relativePos = Math.min(Math.max(pos, 0), pickerWidth) / pickerWidth;
    // Round to nearest 0.25
    return Math.round((min + relativePos * (max - min)) * 4) / 4;
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    moveHandle(e);

    // Add global listeners for smooth dragging
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    moveHandle(e);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    moveHandle(e.touches[0]);
  };

  const handlePointerUp = () => {
    setDragging(false);

    // Remove global listeners
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handlePointerUp);
  };

  const moveHandle = (e) => {
    if (!pickerRef.current) return;
    const bounds = pickerRef.current.getBoundingClientRect();
    const clientX =
      e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    let posX = clientX - bounds.left;
    let newWeight = getWeightFromPos(posX);

    // Ensure weight is within bounds
    newWeight = Math.max(min, Math.min(max, newWeight));

    setWeight(newWeight);
    if (onChange) onChange(newWeight);
  };

  // Keyboard navigation support
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const newWeight = Math.max(min, Math.round((weight - 0.25) * 4) / 4);
      setWeight(newWeight);
      if (onChange) onChange(newWeight);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const newWeight = Math.min(max, Math.round((weight + 0.25) * 4) / 4);
      setWeight(newWeight);
      if (onChange) onChange(newWeight);
    }
  };

  // Calculate weight difference and percentage
  const calculateWeightStats = () => {
    if (!currentWeight || !weightGoal) {
      return { difference: 0, percentage: 0, show: false };
    }

    // Convert current weight to display unit for consistent calculation
    let currentWeightInDisplayUnit = currentWeight;
    if (currentWeightUnit === 'kg' && !isMetric) {
      // Convert kg to lbs
      currentWeightInDisplayUnit = currentWeight / 0.453592;
    } else if (currentWeightUnit === 'lbs' && isMetric) {
      // Convert lbs to kg
      currentWeightInDisplayUnit = currentWeight * 0.453592;
    }

    const difference = Math.abs(weight - currentWeightInDisplayUnit);
    const percentage = currentWeightInDisplayUnit > 0 ? (difference / currentWeightInDisplayUnit) * 100 : 0;

    return {
      difference: Math.round(difference * 10) / 10,
      percentage: Math.round(percentage * 10) / 10,
      show: difference > 0 && weightGoal !== 'MAINTAIN',
      isLoss: weight < currentWeightInDisplayUnit,
      isGain: weight > currentWeightInDisplayUnit
    };
  };

  const getWeightChangeText = () => {
    const stats = calculateWeightStats();
    
    if (!stats.show) return null;

    const unit = isMetric ? 'Kg' : 'lbs';
    let difficultyText = '';
    let actionText = '';

    if (stats.isLoss) {
      actionText = 'lose';
      // Determine difficulty based on percentage
      if (stats.percentage >= 15) {
        difficultyText = 'Very hard to';
      } else if (stats.percentage >= 10) {
        difficultyText = 'Hard to';
      } else if (stats.percentage >= 5) {
        difficultyText = 'Moderate to';
      } else {
        difficultyText = 'Easy to';
      }
    } else if (stats.isGain) {
      actionText = 'gain';
      // Determine difficulty for weight gain
      if (stats.percentage >= 10) {
        difficultyText = 'Challenging to';
      } else if (stats.percentage >= 5) {
        difficultyText = 'Moderate to';
      } else {
        difficultyText = 'Easy to';
      }
    }

    return {
      primaryText: `${difficultyText} ${actionText}`,
      weightText: `${stats.difference} ${unit}`,
      secondaryText: `You will ${actionText} ${stats.percentage}% of body weight!`
    };
  };

  // Generate tick marks
  const renderTicks = () => {
    const ticks = [];
    // 4 ticks per number: 0.25 divisions; long ticks every 1 unit
    for (let i = 0; i <= totalTicks; i++) {
      const tickWeight = min + i * 0.25;
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
      if (number >= min && number <= max) {
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
    <>
      <div className="weight-picker-container">
        <div className="numbers-wrapper">{renderNumbers()}</div>

        <div
          className="slider"
          ref={pickerRef}
          onPointerDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={weight}
          aria-label="Weight picker"
          style={{ touchAction: "none" }}
        >
          {/* Tick marks */}
          <div className="ticks-wrapper">{renderTicks()}</div>

          {/* Middle highlight line */}
          <div className="middle-line" />

          {/* Selector pointer */}
          <div
            className="pointer"
            style={{
              left: `${((weight - min) / (max - min)) * 100}%`,
            }}
          />
          {/* Bottom triangle */}
          <span
            className="bottom-triangle"
            style={{
              left: `${((weight - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
        {(() => {
          const weightChangeText = getWeightChangeText();
          return weightChangeText ? (
            <div className="desired-lose-bx">
              <h5>
                {weightChangeText.primaryText} - <span>{weightChangeText.weightText}</span>
              </h5>
              <h6>{weightChangeText.secondaryText}</h6>
            </div>
          ) : null;
        })()}

        <div className="selected-weight">
          <span className="weight-number">
            {weight.toFixed(weight % 1 === 0 ? 0 : 2)}
          </span>
          <span className="weight-unit">{isMetric ? "Kg" : "lbs"}</span>
        </div>
      </div>
    </>
  );
};

export default DesiredWeightPicker;
