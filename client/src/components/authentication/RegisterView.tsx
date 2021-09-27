import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { useSettings } from "../../contexts";
import { ErrorMessage, SafeAreaView, Stack } from "../../ui";
import { emailRegex, passwordRegex } from "./regexps";
import { RegistrationForm } from "./types";

export function RegisterView() {
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

  const onSubmit = (data: RegistrationForm) => {
    console.log(data);
  };

  const passwordsAreEquals = (retypedPassword: string) => {
    const { password } = getValues();
    const result = retypedPassword === password;

    if (result) {
      return true;
    }

    return dictionary.passwordsNotEquals;
  };

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
              minLength: { value: 3, message: dictionary.invalidUsername },
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
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {dictionary.signUp}
        </Button>
      </Stack>
    </SafeAreaView>
  );
}
