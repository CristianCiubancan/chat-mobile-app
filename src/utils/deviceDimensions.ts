import { Dimensions } from "react-native";

export const widthAndHeight = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  return { width: windowWidth, height: windowHeight };
};
