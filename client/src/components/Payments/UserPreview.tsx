import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSettings } from "../../contexts";
import {
  formatBankAccount,
  formatPhoneNumber,
  UserWithConfidential
} from "../../libs";
import { Avatar, Stack } from "../../ui";

type Props = {
  user?: UserWithConfidential;
  children?: React.ReactNode;
};

export function UserPreview({ user, children }: Props) {
  const { theme, dictionary } = useSettings();
  const styles = makeStyles(theme.colors.placeholder);

  if (!user) {
    return null;
  }

  return (
    <Stack space={16}>
      <View style={styles.center}>
        <Avatar avatar={user.avatar} name={user.name} size={100} />
      </View>

      {user.blikNumber || user.bankAccount ? (
        <Stack space={5}>
          {user.blikNumber && (
            <View>
              <Text style={styles.placeholder}>{dictionary.phoneNumber}:</Text>
              <Text style={styles.confidentialText}>
                {formatPhoneNumber(user.blikNumber)}
              </Text>
            </View>
          )}
          {user.bankAccount && (
            <View>
              <Text style={styles.placeholder}>
                {dictionary.bankAccountNumber}:
              </Text>
              <Text style={styles.confidentialText}>
                {formatBankAccount(user.bankAccount)}
              </Text>
            </View>
          )}
        </Stack>
      ) : (
        <View style={styles.center}>
          <Text>{dictionary.noConfidentialsProvided}</Text>
        </View>
      )}
      {children && children}
    </Stack>
  );
}

const makeStyles = (placeholderColor: string) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
    },
    center: {
      alignItems: "center",
    },
    placeholder: {
      color: placeholderColor,
      fontSize: 12,
    },
    confidentialText: {
      fontSize: 18,
      marginTop: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
