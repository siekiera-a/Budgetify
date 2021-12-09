import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Surface, Text } from "react-native-paper";
import { useSettings } from "../../contexts";
import {
  formatDate,
  formatPrice,
  InvoiceToPay,
  InvoiceToSettlement,
} from "../../libs";
import { Chip, Stack } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";
import { InvoicePaymentStatus } from "./InvoicePaymentStatus";

type Props = {
  item: InvoiceToPay | InvoiceToSettlement;
};

const isInvoiceToPay = (
  item: InvoiceToPay | InvoiceToSettlement
): item is InvoiceToPay => "status" in item;

export function InvoiceItem({ item }: Props) {
  const { dictionary } = useSettings();
  const invoiceToPay = isInvoiceToPay(item);
  const { push } =
    useNavigation<StackNavigationProp<StackNavigationParamList>>();

  const { id, name, creationTime, totalPrice } = item;

  const showInvoice = useCallback(() => {
    push("InvoiceView", { id });
  }, [id]);

  return (
    <TouchableOpacity onPress={showInvoice}>
      <Surface style={styles.container}>
        <Stack space={8}>
          <View style={styles.row}>
            <Text style={styles.title}>{name}</Text>
            <Text style={[styles.title, styles.date]}>
              {formatDate(creationTime)}
            </Text>
          </View>
          <Stack space={5}>
            <View style={[styles.row, { alignItems: "baseline" }]}>
              <Text>
                {invoiceToPay ? dictionary.toPay : dictionary.totalPrice}:
              </Text>
              <View style={styles.paymentDetails}>
                <Text style={styles.price}>{formatPrice(totalPrice)} zł</Text>
                {invoiceToPay && item.status && (
                  <Chip
                    text={dictionary[item.status]}
                    style={styles.marginLeft}
                  />
                )}
              </View>
            </View>
            {!invoiceToPay && item.totalPrice > 0 && (
              <InvoicePaymentStatus
                inSettlement={item.inSettlement}
                totalPrice={item.totalPrice}
                paid={item.paid}
              />
            )}
          </Stack>
        </Stack>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontStyle: "italic",
  },
  title: {
    fontSize: 17,
  },
  price: {
    fontWeight: "bold",
  },
  paymentDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 8,
  },
});
