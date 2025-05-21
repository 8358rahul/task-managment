import NoDataFound from "@/components/NoDataFound";
import RenderVideoItem from "@/components/RenderVideoItem";
import { ThemedView } from "@/components/ThemedView";
import AndPoints from "@/constants/AndPoints";
import { useNetInfo } from "@/store/netInfo";
import { useVideoStore } from "@/store/videoStore";
import { fetcher } from "@/utils/fetcher";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text } from "react-native";
import { vs } from "react-native-size-matters";

export default function OfflineVideoScreen() {
  const { videoList, setVideoList } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true); 
  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (videoList?.length > 0) {
      setIsLoading(false);
      return;
    }
    fetchVideos();
  }, []);
  const [screenFocused, setScreenFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setScreenFocused(true);
      return () => {
        setScreenFocused(false);
      };
    }, [])
  );

  async function fetchVideos() {
    console.log("fetching videos");
    try {
      const data = await fetcher(AndPoints.VIDEOURL);
      setVideoList(data);
    } catch (e) {
      Alert.alert("Error", "Unable to load video list.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading)
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
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
            paused={!screenFocused}
          />
        )}
        contentContainerStyle={{ paddingBottom: vs(80) }}
      />
    </ThemedView>
  );
}
