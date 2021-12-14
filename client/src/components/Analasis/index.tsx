import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Surface, Text} from "react-native-paper";
import {useHttp, useSettings} from "../../contexts";
import {
  formatPrice,
  getPaymentsToReturn,
  getTimeRangeSummary,
  TimeRangeSummary,
  UserPayment,
} from "../../libs";
import {Avatar, SafeAreaView, Stack} from "../../ui";
import {Chart} from "./Chart";

export function AnalasisView() {
  const [userPayments, setUserPayments] = useState([] as UserPayment[]);
  const [summary, setSummary] = useState<TimeRangeSummary>({
    from: "",
    to: "",
    notPaid: 0,
    expenses: 0,
    settled: 0,
    total: 0,
    waiting: 0,
  });

  const { client } = useHttp();
  const { dictionary } = useSettings();

  useFocusEffect(
    useCallback(() => {
      const getPaymentsToReturnAsync = async () => {
        try {
          const userPayments = await getPaymentsToReturn(client);
          setUserPayments(userPayments);
        } catch {
          setUserPayments([]);
        }
      };

      const getSummaryAsync = async () => {
        try {
          const summary = await getTimeRangeSummary(client);
          setSummary(summary);
        } catch (e) {
          console.log(e);
        }
      };

      getPaymentsToReturnAsync();
      getSummaryAsync();
    }, [client, setUserPayments, setSummary])
  );

  return (
    <SafeAreaView style={styles.container}>
      {summary.total > 0 ? (
        <Chart
          notPaid={summary.notPaid}
          expenses={summary.expenses}
          settled={summary.settled}
          waiting={summary.waiting}
        />
      ) : (
        <Text style={[styles.centerText, styles.padding]}>
          {dictionary.noData}
        </Text>
      )}

      <View style={styles.fullHeight}>
        <Surface style={styles.surface}>
          <ScrollView contentContainerStyle={styles.padding}>
            {userPayments.length === 0 ? (
              <Text style={styles.centerText}>{dictionary.noResults}</Text>
            ) : (
              <Stack space={8}>
                {userPayments.map(({ price, user }) => (
                  <View key={user.id} style={[styles.row, styles.rowSpace]}>
                    <View style={styles.row}>
                      <Avatar avatar={user.avatar} name={user.name} size={35} />
                      <Text style={styles.name}>{user.name}</Text>
                    </View>
                    <Text>{formatPrice(price)} zł</Text>
                  </View>
                ))}
              </Stack>
            )}
          </ScrollView>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  centerText: {
    textAlign: "center",
  },
  surface: {
    borderRadius: 8,
  },
  fullHeight: {
    flex: 1,
  },
  padding: {
    padding: 8,
  },
  rowSpace: {
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    marginLeft: 16,
  },
});
