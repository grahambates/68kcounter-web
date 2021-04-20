import React, { memo, useState } from "react";
import Timing from "./Timing";
import LineTotals from "./LineTotals";
import Words from "./Words";
import "./Line.css";
import { Line as LineType, Timing as TimingType, Totals } from "68kcounter";

export interface LineProps {
  isSelected: boolean;
  onHover: (index: number) => void;
  onClick: (index: number) => void;
  onClearSelection: () => void;
  line: LineType;
  index: number;
  totals: Totals | null;
}

const Line = memo<LineProps>(
  ({ isSelected, onHover, onClick, onClearSelection, line, index, totals }) => {
    const isMultiple = line.timings && line.timings.length > 1;
    const hasEa = line.calculation?.ea && line.calculation.ea[0] > 0;
    const hasMultiplier = line.calculation?.multiplier;
    const isCalculated = hasEa || hasMultiplier;
    const hasDetail = isCalculated || isMultiple;

    const [expanded, setExpanded] = useState(false);
    return (
      <>
        {totals && (
          <LineTotals totals={totals} onClearSelection={onClearSelection} />
        )}
        <div
          className={"Line " + (isSelected ? "selected" : "")}
          onClick={() => onClick(index)}
          onMouseEnter={() => onHover(index)}
        >
          <div className="Line__info">
            <div className="Line__infoItems">
              {hasDetail && (
                <div className="Line__toggleWrapper">
                  <button
                    className="Line__toggle"
                    onClick={(e) => {
                      setExpanded(!expanded);
                      e.stopPropagation();
                    }}
                  >
                    {expanded ? "-" : "+"}
                  </button>
                </div>
              )}
              {line.timings &&
                line.timings.map((t, i) => <Timing timing={t} key={i} color />)}
              {line.words && <Words words={line.words} color />}
            </div>
            {hasDetail && (
              <div className={"Line__detail" + (expanded ? " expanded" : "")}>
                <div className="Line__detailContent">
                  {isMultiple &&
                    line.timings?.map((t, i) => (
                      <div key={i}>
                        <span className="Line__detailLabel">
                          {multipleLabels[i]}:
                        </span>
                        {formatTiming(t)}
                      </div>
                    ))}
                  {(hasMultiplier || hasEa) && (
                    <div>
                      {formatTiming(
                        line.calculation!.base[0],
                        line.calculation!.multiplier
                      )}
                    </div>
                  )}
                  {hasMultiplier && (
                    <div>n = {line.calculation?.n ?? "unknown"}</div>
                  )}
                  {hasEa && (
                    <div>
                      <span className="Line__detailLabel">+ EA:</span>
                      {formatTiming(line.calculation!.ea!)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="Line__content">
            <span className="Line__number">{index + 1}</span>
            <pre className="Line__code">{line.text || " "}</pre>
          </div>
        </div>
      </>
    );
  }
);

Line.displayName = "Line";

const formatTiming = (timing: TimingType, multiplier?: TimingType) => {
  const strVals = timing.map((v) => String(v));

  if (multiplier) {
    for (const i in multiplier) {
      if (multiplier[i]) {
        strVals[i] += "+" + multiplier[i] + "n";
      }
    }
  }

  return `${strVals[0]}(${strVals[1]}/${strVals[2]})`;
};

const multipleLabels = ["Taken", "Not taken", "Expired"];

export default Line;
