import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "../../components/common/Button";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Intro">;

export const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const handleGuestMode = () => {
    // navigation.replace("MainTabs");
  };

  const handleLogin = () => {
    // navigation.navigate("Auth", { screen: "Login" });
  };

  const handleRegister = () => {
    // navigation.navigate("Auth", { screen: "Register" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../../../assets/logo.png")} />
        <Text style={styles.title}>GatherGO!</Text>
        <Image source={require("../../../assets/login_banner.png")} />

        <Text style={styles.subtitle}>輕鬆掌握偶像的精彩活動！</Text>
        <Text style={styles.mt}>
          不管是生日應援、展覽還是演唱會，一次掌握所
        </Text>
        <Text>有偶像的資訊！收藏喜歡的活動，輕鬆查看地點</Text>
        <Text>和時間，不錯過任何閃耀瞬間！</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="建立帳號"
          onPress={handleRegister}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="登入"
          onPress={handleLogin}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="先逛逛，稍後登入"
          variant="none"
          onPress={handleGuestMode}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  mt: {
    marginTop: 12,
  },
  content: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: "#5E5CE6",
    fontWeight: "700",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    marginBottom: 12,
  },
});
