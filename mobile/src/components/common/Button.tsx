import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Custom Button component with different variants and sizes
 */
export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  // Get button styling based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return styles.buttonPrimary;
      case "secondary":
        return styles.buttonSecondary;
      case "outline":
        return styles.buttonOutline;
      default:
        return styles.buttonPrimary;
    }
  };

  // Get text styling based on variant
  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.textPrimary;
      case "secondary":
        return styles.textSecondary;
      case "outline":
        return styles.textOutline;
      default:
        return styles.textPrimary;
    }
  };

  // Get size styling
  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.buttonSmall;
      case "md":
        return styles.buttonMedium;
      case "lg":
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  // Get size text styling
  const getTextSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.textSmall;
      case "md":
        return styles.textMedium;
      case "lg":
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            getTextStyle(),
            getTextSizeStyle(),
            disabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonPrimary: {
    backgroundColor: "#3B82F6",
  },
  buttonSecondary: {
    backgroundColor: "#6B7280",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
    borderColor: "#D1D5DB",
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  textPrimary: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  textSecondary: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  textOutline: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  textDisabled: {
    color: "#9CA3AF",
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
});
