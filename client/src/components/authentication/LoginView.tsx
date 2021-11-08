import { StatusCodes } from "http-status-codes";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useHttp, useSettings, useStorage } from "../../contexts";
import { ErrorResponse, signIn } from "../../libs";
import { ErrorMessage, SafeAreaView, Stack } from "../../ui";
import { Credentials } from "./types";

export function LoginView() {
  const { dictionary } = useSettings();
  const { client, setToken } = useHttp();
  const { saveProfile } = useStorage();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Credentials>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();

  const handleRequest = async (data: Credentials) => {
    try {
      const response = await signIn(client, data);
      await setToken(response.token);
      await saveProfile(response.profile);
    } catch (e) {
      const invalidCredentials =
        e instanceof ErrorResponse &&
        (e.error.status === StatusCodes.UNAUTHORIZED ||
          e.error.status === StatusCodes.BAD_REQUEST);

      setMessage(
        invalidCredentials
          ? dictionary.invalidCredentials
          : dictionary.unknownError
      );
      setLoading(false);
    }
  };

  const onSubmit = (data: Credentials) => {
    Keyboard.dismiss();
    setLoading(true);
    setMessage(undefined);
    handleRequest(data);
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
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
        >
          {dictionary.signIn}
        </Button>
        {message && <ErrorMessage message={message} />}
      </Stack>
    </SafeAreaView>
  );
}
