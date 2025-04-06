import { PermissionsAndroid, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

export const requestPermissionAndroid = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    getToken();
  } else {
    Alert.alert("Permission denied");
  }
};

export const getToken = async () => {
  const token = await messaging().getToken();
  console.warn("token", token);
};

export const setupNotificationListeners = () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    onDisplayNotification(remoteMessage);
  });
  return unsubscribe;
};

const onDisplayNotification = async (remoteMessage) => {
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId,
      smallIcon: "ic_launcher",
      pressAction: { id: "default" },
    },
  });
};