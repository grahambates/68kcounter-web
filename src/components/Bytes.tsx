import React, { FC } from "react";
import { lengthLevel } from "68kcounter";

export interface WordsProps {
  bytes: number;
  color?: boolean;
}

const Bytes: FC<WordsProps> = ({ bytes, color }) => {
  const className = color ? lengthLevel(bytes).toLowerCase() : "";
  return (
    <span
      className={className}
      title={bytes + (bytes > 1 ? " bytes" : " byte")}
    >
      {bytes}
    </span>
  );
};

export default Bytes;
