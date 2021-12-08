import {
  RouteProp,
  useFocusEffect,
  useNavigation
} from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Surface,
  Text,
  Title
} from "react-native-paper";
import { useHttp, useSettings } from "../../contexts";
import { formatPrice, getGroupDetails, GroupDetailsResponse } from "../../libs";
import { EditImage, Stack } from "../../ui";
import {
  GroupAndMainStackNavigation,
  GroupNavigationParamList
} from "./GroupsTab";
import { InvoiceItem } from "./InvoiceItem";

type Props = {
  route: RouteProp<GroupNavigationParamList, "Group">;
};

export function Group({ route }: Props) {
  const { theme, dictionary } = useSettings();
  const { client } = useHttp();
  const { navigate } = useNavigation<GroupAndMainStackNavigation>();
  const [loading, setLoading] = useState(true);

  const [group, setGroup] = useState<GroupDetailsResponse>({
    ...route.params,
    toPay: 0,
    toReturn: 0,
    invoices: [],
  });

  useFocusEffect(
    useCallback(() => {
      const asyncFunc = async () => {
        try {
          const details = await getGroupDetails(client, route.params.id);
          setGroup(details);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      };
      asyncFunc();
    }, [setLoading, setGroup, client, route.params.id])
  );

  const openSettlementCreator = useCallback(
    () =>
      navigate("SettlementCreator", {
        users: group.members,
        groupId: group.id,
      }),
    [navigate, group]
  );

  return (
    <View style={styles.viewContainer}>
      <ScrollView>
        <Surface style={styles.groupSurface}>
          <EditImage
            image={group.avatar}
            size={75}
            backgroundColor={theme.colors.background}
            borderColor={theme.colors.border}
          />
          <View style={styles.groupName}>
            <Title>{group.name}</Title>
          </View>
          <IconButton
            icon="account-group"
            onPress={() => console.log("members")}
            size={30}
          />
        </Surface>
        {loading ? (
          <View style={styles.spinnerWrapper}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : (
          <React.Fragment>
            <Surface style={styles.paymentsSurface}>
              <View style={styles.paymentWrapper}>
                <Text>{dictionary.toPay}:</Text>
                <Text style={styles.price}>{formatPrice(group.toPay)} zł</Text>
              </View>
              <View style={styles.paymentWrapper}>
                <Text>{dictionary.toReturn}:</Text>
                <Text style={styles.price}>
                  {formatPrice(group.toReturn)} zł
                </Text>
              </View>
            </Surface>

            <Stack space={8}>
              {group.invoices.map((invoice) => (
                <InvoiceItem item={invoice} key={invoice.id} />
              ))}
            </Stack>
          </React.Fragment>
        )}
      </ScrollView>
      <FAB icon="plus" style={styles.fab} onPress={openSettlementCreator} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    padding: 16,
  },
  groupSurface: {
    width: "100%",
    padding: 16,
    elevation: 2,
    borderRadius: 15,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  groupName: {
    marginHorizontal: 20,
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
  },
  paymentsSurface: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    marginVertical: 16,
  },
  price: {
    marginLeft: 8,
    fontWeight: "bold",
  },
  paymentWrapper: {
    flexDirection: "row",
  },
  spinnerWrapper: {
    alignItems: "center",
    marginTop: 32,
  },
});
