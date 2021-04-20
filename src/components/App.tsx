import React, {
  FC,
  useEffect,
  useState,
  useCallback,
  FormEventHandler,
  useReducer,
} from "react";
import reducer, { defaultState } from "../reducer";
import "./App.css";
import Line from "./Line";
import Totals from "./Totals";

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [code, setCode] = useState("");
  const {
    lines,
    totals,
    selectionStart,
    selectionEnd,
    selectionHover,
    selectionTotals,
  } = state;

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "code", payload: code });
  };

  const clearSelection = useCallback(() => {
    dispatch({ type: "clear" });
  }, [dispatch]);

  const handleClick = useCallback(
    (i: number) => {
      dispatch({ type: "click", payload: i });
    },
    [dispatch]
  );

  const handleHover = useCallback(
    (i: number) => {
      dispatch({ type: "hover", payload: i });
    },
    [dispatch]
  );

  // Clear selection on escape
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelection();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [clearSelection]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>68000 counter</h1>
        <p>Analyses 68000 assembly source to profile resource and size data.</p>
        <p>
          Available as a{" "}
          <a href="https://marketplace.visualstudio.com/items?itemName=gigabates.68kcounter">
            VS Code extension
          </a>
          {" and "}
          <a href="https://github.com/grahambates/68kcounter">
            npm package
          </a>{" "}
          containing a CLI tool and JavaScript/Typescript library.
        </p>
        <div>
          <textarea
            value={code}
            placeholder="Paste ASM source here"
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit" className="App__submit">
          Analyse
        </button>
      </form>

      {lines && (
        <>
          <div className="App__help">
            <ul>
              <li>
                Data is shown in the left colum in the format:
                <br />
                <code>cycles(reads/writes) words</code>
              </li>
              <li>
                Multiple values shown for branching instructions: &ldquo;branch
                taken&rdquo;, then &ldquo;branch not taken&rdquo;
              </li>
              <li>
                Click to select a range of lines and calculate totals for a
                section of code.
              </li>
            </ul>
          </div>

          {totals && <Totals totals={totals} />}

          {lines.map((line, i) => {
            const a = selectionStart;
            const b = selectionEnd !== null ? selectionEnd : selectionHover;
            const isSelected =
              a !== null &&
              b !== null &&
              i >= Math.min(a, b) &&
              i <= Math.max(a, b);

            return (
              <Line
                key={i + line.text}
                line={line}
                index={i}
                totals={i === selectionStart ? selectionTotals : null}
                isSelected={isSelected}
                onHover={handleHover}
                onClick={handleClick}
                onClearSelection={clearSelection}
              />
            );
          })}
        </>
      )}
      <div className="App__footer">
        <span>&copy; 2021 Graham Bates</span>
      </div>
    </div>
  );
};

export default App;
