"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";

const WeightPicker = ({ 
  weight: externalWeight = 75, 
  isMetric = true, 
  onChange,
  minWeight = null,
  maxWeight = null 
}) => {
  // Use provided min/max or default based on unit
  const defaultMinWeight = isMetric ? 30 : 60;
  const defaultMaxWeight = isMetric ? 300 : 600;
  
  const min = minWeight || defaultMinWeight;
  const max = maxWeight || defaultMaxWeight;
  
  const [weight, setWeight] = useState(externalWeight);
  // const [dragging, setDragging] = useState(false);

  const draggingRef = useRef(false);

  const pickerRef = useRef(null);

  // Update internal state when external weight changes
  useEffect(() => {
    setWeight(externalWeight);
  }, [externalWeight]);

  // Cleanup function to remove event listeners
  useEffect(() => {
    return () => {
      // Cleanup any remaining event listeners
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handlePointerUp);
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
   draggingRef.current = true;
    moveHandle(e);
    console.log("Pointer down at", e.clientX);
    
    // Add global listeners for smooth dragging
    document.addEventListener('pointermove', handlePointerMove, { passive: false });
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handlePointerUp);
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
draggingRef.current = true;
    
    // Remove global listeners
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handlePointerUp);
  };

  const moveHandle = (e) => {
    if (!pickerRef.current) return;
    const bounds = pickerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    let posX = clientX - bounds.left;
    let newWeight = getWeightFromPos(posX);
    
    // Ensure weight is within bounds and round to reasonable precision
    newWeight = Math.max(min, Math.min(max, newWeight));
    newWeight = Math.round(newWeight * 4) / 4; // Round to nearest 0.25
    
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

  // Generate tick marks aligned with numbers using relative positioning - memoized for performance  
  const tickMarks = useMemo(() => {
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

  // Render the numbers visible above the slider with proper spacing
  const renderNumbers = () => {
    const numbers = [];
    for (let offset = -2; offset <= 2; offset++) {
      let number = Math.round(weight + offset); // Get integer weight values
      // Only display numbers inside range
      if (number >= min && number <= max) {
        // Use relative positioning for better spacing (center at 50% with 20% intervals)
        const position = 50 + (offset * 20);
        
        let className = "number";
        if (offset === 0) className += " current";
        else if (Math.abs(offset) === 1) className += " near";
        else className += " far";
        numbers.push(
          <span
            key={`${number}-${offset}`}
            className={className}
            style={{ left: `${position}%` }}
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
        onTouchStart={handlePointerDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={weight}
        aria-label="Weight picker"
        style={{ touchAction: 'none' }}
      >
        {/* Tick marks */}
        <div className="ticks-wrapper">{tickMarks}</div>

        {/* Middle highlight line */}
        <div className="middle-line" />

        {/* Selector pointer */}
        <div
          className="pointer"
          style={{
            left: `calc(${((weight - min) / (max - min)) * 100}% - 1.5px)`,
          }}
        />
        {/* Bottom triangle */}
        <span
          className="bottom-triangle"
          style={{
            left: `calc(${((weight - min) / (max - min)) * 100}% - 1.5px)`,
          }}
        />
      </div>

      <div className="selected-weight">
        <span className="weight-number">
          {weight % 1 === 0 ? weight.toString() : weight.toFixed(1)}
        </span>
        <span className="weight-unit">{isMetric ? 'kg' : 'lbs'}</span>
      </div>
    </div>
  );
};

export default WeightPicker;
