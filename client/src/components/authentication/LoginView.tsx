import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { useSettings } from "../../contexts";
import { ErrorMessage, SafeAreaView, Stack } from "../../ui";
import { Credentials } from "./types";

export function LoginView() {
  const { dictionary } = useSettings();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Credentials>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = (data: Credentials) => {
    console.log(data);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Stack space={10} style={{ paddingHorizontal: 16 }}>
        <Stack space={5}>
          <Controller
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
                  label={dictionary.emailLabel}
                  error={invalid}
                />
              );
            }}
            name="email"
            control={control}
            rules={{
              required: { value: true, message: dictionary.requiredField },
            }}
          />
          {errors.email && errors.email.message && (
            <ErrorMessage message={errors.email.message} />
          )}
        </Stack>
        <Stack space={5}>
          <Controller
            name="password"
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
                  secureTextEntry
                  mode="outlined"
                  label={dictionary.passwordLabel}
                  error={invalid}
                />
              );
            }}
            control={control}
            rules={{
              required: { value: true, message: dictionary.requiredField },
            }}
          />
          {errors.password && errors.password.message && (
            <ErrorMessage message={errors.password.message} />
          )}
        </Stack>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {dictionary.signIn}
        </Button>
      </Stack>
    </SafeAreaView>
  );
}
