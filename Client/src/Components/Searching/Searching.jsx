import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export default function Searching({
  value: initialValue,
  onChange,
  debounce = 500,
  columns,
  TotalAdmins,
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
    <>
      <div>
        <input
          {...props}
          style={{
            display: "flex",
            margin: "10px auto",
            width: "140px",
            padding: "5px",
            borderRadius: " 8px",
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
