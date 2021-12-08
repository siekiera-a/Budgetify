import React from "react";
import { StyleSheet, View } from "react-native";
import { useSettings } from "../../contexts";
import { View as CustomView } from "../../ui";

type Props = {
  totalPrice: number;
  paid: number;
  inSettlement: number;
};

export function InvoicePaymentStatus({
  totalPrice,
  paid,
  inSettlement,
}: Props) {
  const paidPercent = (paid / totalPrice) * 100;
  const inSettlementPercent = (inSettlement / totalPrice) * 100;
  const { theme } = useSettings();

  return (
    <View style={styles.container}>
      <CustomView style={styles.bar}>
        <View
          style={[
            styles.progress,
            { width: `${paidPercent}%`, backgroundColor: theme.colors.green },
          ]}
        />
        <View
          style={[
            styles.progress,
            {
              width: `${inSettlementPercent}%`,
              backgroundColor: theme.colors.yellow,
            },
          ]}
        />
      </CustomView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    flex: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  progress: {
    height: "100%",
  },
});
