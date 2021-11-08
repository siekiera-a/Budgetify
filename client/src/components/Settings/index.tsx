import React, { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Caption, List, Surface, Title } from "react-native-paper";
import { useHttp, useSettings, useStorage } from "../../contexts";
import { EditImage, SafeAreaView } from "../../ui";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Settings() {
  const { theme, dictionary, clearSettings } = useSettings();
  const { profile } = useStorage();
  const { setToken } = useHttp();

  const logout = useCallback(() => {
    clearSettings();
    setToken("");
  }, [setToken, clearSettings]);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        {profile && (
          <Surface style={styles.profileSurface}>
            <EditImage
              image={profile.avatar}
              size={105}
              backgroundColor={theme.colors.background}
              borderColor={theme.colors.border}
            />
            <View style={styles.profileTextContainer}>
              <Title>{profile.name}</Title>
              <Caption>{profile.email}</Caption>
            </View>
          </Surface>
        )}
        <ScrollView style={styles.settingContainer}>
          <List.Item title={dictionary.darkTheme} right={ThemeSwitcher} />
        </ScrollView>
      </View>
      <Button mode="contained" style={styles.logoutButton} onPress={logout}>
        {dictionary.logout}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  profileSurface: {
    width: "100%",
    padding: 16,
    elevation: 2,
    borderRadius: 15,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  profileTextContainer: {
    marginLeft: 20,
    justifyContent: "center",
  },
  settingContainer: {
    marginTop: 16,
  },
  logoutButton: {
    alignSelf: "flex-end",
    width: "100%",
  },
});
