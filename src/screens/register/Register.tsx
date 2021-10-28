import { Field, Formik } from "formik";
import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { ValidateEmail } from "../../utils/validateEmail";
import { InputField } from "../../modules/shared/InputField";
import { client } from "../../utils/apolloClient";

export const Register = ({ navigation }: any) => {
  const [register, { loading }] = useRegisterMutation({});

  return (
    <Formik
      initialValues={{ email: "", username: "", password: "" }}
      onSubmit={async (values, { setErrors, resetForm }) => {
        if (!ValidateEmail(values.email)) {
          setErrors({ email: "Incorrect email format" });
        } else {
          const response = await register({
            variables: { options: values },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            //succes behaviour
            resetForm({});
            await client.clearStore();
            await client.resetStore();
            navigation.replace("Home ", {
              screen: "Home",
              params: { chatId: response.data.register.user.id },
            });
          }
        }
      }}>
      {({ handleSubmit }) => (
        <View style={{ marginTop: 20 }}>
          <Field
            name="username"
            placeholder="username"
            component={InputField}
          />
          <Field name="email" placeholder="email" component={InputField} />
          <Field
            name="password"
            secureTextEntry={true}
            placeholder="password"
            component={InputField}
          />
          <Button
            buttonStyle={{
              marginHorizontal: 10,
              borderRadius: 10,
              marginTop: 10,
              height: 47,
              backgroundColor: "#008080",
            }}
            title="Register"
            titleStyle={{ fontSize: 18 }}
            loading={loading}
            onPress={handleSubmit as any}
          />
        </View>
      )}
    </Formik>
  );
};
