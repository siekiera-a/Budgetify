import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useSettings } from "../../contexts";
import { SafeAreaView, Stack } from "../../ui";
import { Credentials } from "./types";

export function LoginView() {
  const { dictionary } = useSettings();
  const { colors } = useTheme();
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
          {errors.email && (
            <Text style={{ color: colors.error }}>{errors.email.message}</Text>
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
          {errors.password && (
            <Text style={{ color: colors.error }}>
              {errors.password.message}
            </Text>
          )}
        </Stack>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {dictionary.signIn}
        </Button>
      </Stack>
    </SafeAreaView>
  );
}
