import React from "react";
import { Control, Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { BytebankInput, BytebankInputProps } from "./Input";

interface InputControllerProps extends BytebankInputProps{
  name: string;
  rules?: RegisterOptions;
  control?: Control<any>;
  keyboardType?: BytebankInputProps["keyboardType"];
}

export const BytebankInputController: React.FC<InputControllerProps> = ({
  control: controlProp,
  name,
  label,
  type = "text",
  placeholder,
  maskType,
  rules,
  keyboardType,
  secureTextEntry,
  right,
  editable
}) => {
  const formContext = useFormContext();
  const control = controlProp ?? formContext?.control;

  if (!control) {
    throw new Error(
      "BytebankInputController deve ser usado dentro de um FormProvider ou receber a prop 'control'"
    );
  }

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return <BytebankInput
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          keyboardType={keyboardType || 'default'}
          value={field.value}
          maskType={maskType}
          secureTextEntry={secureTextEntry}
          right={right}
          editable={editable}
          onChangeText={
            maskType
              ? (masked) => field.onChange(masked)
              : field.onChange
          }
        />
      }
      }
    />
  );
};