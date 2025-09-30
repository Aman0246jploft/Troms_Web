"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";

const DesiredWeightPicker = ({
  weight: externalWeight = 75,
  isMetric = true,
  onChange,
  minWeight = null,
  maxWeight = null,
  currentWeight = null,
  weightGoal = null,
  currentWeightUnit = null,
  disabled = false,
}) => {
  // Use provided min/max or default based on unit
const defaultMinWeight = isMetric ? 35 : 77;  // Changed from 30 to 35 kg
const defaultMaxWeight = isMetric ? 317 : 699; 

  const min = minWeight !== null && minWeight !== undefined ? minWeight : defaultMinWeight;
  const max = maxWeight !== null && maxWeight !== undefined ? maxWeight : defaultMaxWeight;

  const [weight, setWeight] = useState(() => {
    // Ensure initial weight is within min/max range
    return Math.max(min, Math.min(max, externalWeight));
  });
  // const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);

  const pickerRef = useRef(null);

  // Update internal state when external weight changes
  useEffect(() => {
    const clampedWeight = Math.max(min, Math.min(max, externalWeight));
    setWeight(clampedWeight);
  }, [externalWeight, min, max]);

  // Clamp weight to min/max range when range changes
  useEffect(() => {
    if (weight < min || weight > max) {
      const clampedWeight = Math.max(min, Math.min(max, weight));
      setWeight(clampedWeight);
      if (onChange) onChange(clampedWeight);
    }
  }, [min, max, weight, onChange]);

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
    if (disabled) return; // Don't handle events when disabled
    e.preventDefault();
    draggingRef.current = true
    moveHandle(e);

    // Add global listeners for smooth dragging
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    moveHandle(e);
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    moveHandle(e.touches[0]);
  };

  const handlePointerUp = () => {
    draggingRef.current = true

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
    if (disabled) return; // Don't handle events when disabled
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
  // const renderTicks = () => {
  //   const ticks = [];
  //   // 4 ticks per number: 0.25 divisions; long ticks every 1 unit
  //   for (let i = 0; i <= totalTicks; i++) {
  //     const tickWeight = min + i * 0.25;
  //     const isLongTick = i % 4 === 0;
  //     const isMediumTick = i % 2 === 0 && !isLongTick;
  //     ticks.push(
  //       <div
  //         key={i}
  //         className={`tick ${isLongTick ? "long" : isMediumTick ? "medium" : "short"
  //           }`}
  //         style={{ left: `${(i / totalTicks) * 100}%` }}
  //       />
  //     );
  //   }
  //   return ticks;
  // };




    // Generate tick marks aligned with numbers using relative positioning - memoized for performance  
    const renderTicks = useMemo(() => {
      const ticks = [];
      
      // Generate major ticks aligned with the numbers (every whole number)
      for (let offset = -2; offset <= 2; offset++) {
        const tickWeight = Math.round(weight) + offset;
        
        // Skip if outside bounds
        if (tickWeight < min || tickWeight > max) continue;
        
        // Use same relative positioning as numbers for perfect alignment
        const position = 50 + (offset * 20);
        
        // Calculate opacity based on distance from current weight
        const distanceFromCurrent = Math.abs(offset);
        let opacity = 1;
        if (distanceFromCurrent > 0) {
          opacity = Math.max(0.4, 1 - distanceFromCurrent * 0.3);
        }
        
        // Add major tick for whole numbers
        ticks.push(
          <div
            key={`major-${tickWeight}`}
            className="tick long"
            style={{ 
              left: `${position}%`,
              opacity: opacity
            }}
          />
        );
        
        // Add minor ticks between whole numbers (0.25, 0.5, 0.75)
        if (offset < 2) { // Don't add after the last major tick
          for (let subOffset = 0.25; subOffset < 1; subOffset += 0.25) {
            const minorTickWeight = tickWeight + subOffset;
            if (minorTickWeight > max) continue;
            
            // Calculate minor tick position relative to major tick
            const minorPosition = position + (subOffset * 20); // 20% span between major ticks
            const isHalfTick = subOffset === 0.5; // 0.5 increment
            
            // Calculate minor tick opacity
            const minorDistance = Math.abs(offset + subOffset);
            let minorOpacity = 0.6;
            if (minorDistance > 0.5) {
              minorOpacity = Math.max(0.2, 0.6 - (minorDistance - 0.5) * 0.4);
            }
            
            ticks.push(
              <div
                key={`minor-${tickWeight}-${subOffset}`}
                className={`tick ${isHalfTick ? 'medium' : 'short'}`}
                style={{ 
                  left: `${minorPosition}%`,
                  opacity: minorOpacity
                }}
              />
            );
          }
        }
      }
      
      return ticks;
    }, [weight, min, max]); // Re-calculate when weight or bounds change
  

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
      <div className="weight-picker-container trm-wgt-picker">
        <div className="numbers-wrapper">{renderNumbers()}</div>

        <div
          className={`slider ${disabled ? 'disabled' : ''}`}
          ref={pickerRef}
          onPointerDown={disabled ? undefined : handlePointerDown}
          onTouchStart={disabled ? undefined : handlePointerDown}
          onKeyDown={disabled ? undefined : handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={weight}
          aria-label="Weight picker"
          aria-disabled={disabled}
          style={{
            touchAction: "none",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'grab'
          }}
        >
          {/* Tick marks */}
          <div className="ticks-wrapper">{renderTicks}</div>

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
