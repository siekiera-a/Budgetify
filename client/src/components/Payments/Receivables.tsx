import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { ShelfParams } from ".";
import { useHttp, useSettings } from "../../contexts";
import {
  getReceivables,
  PaymentResponse,
  PaymentStatus,
  payPayment,
} from "../../libs";
import { BottomAction, Stack } from "../../ui";
import { OnShowPressArgs, PaymentItem } from "./PaymentItem";
import { UserPreview } from "./UserPreview";

export function Receivables() {
  const { dictionary } = useSettings();
  const { client } = useHttp();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [userConfidentials, setUserConfidentials] = useState<ShelfParams>({
    visible: false,
    paymentId: -1,
    price: 0,
  });
  const [payments, setPayments] = useState([] as PaymentResponse[]);
  const [status, setStatus] = useState<PaymentStatus>("OPENED");

  const statuses = useMemo(
    () =>
      [
        { value: "OPENED", label: dictionary.OPENED },
        { value: "PENDING", label: dictionary.PENDING },
        { value: "CLOSED", label: dictionary.CLOSED },
        { value: "REJECTED", label: dictionary.REJECTED },
      ] as Array<{ label: string; value: PaymentStatus }>,
    [dictionary]
  );

  const closeDropdown = useCallback(() => {
    setFiltersOpen(false);
  }, [setFiltersOpen]);

  const openDropdown = useCallback(() => {
    setFiltersOpen(true);
  }, [setFiltersOpen]);

  const closeAction = useCallback(() => {
    setUserConfidentials({ visible: false, paymentId: -1, price: 0 });
  }, [setUserConfidentials]);

  const showProfile = useCallback(
    ({ user, paymentId, price }: OnShowPressArgs) => {
      setUserConfidentials({ visible: true, user, paymentId, price });
    },
    [setUserConfidentials]
  );

  useFocusEffect(
    useCallback(() => {
      const asyncFunc = async () => {
        const receivables = await getReceivables(client, status);
        setPayments(receivables);
      };
      asyncFunc();
    }, [status, client, setPayments])
  );

  const paymentId = userConfidentials.paymentId;

  const pay = useCallback(() => {
    const asyncFunc = async () => {
      try {
        const response = await payPayment(client, userConfidentials.paymentId);
        if (response.success) {
          setPayments((payments) =>
            payments.filter((payment) => payment.id !== paymentId)
          );
        }
      } catch (e) {
        console.log(e);
      }

      setUserConfidentials((confidentials) => {
        if (confidentials.visible) {
          return { visible: false, paymentId: -1, price: 0 };
        }
        return confidentials;
      });
    };
    asyncFunc();
  }, [client, paymentId, setPayments]);

  return (
    <React.Fragment>
      <ScrollView style={styles.container}>
        <View style={styles.dropDownRow}>
          <Text style={styles.label}>{dictionary.filter}</Text>
          <DropDown
            visible={filtersOpen}
            onDismiss={closeDropdown}
            showDropDown={openDropdown}
            value={status}
            list={statuses}
            setValue={setStatus}
            mode="outlined"
            dropDownItemStyle={styles.dropDownItem}
            dropDownItemTextStyle={styles.dropDownText}
            dropDownItemSelectedTextStyle={styles.dropDownText}
            dropDownItemSelectedStyle={styles.dropDownItem}
            inputProps={{
              style: styles.dropDown,
              right: (
                <TextInput.Icon
                  name={filtersOpen ? "menu-up" : "menu-down"}
                  style={{ position: "relative", top: 4 }}
                />
              ),
            }}
          />
        </View>
        <Stack space={8}>
          {payments.map((payment) => (
            <PaymentItem
              key={payment.id}
              onShowPress={showProfile}
              {...payment}
            />
          ))}
        </Stack>
      </ScrollView>
      <BottomAction visible={userConfidentials.visible} onDismiss={closeAction}>
        <UserPreview
          user={userConfidentials.user}
          price={userConfidentials.price}
        >
          {(status === "OPENED" || status === "REJECTED") && (
            <View style={styles.buttonRow}>
              <Button onPress={pay} mode="contained">
                {dictionary.pay}
              </Button>
            </View>
          )}
        </UserPreview>
      </BottomAction>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropDownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  dropDownItem: {
    height: 30,
  },
  dropDownText: {
    fontSize: 14,
  },
  dropDown: {
    height: 35,
    fontSize: 14,
  },
  label: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
