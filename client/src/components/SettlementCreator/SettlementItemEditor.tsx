import React, { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, View } from "react-native";
import { Button, IconButton, Surface, TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSettings } from "../../contexts";
import { AvatarGroup, Stack } from "../../ui";
import { Item, SettlementEvents as Events } from "./machine/model";

type Props = Item & {
  send: (event: Events) => void;
};

type Form = {
  name: string;
  price: string;
};

export function SettlementItemEditor({
  assignedUsers,
  name,
  price,
  send,
}: Props) {
  const { dictionary } = useSettings();
  const { control, handleSubmit } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name,
      price: price.toString(),
    },
  });

  const onSubmit = (data: Form) => {
    Keyboard.dismiss();
    const price = +data.price.replace(",", ".");
    send({
      type: "SAVE_ITEM",
      item: { name: data.name, price, assignedUsers },
    });
  };

  const openUsersWindow = useCallback(() => {
    Keyboard.dismiss();
    send({ type: "ASSIGN_USERS" });
  }, [send]);

  const onCancelPress = useCallback(() => {
    send({ type: "CANCEL" });
  }, [send]);

  const users = useMemo(
    () => assignedUsers.filter((user) => user.checked).map((user) => user.user),
    [assignedUsers]
  );

  return (
    <Surface style={styles.Surface}>
      <Stack space={12}>
        <View style={styles.formContainer}>
          <View style={[styles.nameContainer, styles.spacer]}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true, minLength: 1 }}
              render={({
                field: { onBlur, onChange, ref, value },
                fieldState: { invalid },
              }) => (
                <TextInput
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  ref={ref}
                  value={value}
                  error={invalid}
                  placeholder={dictionary.name}
                  style={styles.input}
                />
              )}
            />
          </View>
          <View style={styles.priceContainer}>
            <Controller
              name="price"
              control={control}
              rules={{
                pattern: {
                  value: /^\d+([\\.,]\d{1,2})?$/,
                  message: "invalid number",
                },
                required: true,
              }}
              render={({
                field: { onBlur, onChange, ref, value },
                fieldState: { invalid },
              }) => (
                <TextInput
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  ref={ref}
                  value={value}
                  error={invalid}
                  keyboardType="numeric"
                  placeholder="0,00"
                  style={styles.input}
                  right={
                    <TextInput.Affix
                      text="zł"
                      textStyle={{ position: "relative", top: 2 }}
                    />
                  }
                />
              )}
            />
          </View>
        </View>
        <View style={styles.avatarWrapper}>
          <AvatarGroup max={9} users={users} avatarSize={35} />
          <IconButton
            icon={(props) => <MaterialIcons name="edit" {...props} />}
            size={20}
            onPress={openUsersWindow}
          />
        </View>
        <View style={styles.buttonsWrapper}>
          <Button
            icon="check-bold"
            onPress={handleSubmit(onSubmit)}
            mode="contained"
            compact
            contentStyle={styles.button}
            labelStyle={styles.buttonLabel}
            style={styles.spacer}
            uppercase={false}
          >
            {dictionary.save}
          </Button>
          <Button
            mode="outlined"
            compact
            contentStyle={styles.button}
            labelStyle={styles.buttonLabel}
            uppercase={false}
            onPress={onCancelPress}
          >
            {dictionary.cancel}
          </Button>
        </View>
      </Stack>
    </Surface>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    height: 25,
  },
  buttonLabel: {
    fontSize: 12,
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    height: 35,
  },
  nameContainer: {
    flex: 7,
  },
  priceContainer: {
    flex: 3,
  },
  formContainer: {
    display: "flex",
    flexDirection: "row",
  },
  spacer: {
    marginRight: 16,
  },
  avatarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Surface: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
