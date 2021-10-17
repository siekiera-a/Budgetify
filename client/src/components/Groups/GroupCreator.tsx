import React from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "../../ui";

interface Group {
  name: string;
}

export function GroupCreator() {
  const { control } = useForm<Group>();

  return (
    <SafeAreaView>
      <Controller
        name="name"
        control={control}
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
              mode="flat"
              label="Group name"
              error={invalid}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
