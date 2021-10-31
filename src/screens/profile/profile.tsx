import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ReactNativeFile } from "apollo-upload-client";
import {
  MeDocument,
  useChangeProfilePicMutation,
  useMeQuery,
} from "../../generated/graphql";
import { client } from "../../utils/apolloClient";
import uuid from "uuid";
import { Avatar, Text } from "react-native-elements";

export const Profile = () => {
  const { data: user } = useMeQuery();
  const [newImageLoading, setNewImageLoading] = useState<boolean>(false);

  const [newPic] = useChangeProfilePicMutation();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewImageLoading(true);

      const file = new ReactNativeFile({
        uri: result.uri,
        name: `${uuid.v4()}_profilePic`,
        type: "image/jpeg",
      });

      await newPic({
        variables: { picture: file },
      });

      //   await client.refetchQueries({ include: ["Me"] });
      await client.refetchQueries({ include: [MeDocument] });
      setNewImageLoading(false);
    }
  };

  const imageToDisplay = newImageLoading
    ? "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif"
    : user?.me?.profilePicUrl;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}>
      <View style={{ padding: 20 }}>
        {user?.me?.id ? (
          <Avatar
            rounded
            size={150}
            onPress={pickImage}
            source={{
              uri: imageToDisplay!,
            }}
          />
        ) : null}
      </View>
      <Text style={{ fontWeight: "700", fontSize: 30 }}>
        {user?.me?.username}
      </Text>
    </View>
  );
};
