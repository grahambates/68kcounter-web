import React, { useEffect, useState, useCallback, memo } from "react";
import process from "68kcounter";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [processed, setProcessed] = useState();
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectionHover, setSelectionHover] = useState(null);
  const [totals, setTotals] = useState(null);

  const hasSelection = selectionStart !== null && selectionEnd !== null;
  const isSelecting = selectionStart !== null && selectionEnd === null;

  useEffect(() => {
    if (!hasSelection || !processed) {
      setTotals(null);
      return;
    }

    // Calculate totals
    let words = 0;
    const min = { clock: 0, read: 0, write: 0 };
    const max = { clock: 0, read: 0, write: 0 };
    let isRange = false;

    for (let i = selectionStart; i <= selectionEnd; i++) {
      if (processed[i].words) {
        words += processed[i].words;
      }
      const timing = processed[i].timings;
      if (!timing) {
        continue;
      }
      const isArray = timing.clock === undefined;
      if (isArray) {
        isRange = true;
      }

      const timings = isArray ? timing : [timing];
      const clocks = timings.map((n) => n.clock);
      const reads = timings.map((n) => n.read);
      const writes = timings.map((n) => n.write);
      min.clock += Math.min(...clocks);
      min.read += Math.min(...reads);
      min.write += Math.min(...writes);
      max.clock += Math.max(...clocks);
      max.read += Math.max(...reads);
      max.write += Math.max(...writes);
    }
    setTotals({ words, min, max, isRange });
  }, [selectionStart, selectionEnd, hasSelection, processed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code) {
      setProcessed(process(code));
    } else {
      setProcessed(null);
    }
  };

  const handleSelect = useCallback(
    (i) => {
      setSelectionHover(null);

      if (isSelecting) {
        // End selection:
        if (i === selectionStart) {
          // Cancel selection if clicks again on start row
          setSelectionStart(null);
          setSelectionEnd(null);
        } else if (i < selectionStart) {
          // Finish selection and swap start/end
          setSelectionEnd(selectionStart);
          setSelectionStart(i);
        } else {
          // Finish selection
          setSelectionEnd(i);
        }
      } else {
        // Start new selection
        setSelectionStart(i);
        setSelectionEnd(null);
      }
    },
    [setSelectionStart, setSelectionEnd, selectionStart, isSelecting]
  );

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>68000 counter</h1>
        <p>Analyses 68000 assembly source to profile resource and size data.</p>
        <p>
          CLI tool and JS lib available on{" "}
          <a href="https://github.com/grahambates/68kcounter">Github</a>.
        </p>
        <div>
          <textarea
            value={code}
            placeholder="Paste ASM source here"
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit">Analyse</button>
      </form>

      {processed && (
        <>
          <div class="help">
            <ul>
              <li>
                Data is shown in the left colum in the format:
                <br />
                <code>cycles(reads/writes) words</code>
              </li>
              <li>
                Multiple values shown for branching instructions: "branch
                taken", then "branch not taken"
              </li>
              <li>
                Select a range of lines to calculate totals for a section of
                code.
              </li>
            </ul>
          </div>
          {processed.map((l, i) => {
            const a = selectionStart;
            const b = hasSelection ? selectionEnd : selectionHover;
            const isSelected =
              a !== null &&
              b !== null &&
              i >= Math.min(a, b) &&
              i <= Math.max(a, b);

            return (
              <Line
                key={i + l.text}
                line={l}
                i={i}
                totals={i === selectionStart ? totals : null}
                isSelected={isSelected}
                onHover={setSelectionHover}
                onClick={handleSelect}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

const Line = memo(({ isSelected, onHover, onClick, line, i, totals }) => {
  return (
    <div
      className={"line " + (isSelected ? "selected" : "")}
      onClick={() => onClick(i)}
      onMouseEnter={() => onHover(i)}
    >
      {totals && <Totals totals={totals} />}
      <div className="info">
        {line.timings &&
          (line.timings.clock ? (
            <Timings timings={line.timings} color />
          ) : (
            line.timings.map((t, i) => <Timings timings={t} key={i} color />)
          ))}
        <Words words={line.words} color />
      </div>
      <span className="number">{i + 1}</span>
      <pre className="code">{line.text || " "}</pre>
    </div>
  );
});

function Words({ words, color }) {
  let className;
  if (color) {
    if (words > 2) {
      className = "high";
    } else if (words === 2) {
      className = "med";
    } else {
      className = "low";
    }
  }
  return (
    <span
      className={className}
      title={words + (words > 1 ? " words" : " word")}
    >
      {words}
    </span>
  );
}

function Timings({ timings: { clock, read, write }, color }) {
  let className;
  if (color) {
    if (clock > 30) {
      className = "vhigh";
    } else if (clock > 20) {
      className = "high";
    } else if (clock > 12) {
      className = "med";
    } else {
      className = "low";
    }
  }
  return (
    <span className={"timings " + className}>
      <span title={clock + " CPU clock cycles"}>{clock}</span>(
      <span title={read + " buffer read cycles"}>{read}</span>/
      <span title={write + " buffer write cycles"}>{write}</span>)
    </span>
  );
}

function Totals({ totals: { min, max, isRange, words } }) {
  return (
    <div className="totals">
      <strong>Total:</strong>{" "}
      {isRange ? (
        <>
          min: <Timings timings={min} />
          max: <Timings timings={max} />
        </>
      ) : (
        <Timings timings={min} />
      )}
      <Words words={words} />
    </div>
  );
}

export default App;
