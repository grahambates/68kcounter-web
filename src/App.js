import React, { useEffect, useState, useCallback, memo } from "react";
import process, { calculateTotals, lengthLevel, timingLevel } from "68kcounter";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [processed, setProcessed] = useState();
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectionHover, setSelectionHover] = useState(null);
  const [selectionTotals, setSelectionTotals] = useState(null);
  const [totals, setTotals] = useState(null);

  const hasSelection = selectionStart !== null && selectionEnd !== null;
  const isSelecting = selectionStart !== null && selectionEnd === null;

  useEffect(() => {
    const totals = processed ? calculateTotals(processed) : null;
    setTotals(totals);
  }, [processed]);

  useEffect(() => {
    if (!hasSelection || !processed) {
      setSelectionTotals(null);
      return;
    }
    const range = processed.slice(selectionStart, selectionEnd + 1);
    setSelectionTotals(calculateTotals(range));
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
          <div className="help">
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
                Click to select a range of lines and calculate totals for a
                section of code.
              </li>
            </ul>
          </div>

          {totals && (
            <div className="totals">
              <div>
                <strong>Total length: </strong>
                <Words words={totals.words} /> words ({totals.words * 2} bytes)
              </div>
              {/* {totals.isRange ? (
                <>
                  <strong>Total cycles: </strong>
                  Min: <Timings timings={totals.min} />
                  Max: <Timings timings={totals.max} />
                </>
              ) : (
                <Timings timings={totals.min} />
              )} */}
            </div>
          )}

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
                totals={i === selectionStart ? selectionTotals : null}
                isSelected={isSelected}
                onHover={setSelectionHover}
                onClick={handleSelect}
              />
            );
          })}
        </>
      )}
      <div className="footer">
        <span>&copy; 2021 Graham Bates</span>
      </div>
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
  const className = color ? lengthLevel(words).toLowerCase() : "";
  return (
    <span
      className={className}
      title={words + (words > 1 ? " words" : " word")}
    >
      {words}
    </span>
  );
}

function Timings({ timings, color }) {
  const { clock, read, write } = timings;
  const className = color ? timingLevel(timings).toLowerCase() : "";
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
    <div className="lineTotals">
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
