import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Caption, IconButton, Surface, Text, Title } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSettings } from "../../contexts";
import {
  formatDate,
  formatPrice,
  PaymentResponse,
  UserWithConfidential,
} from "../../libs";
import { Avatar, Chip, Stack } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";

type Props = PaymentResponse & {
  onShowPress(user: UserWithConfidential, paymentId: number): void;
};

export function PaymentItem({
  invoice,
  price,
  status,
  onShowPress,
  id,
}: Props) {
  const { dictionary } = useSettings();
  const { push } =
    useNavigation<StackNavigationProp<StackNavigationParamList>>();

  const { issuer } = invoice;

  const showInvoice = useCallback(() => {
    push("InvoiceView", { id: invoice.id });
  }, [invoice.id]);

  const showProfile = useCallback(() => {
    onShowPress(invoice.issuer, id);
  }, [onShowPress, invoice, id]);

  return (
    <Surface style={styles.container}>
      <Stack space={12}>
        <View style={[styles.row, styles.spaceBetween]}>
          <Title>{invoice.name}</Title>
          <Caption>{formatDate(invoice.creationTime)}</Caption>
        </View>
        <View style={[styles.row, styles.spaceBetween]}>
          <View style={styles.row}>
            <Avatar avatar={issuer.avatar} name={issuer.name} size={40} />
            <Text style={styles.largeLeftMargin}>{issuer.name}</Text>
          </View>
          <View style={styles.row}>
            <Text>{formatPrice(price)} zł</Text>
            <Chip text={dictionary[status]} style={styles.smallLeftMargin} />
          </View>
        </View>
      </Stack>
      <View style={[styles.row, styles.spaceBetween, styles.smallMarginTop]}>
        <View style={styles.row}>
          <Avatar
            avatar={invoice.group.avatar}
            name={invoice.group.name}
            size={30}
            style={{ marginHorizontal: 5 }}
          />
          <Text style={styles.largeLeftMargin}>{invoice.group.name}</Text>
        </View>
        <View style={styles.row}>
          <IconButton
            icon={(props) => (
              <MaterialCommunityIcons name="eye-outline" {...props} />
            )}
            size={iconSize}
            onPress={showProfile}
          />
          <IconButton
            icon={(props) => (
              <MaterialCommunityIcons name="information-outline" {...props} />
            )}
            size={iconSize}
            onPress={showInvoice}
          />
        </View>
      </View>
    </Surface>
  );
}

const iconSize = 20;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallLeftMargin: {
    marginLeft: 8,
  },
  largeLeftMargin: {
    marginLeft: 16,
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  smallMarginTop: {
    marginTop: 5,
  },
});
