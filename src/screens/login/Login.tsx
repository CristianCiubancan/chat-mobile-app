import { Field, Formik } from "formik";
import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../modules/shared/InputField";
import { client } from "../../utils/apolloClient";

export const Login = ({ navigation }: any) => {
  const [login, { loading }] = useLoginMutation({});

  return (
    <Formik
      initialValues={{ usernameOrEmail: "", password: "" }}
      onSubmit={async (values, { setErrors, resetForm }) => {
        const response = await login({
          variables: values,
        });
        if (response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors));
        } else if (response.data?.login.user) {
          //succes behaviour
          resetForm({});
          await client.clearStore();
          await client.resetStore();
          navigation.replace("Home ", {
            screen: "Home",
            params: { chatId: response.data.login.user.id },
          });
        }
      }}>
      {({ handleSubmit }) => (
        <View style={{ marginTop: 20 }}>
          <Field
            name="usernameOrEmail"
            placeholder="username or email"
            component={InputField}
          />
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
            title="Login"
            titleStyle={{ fontSize: 18 }}
            loading={loading}
            onPress={handleSubmit as any}
          />
        </View>
      )}
    </Formik>
  );
};
