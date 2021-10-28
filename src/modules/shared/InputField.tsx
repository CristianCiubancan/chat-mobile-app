import { FieldProps } from "formik";
import * as React from "react";
import { Input } from "react-native-elements";

const errStyle = {
  color: "red",
};

export const InputField = (props: FieldProps) => {
  const onChangeText = (text: string) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = props;
    setFieldValue(name, text);
  };

  const {
    field,
    form: { touched, errors },
  } = props;

  const errorMsg = touched[field.name] && errors[field.name];

  return (
    <Input
      {...props}
      errorStyle={errStyle}
      errorMessage={errorMsg as string | undefined}
      onChangeText={onChangeText}
      inputContainerStyle={{ borderBottomWidth: 0 }}
      inputStyle={{
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
      }}
      value={field.value}
      label={
        field.name === "usernameOrEmail" ? "Username or Email" : field.name
      }
      labelStyle={
        field.name === "usernameOrEmail"
          ? {
              color: "#16161D",
              marginBottom: 10,
            }
          : {
              color: "#16161D",
              textTransform: "capitalize",
              marginBottom: 10,
            }
      }
    />
  );
};
