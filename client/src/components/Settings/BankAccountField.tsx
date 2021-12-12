import React, { useCallback, useRef } from "react";
import { TextInput } from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { useSettings } from "../../contexts";
import { CloseEditingCallback, EditableField } from "./EditableField";
import { StyleSheet } from "react-native";
import { formatBankAccount } from "../../libs";

type BankAccount = {
  bankAccount: string;
};

type Props = {
  bankAccount: string;
};

const bankAccountRegex = /^\d{26}$/;

export function BankAccountField({ bankAccount }: Props) {
  const { dictionary } = useSettings();
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
      console.log(data);
      if (closeEditingRef.current) {
        closeEditingRef.current();
      }
    }), [closeEditingRef, handleSubmit]);

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
