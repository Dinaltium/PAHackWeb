import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "elevated" | "outlined";
}

/**
 * Card component for displaying content in a contained format
 */
export default function Card({
  children,
  style,
  variant = "default",
}: CardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "elevated":
        return styles.cardElevated;
      case "outlined":
        return styles.cardOutlined;
      default:
        return styles.cardDefault;
    }
  };

  return (
    <View style={[styles.card, getVariantStyle(), style]}>{children}</View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card header component
 */
export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card content component
 */
export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.cardContent, style]}>{children}</View>;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card footer component
 */
export function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  cardDefault: {
    backgroundColor: "#FFFFFF",
  },
  cardElevated: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardOutlined: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
});
