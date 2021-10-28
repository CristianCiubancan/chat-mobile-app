import { Platform } from "react-native";

export const SID_KEY = "sid";
export const teal_dark = "#008080";
export const host =
  Platform.OS === "ios"
    ? "http://192.168.100.3:4000"
    : "http://192.168.100.3:4000";
// ? "http://192.168.100.3:4000"
// : "http://192.168.100.3:4000";
// export const host = "https://api.happyoctopus.net/";
