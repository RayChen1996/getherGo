import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "none";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    variant === "primary" && styles.primaryButton,
    variant === "secondary" && styles.secondaryButton,
    variant === "outline" && styles.outlineButton,
    variant === "none" && styles.borderNone,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.text,
    variant === "primary" && styles.primaryText,
    variant === "secondary" && styles.secondaryText,
    variant === "outline" && styles.outlineText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#6366f1"} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
  },
  secondaryButton: {
    backgroundColor: "#e0e7ff",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  borderNone: {
    borderWidth: 0,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#6366f1",
  },
  outlineText: {
    color: "#6366f1",
  },
});
