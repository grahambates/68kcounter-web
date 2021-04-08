import React, { useState } from "react";
import process from "68kcounter";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [processed, setProcessed] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessed(process(code));
  };
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

      {processed &&
        processed.map((l, i) => (
          <div key={i + l.text} class="line">
            <div class="info">
              {l.timings &&
                (l.timings.clock ? (
                  <Timings timings={l.timings} />
                ) : (
                  l.timings.map((t, i) => <Timings timings={t} key={i} />)
                ))}
              <Words words={l.words} />
            </div>
            <span class="number">{i + 1}</span>
            <pre class="code">{l.text || " "}</pre>
          </div>
        ))}
    </div>
  );
}

function Words({ words }) {
  let className;
  if (words > 2) {
    className = "high";
  } else if (words === 2) {
    className = "med";
  } else {
    className = "low";
  }
  return (
    <span class={className} title={words + (words > 1 ? " words" : " word")}>
      {words}
    </span>
  );
}

function Timings({ timings: { clock, read, write } }) {
  let className;
  if (clock > 30) {
    className = "vhigh";
  } else if (clock > 20) {
    className = "high";
  } else if (clock > 12) {
    className = "med";
  } else {
    className = "low";
  }
  return (
    <span class={"timings " + className}>
      <span title={clock + " CPU clock cycles"}>{clock}</span>(
      <span title={read + " buffer read cycles"}>{read}</span>/
      <span title={write + " buffer write cycles"}>{write}</span>)
    </span>
  );
}

export default App;
