import React, { FC } from "react";
import { Totals as TotalsType } from "68kcounter";
import Timing from "./Timing";
import Words from "./Words";
import "./Totals.css";

export interface TotalsProps {
  totals: TotalsType;
}

const Totals: FC<TotalsProps> = ({ totals }) => (
  <div className="Totals">
    <span>
      <strong>Total length: </strong>
      <Words words={totals.words} /> words ({totals.words * 2} bytes)
    </span>
    <span>
      <strong>Total cycles: </strong>
      {totals.isRange ? (
        <>
          <Timing timing={totals.min} /> – <Timing timing={totals.max} />
        </>
      ) : (
        <Timing timing={totals.min} />
      )}
    </span>
  </div>
);

export default Totals;
