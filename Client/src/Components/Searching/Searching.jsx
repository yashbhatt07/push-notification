import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export default function Searching({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  const clickHandler = () => {
    setValue("");
  };
  return (
    <div>
      <input
        {...props}
        style={{
          marginLeft: "auto",
          display: "flex",
          marginRight: "100px",
          marginTop: "10px",
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        variant="outline-danger "
        size="sm"
        onClick={clickHandler}
        style={{
          marginLeft: "auto",
          display: "flex",
          marginRight: "100px",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        ×
      </Button>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
