import React from "react";

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",

  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  errorInput: {
    border: "1px solid red",
  },
  errorText: {
    fontSize: "12px",
    color: "red",
  },

};

const Input = ({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <div style={styles.wrapper}>
      {label && <label style={styles.label}>{label}</label>}

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(error ? styles.errorInput : {}),
        }}
      />

      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
