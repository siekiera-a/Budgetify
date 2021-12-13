import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useHttp, useSettings } from "../../contexts";
import { formatPrice, getPaymentsToReturn, UserPayment } from "../../libs";
import { Avatar, SafeAreaView, Stack } from "../../ui";

export function AnalasisView() {
  const [userPayments, setUserPayments] = useState([] as UserPayment[]);

  const { client } = useHttp();
  const { dictionary } = useSettings();

  useFocusEffect(
    useCallback(() => {
      const asyncFunc = async () => {
        try {
          const userPayments = await getPaymentsToReturn(client);
          setUserPayments(userPayments);
        } catch {
          setUserPayments([]);
        }
      };

      asyncFunc();
    }, [client, setUserPayments])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Surface style={styles.surface}>
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
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centerText: {
    textAlign: "center",
  },
  surface: {
    padding: 8,
    borderRadius: 8,
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
