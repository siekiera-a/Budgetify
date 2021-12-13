import React, { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useHttp, useSettings, useStorage } from "../../contexts";
import { formatBankAccount, updateBankAccount } from "../../libs";
import { CloseEditingCallback, EditableField } from "./EditableField";

type BankAccount = {
  bankAccount: string;
};

type Props = {
  bankAccount: string;
};

const bankAccountRegex = /^\d{26}$/;

export function BankAccountField({ bankAccount }: Props) {
  const { dictionary } = useSettings();
  const { client } = useHttp();
  const { saveProfile } = useStorage();
  const closeEditingRef = useRef<CloseEditingCallback>();

  const { handleSubmit, control, reset } = useForm<BankAccount>({
    defaultValues: {
      bankAccount,
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const onCancel = useCallback(() => {
    reset({ bankAccount });
  }, [reset, bankAccount]);

  const onSave = useCallback(
    handleSubmit((data) => {
      const asyncFunc = async () => {
        const profile = await updateBankAccount(client, data.bankAccount);

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
      title={dictionary.bankAccountNumber}
      value={formatBankAccount(bankAccount)}
      onCancel={onCancel}
      onSave={onSave}
      closeEditingRef={closeEditingRef}
    >
      <Controller
        name="bankAccount"
        control={control}
        rules={{
          required: true,
          pattern: {
            value: bankAccountRegex,
            message: "invalid bank account number",
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
              label={dictionary.bankAccountNumber}
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
