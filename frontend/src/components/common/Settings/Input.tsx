import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface GenericInputProps {
  title: string;
  description?: string;
  validationFunction?: (value: string) => boolean;
  validationRegex?: RegExp;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string | number;
  required?: boolean;
  exampleValue?: string;
  isNumber?: boolean;
  [key: string]: any; // Allow additional props
}

const GenericInput: React.FC<GenericInputProps> = ({
  title,
  description,
  validationFunction,
  validationRegex,
  minLength,
  maxLength,
  defaultValue,
  required,
  exampleValue,
  isNumber,
  ...otherProps
}) => {
  const [value, setValue] = useState<string | number>(defaultValue || '');
  const [error, setError] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    let validationError = '';

    // Perform validation if provided
    if (validationFunction && !validationFunction(newValue)) {
      validationError = 'Invalid input';
    }

    if (validationRegex && !validationRegex.test(newValue)) {
      validationError = 'Invalid input based on pattern';
    }

    // Check if the input is a number and within the specified range
    if (isNumber) {
      const numericValue = parseFloat(newValue);

      if (
        isNaN(numericValue) ||
        (minLength !== undefined && numericValue < minLength) ||
        (maxLength !== undefined && numericValue > maxLength)
      ) {
        validationError = `Invalid number input. Must be between ${minLength} and ${maxLength}`;
      }
    }

    // Check for string length validation
    if (minLength !== undefined && newValue.length < minLength) {
      validationError = `Must be at least ${minLength} characters long`;
      return;
    }

    if (maxLength !== undefined && newValue.length > maxLength) {
      validationError = `Must be at most ${maxLength} characters long`;
      return;
    }

    setValue(newValue);
    setError(validationError);
  };

  useEffect(() => {
    // You can perform additional actions when the value changes, if needed
    // For example, you might want to trigger some validation logic or update a state in the parent component.
    // This is just a placeholder for additional logic.
    console.log('Value changed:', value);
  }, [value]);

  return (
    <div>
      <TextField
        label={title}
        helperText={description}
        value={value}
        onChange={handleChange}
        required={required}
        error={Boolean(error)}
        inputProps={{ pattern: validationRegex?.source, title: exampleValue }}
        {...otherProps}
      />
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default GenericInput;
