import NoDataFound from "@/components/NoDataFound";
import RenderVideoItem from "@/components/RenderVideoItem";
import AndPoints from "@/constants/AndPoints";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { useVideoStore } from "@/store/videoStore";
import { fetcher } from "@/utils/fetcher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, vs } from "react-native-size-matters";

export default function OfflineVideoScreen() {
  const { videoList, setVideoList } = useVideoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigation = useNavigation();

  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: Array<{ item: any }> }) => {
      if (viewableItems.length > 0) {
        // only activate the first visible item
        setActiveVideoId(viewableItems[0].item.id);
      }
    }
  );

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 60,
  });

  // Fetch video list JSON
  useEffect(() => {
    fetchVideos();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const nextTheme =
              theme === "light"
                ? "dark"
                : theme === "dark"
                ? "system"
                : "light";
            setTheme(nextTheme);
          }}
          style={{ right: ms(10) }}
        >
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={ms(24)}
            color={Colors[resolvedTheme].icon}
          />
        </TouchableOpacity>
      ),
    });
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

  // NetInfo listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
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
            activeVideoId={activeVideoId}
            setActiveVideoId={setActiveVideoId}
          />
        )}
        contentContainerStyle={{ paddingBottom: vs(80) }}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />
    </View>
  );
}
