import React, { FC } from "react";
import { lengthLevel } from "68kcounter";

export interface WordsProps {
  words: number;
  color?: boolean;
}

const Words: FC<WordsProps> = ({ words, color }) => {
  const className = color ? lengthLevel(words).toLowerCase() : "";
  return (
    <span
      className={className}
      title={words + (words > 1 ? " words" : " word")}
    >
      {words}
    </span>
  );
};

export default Words;
