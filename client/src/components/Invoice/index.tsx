import { RouteProp, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator, Caption, Surface,
  Text, Title
} from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useHttp, useSettings } from "../../contexts";
import {
  formatDate,
  formatPrice,
  getInvoice,
  InvoiceResponse
} from "../../libs";
import { Avatar, Stack } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";
import { Images } from "./Images";

type Props = {
  route: RouteProp<StackNavigationParamList, "InvoiceView">;
};

export function InvoiceView({ route }: Props) {
  const { theme, dictionary } = useSettings();
  const { client } = useHttp();
  const { goBack } = useNavigation();
  const styles = makeStyles(theme.colors.placeholder);

  const [invoice, setInvoice] = useState<InvoiceResponse>();

  const invoiceId = route.params.id;

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const invoice = await getInvoice(client, invoiceId);
        setInvoice(invoice);
      } catch (e) {
        goBack();
      }
    };

    asyncFunc();
  }, [invoiceId, setInvoice, client]);

  if (!invoice) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <Stack space={16} style={styles.view}>
        <Surface style={styles.surface}>
          <Stack space={12}>
            <View style={[styles.row, styles.spacing]}>
              <Title>{invoice.name}</Title>
              <Caption>{formatDate(invoice.creationTime)}</Caption>
            </View>
            <Stack space={10}>
              <View style={styles.row}>
                <Avatar
                  avatar={invoice.issuer.avatar}
                  name={invoice.issuer.name}
                  size={40}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.placeholder}>{dictionary.addedBy}:</Text>
                  <Text>{invoice.issuer.name}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <Avatar
                  avatar={invoice.group.avatar}
                  name={invoice.group.name}
                  size={40}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.placeholder}>
                    {dictionary.assignedToGroup}:
                  </Text>
                  <Text>{invoice.group.name}</Text>
                </View>
              </View>
            </Stack>
            <View style={[styles.row, styles.spacing]}>
              <Text>{dictionary.totalPrice}:</Text>

              <View style={styles.row}>
                <Text style={styles.price}>
                  {formatPrice(invoice.totalPrice)} zł
                </Text>
                <Ionicons
                  name={
                    invoice.settled
                      ? "checkmark-circle"
                      : "ios-ellipsis-horizontal-circle-sharp"
                  }
                  color={
                    invoice.settled ? theme.colors.green : theme.colors.accent
                  }
                  size={25}
                />
              </View>
            </View>
          </Stack>
        </Surface>

        <Images
          images={invoice.images}
        />

        <Surface style={styles.itemsSurface}>
          <Stack space={4} withSeparator separatorColor={theme.colors.disabled}>
            {invoice.items.map((item) => (
              <View
                style={[styles.row, styles.spacing, styles.item]}
                key={item.id}
              >
                <Text>{item.text}</Text>
                <Text>{formatPrice(item.price)} zł</Text>
              </View>
            ))}
          </Stack>
        </Surface>
      </Stack>
    </ScrollView>
  );
}

const makeStyles = (placeholderColor: string) =>
  StyleSheet.create({
    view: {
      padding: 16,
    },
    loaderWrapper: {
      flex: 1,
      alignItems: "center",
      paddingTop: 32,
    },
    surface: {
      padding: 16,
      borderRadius: 8,
      elevation: 2,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    spacing: {
      justifyContent: "space-between",
    },
    price: {
      marginRight: 10,
    },
    avatar: {
      marginRight: 16,
    },
    placeholder: {
      fontSize: 10,
      color: placeholderColor,
    },
    half: {
      flexBasis: "50%",
    },
    itemsSurface: {
      padding: 8,
      borderRadius: 8,
      elevation: 2,
    },
    item: {
      padding: 8,
    },
  });
