import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-pink-700 bg-violet-900 text-7xl">Welcome to reactNative</Text>
    </View>
  );
}
