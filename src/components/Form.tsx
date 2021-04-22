import React, { FC, FormEvent, useEffect, useRef, useState } from "react";
import "./Form.css";

export interface InputProps {
  onSubmit: (code: string) => void;
}

const Form: FC<InputProps> = ({ onSubmit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [code, setCode] = useState("");

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer?.files);
    }
    setDragging(false);
  };

  const handleFiles = (f: FileList | null) => {
    if (f && f[0]) {
      f[0].text().then(setCode);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  useEffect(() => {
    if (ref.current) {
      const div = ref.current;
      div.addEventListener("dragover", handleDrag);
      div.addEventListener("dragenter", handleDragEnter);
      div.addEventListener("dragleave", handleDragLeave);
      div.addEventListener("drop", handleDrop);
      return () => {
        div.removeEventListener("dragover", handleDrag);
        div.removeEventListener("dragenter", handleDragEnter);
        div.removeEventListener("dragleave", handleDragLeave);
        div.removeEventListener("drop", handleDrop);
      };
    }
  }, [ref]);
  return (
    <form className="Form" onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => handleFiles(e.target.files)} />
      <div
        className={"Form__dropper" + (dragging ? " isDragging" : "")}
        ref={ref}
      >
        <textarea
          className="Form__textarea"
          value={code}
          placeholder="Paste or drop ASM source here"
          onChange={(e) => setCode(e.target.value)}
        />
        <span>Drop here</span>
      </div>
      <button type="submit" className="Form__submit">
        Analyse
      </button>
    </form>
  );
};

export default Form;
