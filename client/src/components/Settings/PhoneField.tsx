import React, { useCallback, useRef } from "react";
import { TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useHttp, useSettings, useStorage } from "../../contexts";
import { CloseEditingCallback, EditableField } from "./EditableField";
import { StyleSheet } from "react-native";
import { formatPhoneNumber, updatePhoneNumber } from "../../libs";

type Phone = {
  phone: string;
};

type Props = {
  phone: string;
};

const phoneRegex = /^\d{9}$/;

export function PhoneField({ phone }: Props) {
  const { dictionary } = useSettings();
  const { client } = useHttp();
  const { saveProfile } = useStorage();
  const closeEditingRef = useRef<CloseEditingCallback>();

  const { handleSubmit, control, reset } = useForm<Phone>({
    defaultValues: {
      phone,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const onCancel = useCallback(() => {
    reset({ phone });
  }, [reset, phone]);

  const onSave = useCallback(
    handleSubmit((data) => {
      const asyncFunc = async () => {
        const profile = await updatePhoneNumber(client, data.phone);

        saveProfile(profile);

        if (closeEditingRef.current) {
          closeEditingRef.current();
        }
      };

      asyncFunc();
    }),
    [closeEditingRef, handleSubmit, client, saveProfile]
  );

  return (
    <EditableField
      title={dictionary.phoneNumber}
      value={formatPhoneNumber(phone)}
      onCancel={onCancel}
      onSave={onSave}
      closeEditingRef={closeEditingRef}
    >
      <Controller
        name="phone"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: phoneRegex,
            message: "invalid phone number",
          },
        }}
        render={({
          field: { onChange, value, ref, onBlur },
          fieldState: { invalid },
        }) => {
          return (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              ref={ref}
              mode="outlined"
              label={dictionary.phoneNumber}
              error={invalid}
              style={styles.input}
            />
          );
        }}
      />
    </EditableField>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
  },
});
