import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { ShelfParams } from ".";
import { useHttp, useSettings } from "../../contexts";
import {
  acceptPayment,
  getPaymentsForSettlement,
  HttpClient,
  PaymentResponse,
  rejectPayment,
  SuccessResponse,
} from "../../libs";
import { BottomAction, Stack } from "../../ui";
import { OnShowPressArgs, PaymentItem } from "./PaymentItem";
import { UserPreview } from "./UserPreview";

type RequestFunction = (
  client: HttpClient,
  paymentId: number
) => Promise<SuccessResponse>;

export function ForSettlement() {
  const { client } = useHttp();
  const { dictionary, theme } = useSettings();
  const [payments, setPayments] = useState([] as PaymentResponse[]);
  const [userConfidentials, setUserConfidentials] = useState<ShelfParams>({
    visible: false,
    price: 0,
    paymentId: -1,
  });

  const closeAction = useCallback(() => {
    setUserConfidentials({ visible: false, paymentId: -1, price: 0 });
  }, [setUserConfidentials]);

  const showProfile = useCallback(
    ({ paymentId, user, price }: OnShowPressArgs) => {
      setUserConfidentials({ visible: true, user, paymentId, price });
    },
    [setUserConfidentials]
  );

  useFocusEffect(
    useCallback(() => {
      const asyncFunc = async () => {
        const payments = await getPaymentsForSettlement(client);
        setPayments(payments);
      };
      asyncFunc();
    }, [client, setPayments])
  );

  const paymentId = userConfidentials.paymentId;

  const sendRequest = useCallback(
    (func: RequestFunction) => {
      const asyncFunc = async () => {
        try {
          const response = await func(client, paymentId);
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
            return {
              visible: false,
              paymentId: -1,
              price: 0,
            };
          }

          return confidentials;
        });
      };

      asyncFunc();
    },
    [client, paymentId, setPayments, setUserConfidentials]
  );

  const reject = useCallback(() => {
    sendRequest(rejectPayment);
  }, [sendRequest]);

  const accept = useCallback(() => {
    sendRequest(acceptPayment);
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ScrollView style={styles.container}>
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
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              color={theme.colors.green}
              onPress={accept}
            >
              {dictionary.accept}
            </Button>
            <Button mode="contained" color={theme.colors.red} onPress={reject}>
              {dictionary.reject}
            </Button>
          </View>
        </UserPreview>
      </BottomAction>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
