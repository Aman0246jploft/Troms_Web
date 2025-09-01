"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Helper conversions
function cmToFeetInches(cm) {
  const totalIn = cm / 2.54;
  const feet = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn - feet * 12);
  return { feet, inches };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function HeightPicker({
  minCm = 120,
  maxCm = 220,
  step = 1,
  defaultValueCm = 165,
  onChange,
}) {
  const [unit, setUnit] = useState("metric"); // "metric" | "imperial"
  const [valueCm, setValueCm] = useState(clamp(defaultValueCm, minCm, maxCm));
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const labelsRef = useRef(null);

  // Visual constants
  const PX_PER_CM = 8; // distance between ticks (1 cm) in px
  const [wrapperHeight, setWrapperHeight] = useState(260);

  // Build ticks and label stops (labels every 5cm, major every 10cm)
  const ticks = useMemo(() => {
    const out = [];
    for (let v = minCm; v <= maxCm; v += 1) {
      const isMajor10 = v % 10 === 0;
      const isMid5 = !isMajor10 && v % 5 === 0;
      out.push({
        v,
        type: isMajor10 ? "major" : isMid5 ? "mid" : "minor",
      });
    }
    return out;
  }, [minCm, maxCm]);

  const labelValues = useMemo(() => {
    const out = [];
    for (let v = minCm; v <= maxCm; v += 5) out.push(v);
    return out;
  }, [minCm, maxCm]);

  // Position list so that current value aligns with center line
  const translateY = useMemo(() => {
    // centerY - positionOfValue
    return wrapperHeight / 2 - (valueCm - minCm) * PX_PER_CM;
  }, [valueCm, wrapperHeight, minCm]);

  // Resize observer to keep wrapperHeight accurate
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setWrapperHeight(e.contentRect.height);
      }
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // Drag logic
  const dragState = useRef({ dragging: false, startY: 0, startValue: 0 });

  const onPointerDown = (e) => {
    e.preventDefault();
    dragState.current = {
      dragging: true,
      startY: e.clientY ?? e.touches?.[0]?.clientY ?? 0,
      startValue: valueCm,
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dy = y - dragState.current.startY;
    const deltaCm = -dy / PX_PER_CM;
    const raw = dragState.current.startValue + deltaCm;
    const rounded = Math.round(raw / step) * step;
    const newValue = clamp(rounded, minCm, maxCm);
    setValueCm(newValue);
    if (onChange) onChange(newValue);
  };

  const onPointerUp = () => {
    dragState.current.dragging = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  const onWheel = (e) => {
    e.preventDefault();
    const deltaCm = e.deltaY / 100; // tune scroll sensitivity
    const next = Math.round((valueCm + deltaCm) / step) * step;
    const newValue = clamp(next, minCm, maxCm);
    setValueCm(newValue);
    if (onChange) onChange(newValue);
  };

  // Click nudge handlers
  const nudge = (dir) => {
    setValueCm((v) => {
      const newValue = clamp(v + dir * step, minCm, maxCm);
      if (onChange) onChange(newValue);
      return newValue;
    });
  };

  const displayValue = useMemo(() => {
    if (unit === "metric") {
      return { value: valueCm, unit: "cm" };
    }
    const { feet, inches } = cmToFeetInches(valueCm);
    return { value: `${feet}′ ${inches}″`, unit: "" };
  }, [unit, valueCm]);

  return (
    <div>
      {/* Unit Toggle */}
      <div className="height-switch">
        <span className="mutedLabel">Imperial</span>
        <div className="form-check form-switch m-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="unitSwitch"
            checked={unit === "metric"}
            onChange={(e) => setUnit(e.target.checked ? "metric" : "imperial")}
          />
        </div>
        <span className="mutedLabel">Metric</span>
      </div>

      {/* Current Value */}
      <div className="text-center mb-3">
        <span className="currentValue number">{displayValue.value}</span>
        <span className="currentValue unit">{displayValue.unit}</span>
      </div>

      {/* Ruler + Labels */}
      <div className="d-flex justify-content-center gap-3">
        {/* Left scrolling labels */}
        <div className="labelsWrapper" ref={labelsRef}>
          <div
            className="labelsScroller"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {labelValues.map((v) => {
              const isCurrent = v === Math.round(valueCm / 5) * 5;
              return (
                <div
                  key={`lbl-${v}`}
                  className={`label ${isCurrent ? "labelCurrent" : ""}`}
                  style={{ height: PX_PER_CM * 5 }}
                >
                  {v}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ruler */}
        <div
          ref={wrapperRef}
          className="rulerWrapper"
          onPointerDown={onPointerDown}
          onWheel={onWheel}
        >
          <div
            ref={listRef}
            className="rulerTrack"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {ticks.map(({ v, type }) => (
              <div
                key={v}
                className={`tick ${
                  type === "major"
                    ? "tickMajor"
                    : type === "mid"
                    ? "tickMid"
                    : "tickMinor"
                }`}
                style={{ height: PX_PER_CM }}
              >
                <span className="tickMark" />
              </div>
            ))}
          </div>

          {/* Center selection line */}
          <div className="centerLine" />
          {/* Right triangle pointer */}
          <div className="pointer" />
        </div>
      </div>
    </div>
  );
}
