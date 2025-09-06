import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  Image,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getInstalledAppsFallback() {
  return [
    { id: "com.whatsapp", name: "WhatsApp", icon: null },
    { id: "com.instagram.android", name: "Instagram", icon: null },
    { id: "com.youtube", name: "YouTube", icon: null },
    { id: "com.facebook.katana", name: "Facebook", icon: null },
    { id: "com.twitter.android", name: "Twitter", icon: null },
    { id: "com.reddit.frontpage", name: "Reddit", icon: null },
  ];
}

export default function BlockerPageRN() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState({});
  const [limitModal, setLimitModal] = useState({ visible: false, appId: null });

  useEffect(() => {
    (async () => {
      const installed = await getInstalledAppsFallback();
      setApps(installed);
      const saved = await AsyncStorage.getItem("@blocker_settings");
      if (saved) setSelected(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@blocker_settings", JSON.stringify(selected));
  }, [selected]);

  const toggleAppBlocked = (appId) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (!next[appId]) next[appId] = { limitMins: 30, blocked: true };
      else next[appId].blocked = !next[appId].blocked;
      return next;
    });
  };

  const setAppLimit = (appId, mins) => {
    setSelected((prev) => ({
      ...prev,
      [appId]: { ...(prev[appId] || {}), limitMins: mins },
    }));
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
        );
      } catch (e) {
        console.warn(e);
      }
      Alert.alert(
        "Usage Access Needed",
        "Please enable usage access in system settings",
        [{ text: "Open", onPress: () => Linking.openSettings() }]
      );
    }
  };

  const renderApp = ({ item }) => {
    const s = selected[item.id] || { blocked: false, limitMins: 30 };
    return (
      <View style={styles.card}>
        <View style={styles.appLeft}>
          {item.icon ? (
            <Image source={{ uri: item.icon }} style={styles.appIcon} />
          ) : (
            <View style={styles.appIconPlaceholder}>
              <Text style={styles.appInitial}>{item.name[0]}</Text>
            </View>
          )}
          <View>
            <Text style={styles.appName}>{item.name}</Text>
            <Text style={styles.appMeta}>
              Limit: {s.limitMins} mins / day
            </Text>
          </View>
        </View>

        <View style={styles.appRight}>
          <TouchableOpacity
            onPress={() => setLimitModal({ visible: true, appId: item.id })}
            style={styles.limitBtn}
          >
            <Text style={styles.limitBtnText}>Set</Text>
          </TouchableOpacity>
          <Switch
            value={!!s.blocked}
            onValueChange={() => toggleAppBlocked(item.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Focus Blocker</Text>
      <Text style={styles.subText}>
        Manage your time by blocking distracting apps
      </Text>

      <FlatList
        data={apps}
        keyExtractor={(i) => i.id}
        renderItem={renderApp}
        style={{ width: "100%" }}
      />

      <TouchableOpacity style={styles.mainBtn} onPress={requestPermissions}>
        <Text style={styles.mainBtnText}>Request Permissions</Text>
      </TouchableOpacity>

      <Modal visible={limitModal.visible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set daily limit (minutes)</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.modalInput}
              value={String(
                (selected[limitModal.appId] || {}).limitMins || 30
              )}
              onChangeText={(t) =>
                setAppLimit(
                  limitModal.appId,
                  Math.max(0, Number(t) || 0)
                )
              }
            />
            <TouchableOpacity
              onPress={() => setLimitModal({ visible: false, appId: null })}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#6A5ACD", // gradient-like purple base
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
    marginBottom: 6,
    textAlign: "center",
  },
  subText: {
    color: "#E0E0E0",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  appLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  appIcon: { width: 40, height: 40, borderRadius: 10 },
  appIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E6E6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  appInitial: { color: "#6A5ACD", fontWeight: "700" },
  appName: { fontWeight: "600", fontSize: 16, color: "#333" },
  appMeta: { color: "#666", fontSize: 12 },
  appRight: { alignItems: "flex-end", gap: 6 },
  limitBtn: {
    backgroundColor: "#6A5ACD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  limitBtnText: { color: "#fff", fontSize: 12 },
  mainBtn: {
    marginTop: 20,
    backgroundColor: "#7B68EE",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  mainBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  modalTitle: { fontWeight: "700", fontSize: 16, marginBottom: 10 },
  modalInput: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: "#6A5ACD",
    padding: 10,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "600" },
});
