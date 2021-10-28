import { FieldProps } from "formik";
import * as React from "react";
import { TextInput } from "react-native";

export const MessageInputField = (props: FieldProps) => {
  const onChangeText = (text: string) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = props;
    setFieldValue(name, text);
  };

  const { field } = props;

  return (
    <TextInput
      {...props}
      onChangeText={onChangeText}
      style={{
        borderBottomWidth: 0,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 6.5,
        height: 40,
        width: "80%",
      }}
      value={field.value}
    />
  );
};
