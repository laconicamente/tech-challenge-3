import React from "react";
import { Controller, useFormContext, RegisterOptions, Control } from "react-hook-form";
import { BytebankSelect, SelectOption } from "./Select";

interface SelectControllerProps {
  name: string;
  label: string;
  items: SelectOption[];
  rules?: RegisterOptions;
  control?: Control<any>;
  placeholder?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export const BytebankSelectController: React.FC<SelectControllerProps> = ({
  control: controlProp,
  name,
  label,
  items,
  rules,
  placeholder,
  onOpen,
  onClose,
}) => {
  const formContext = useFormContext();
  const control = controlProp ?? formContext?.control;

  if (!control) {
    throw new Error(
      "BytebankSelectController deve ser usado dentro de um FormProvider ou receber a prop 'control'"
    );
  }

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <BytebankSelect
          label={label}
          value={field.value}
          items={items}
          onSelect={field.onChange}
          placeholder={placeholder}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    />
  );
};