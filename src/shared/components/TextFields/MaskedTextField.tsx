/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, type Control } from "react-hook-form";
import { IMaskInput } from "react-imask";
import React from "react";

interface CustomMaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const IMaskAdapter = React.forwardRef<HTMLInputElement, CustomMaskProps>(
  function IMaskAdapter(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

type MaskedTextFieldProps = Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur"
> & {
  name: string;
  control: Control<any>;
  mask: string;
};

export const MaskedTextField = ({
  name,
  control,
  mask,
  ...rest
}: MaskedTextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...rest}
          {...field}
          fullWidth
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          InputProps={{
            ...rest.InputProps,
            inputComponent: IMaskAdapter as any,
          }}
          inputProps={{
            mask: mask,
            name: field.name,
          }}
        />
      )}
    />
  );
};
