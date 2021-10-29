import { Field, Formik } from "formik";
import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Icon } from "react-native-elements";
import { useSendMessageMutation } from "../../generated/graphql";
import { widthAndHeight } from "../../utils/deviceDimensions";
import { teal_dark } from "../shared/constants";
import { MessageInputField } from "./messageInputField";

interface MessageInputProps {
  chatId: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [sendMessage, { loading }] = useSendMessageMutation({
    onCompleted: (data) => {},
    onError: (err) => {},
  });

  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={async (values, actions) => {
        if (values.message !== "") {
          sendMessage({
            variables: {
              input: {
                chatId,
                text: values.message,
              },
            },
          });
        }
        actions.resetForm();
      }}>
      {({ handleSubmit }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.select({ ios: 64 })}>
          <View
            style={{
              backgroundColor: teal_dark,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              paddingVertical: 15,
            }}>
            <Field name="message" component={MessageInputField} />
            <Button
              buttonStyle={{
                backgroundColor: "#319795",
                borderRadius: 10,
              }}
              onPress={handleSubmit as any}
              icon={
                <Icon
                  tvParallaxProperties
                  name="angle-right"
                  type="font-awesome"
                  size={25}
                  color="white"
                  style={{ paddingHorizontal: 6 }}
                />
              }
              iconRight
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};
export default MessageInput;
