import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StatusCodes } from "http-status-codes";
import { Keyboard } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useHttp, useSettings, useStorage } from "../../contexts";
import { ErrorResponse, signUp } from "../../libs";
import { ErrorMessage, SafeAreaView, Stack } from "../../ui";
import { StackAuthenticationNavigationParamList } from "../navigation/types";
import { emailRegex, nameRegex, passwordRegex } from "./regexps";
import { RegistrationForm } from "./types";

type Props = StackScreenProps<StackAuthenticationNavigationParamList, "SignIn">;

export function RegisterView({ navigation }: Props) {
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<RegistrationForm>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const { dictionary } = useSettings();
  const { client, setToken } = useHttp();
  const { saveProfile } = useStorage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();

  const handleRequest = async (data: RegistrationForm) => {
    try {
      const response = await signUp(client, data);
      await setToken(response.token);
      await saveProfile(response.profile);
    } catch (e) {
      const knownError =
        e instanceof ErrorResponse &&
        e.error.status &&
        e.error.status === StatusCodes.CONFLICT;

      setMessage(
        knownError ? dictionary.userAlreadyExists : dictionary.unknownError
      );
      setLoading(false);
    }
  };

  const onSubmit = (data: RegistrationForm) => {
    Keyboard.dismiss();
    setLoading(true);
    setMessage(undefined);
    handleRequest(data);
  };

  const passwordsAreEquals = (retypedPassword: string) => {
    const { password } = getValues();
    const result = retypedPassword === password;

    if (result) {
      return true;
    }

    return dictionary.passwordsNotEquals;
  };

  const onSignInPress = useCallback(() => {
    navigation.replace("SignIn");
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Stack space={10} style={{ paddingHorizontal: 16 }}>
        <Stack space={5}>
          <Controller
            name="name"
            render={({
              field: { onBlur, onChange, value, ref },
              fieldState: { invalid },
            }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                mode="outlined"
                label={dictionary.nameLabel}
                error={invalid}
              />
            )}
            control={control}
            rules={{
              required: { value: true, message: dictionary.requiredField },
              pattern: {
                value: nameRegex,
                message: dictionary.invalidUsername,
              },
            }}
          />
          {errors.name && errors.name.message && (
            <ErrorMessage message={errors.name.message} />
          )}
        </Stack>
        <Stack space={5}>
          <Controller
            name="email"
            render={({
              field: { onBlur, onChange, value, ref },
              fieldState: { invalid },
            }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                mode="outlined"
                label={dictionary.emailLabel}
                error={invalid}
              />
            )}
            control={control}
            rules={{
              required: { value: true, message: dictionary.requiredField },
              pattern: { value: emailRegex, message: dictionary.invalidEmail },
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
              field: { onBlur, onChange, value, ref },
              fieldState: { invalid },
            }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                mode="outlined"
                label={dictionary.passwordLabel}
                error={invalid}
                secureTextEntry
              />
            )}
            control={control}
            rules={{
              required: { value: true, message: dictionary.requiredField },
              pattern: {
                value: passwordRegex,
                message: dictionary.passwordTooWeak,
              },
            }}
          />
          {errors.password && errors.password.message && (
            <ErrorMessage message={errors.password.message} />
          )}
        </Stack>
        <Stack space={5}>
          <Controller
            name="retypedPassword"
            render={({
              field: { onBlur, onChange, value, ref },
              fieldState: { invalid },
            }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                mode="outlined"
                label={dictionary.retypedPasswordLabel}
                error={invalid}
                secureTextEntry
              />
            )}
            control={control}
            rules={{
              required: { value: true, message: dictionary.requiredField },
              validate: passwordsAreEquals,
            }}
          />
          {errors.retypedPassword && errors.retypedPassword.message && (
            <ErrorMessage message={errors.retypedPassword.message} />
          )}
        </Stack>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
        >
          {dictionary.signUp}
        </Button>
        <Button mode="outlined" onPress={onSignInPress}>
          {dictionary.signIn}
        </Button>
        {message && <ErrorMessage message={message} />}
      </Stack>
    </SafeAreaView>
  );
}
