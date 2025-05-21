import NoDataFound from "@/components/NoDataFound";
import RenderVideoItem from "@/components/RenderVideoItem";
import AndPoints from "@/constants/AndPoints";
import { useVideoStore } from "@/store/videoStore";
import { fetcher } from "@/utils/fetcher";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from "react-native";
import { vs } from "react-native-size-matters";
import { VideoPlayerRef } from "react-native-video-player";

export default function OfflineVideoScreen() {
  const { videoList, setVideoList } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const playerRef = useRef<VideoPlayerRef>(null);

  // Fetch video list JSON
  useEffect(() => {
    if (videoList.length === 0) {
      fetchVideos();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchVideos() {
    try {
      const data = await fetcher(AndPoints.VIDEOURL);
      setVideoList(data);
    } catch (e) {
      Alert.alert("Error", "Unable to load video list.");
    } finally {
      setIsLoading(false);
    }
  }

  async function requestStoragePermission() {
    if (Platform.OS === "android" && Platform.Version >= 23) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      return (
        granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  }

  // NetInfo listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestStoragePermission();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "Storage permission is needed to download video."
        );
        return;
      }
    };
    getPermission();
    return () => {
      playerRef?.current?.pause();
    };
  }, []);

  if (isLoading)
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {!isConnected && (
        <Text style={{ color: "red", textAlign: "center" }}>Offline Mode</Text>
      )}
      <FlatList
        data={videoList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoDataFound onPress={() => fetchVideos()} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RenderVideoItem
            item={item}
            isConnected={isConnected}
            playerRef={playerRef}
          />
        )}
        contentContainerStyle={{ paddingBottom: vs(80) }}
      />
    </View>
  );
}
