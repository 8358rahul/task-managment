import { Colors } from "@/constants/Colors";
import { useVideoStore } from "@/store/videoStore";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, ScaledSheet } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

import VideoPlayer from "react-native-video-player";

export default function RenderVideoItem({
  item,
  isConnected, 
  paused,
}: {
  item: any;
  isConnected: boolean; 
  paused: boolean;
}) {
  const { downloaded, setDownloadedUri } = useVideoStore();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const isDownloaded = !!downloaded[item.id];
  const progress = progressMap[item.id] || 0; 
  const sourceUri = isDownloaded
    ? downloaded[item.id]
    : isConnected
    ? item.videoUrl
    : null;

  const downloadVideo = async () => {
    if (!isConnected) {
      Alert.alert("Offline", "Cannot download while offline.");
      return;
    }

    // Add null check for documentDirectory
    const documentDir = FileSystem.documentDirectory;
    if (!documentDir) {
      Alert.alert("Error", "Cannot access storage directory");
      return;
    }

    const uri = documentDir + `video_${item.id}.mp4`; // Now safe to use

    const callback = (dl: FileSystem.DownloadProgressData) => {
      const prog = dl.totalBytesExpectedToWrite
        ? dl.totalBytesWritten / dl.totalBytesExpectedToWrite
        : 0;
      setProgressMap((prev) => ({ ...prev, [item.id]: prog }));
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      item.videoUrl,
      uri,
      {},
      callback
    );

    try {
      setIsDownloading(true);
      const result = await downloadResumable.downloadAsync();

      if (!result) throw new Error("Download failed: no result");
      setDownloadedUri(item.id, result.uri);
    } catch (e) {
      console.error("Download error:", e);
      Alert.alert(
        "Download Error",
        e instanceof Error ? e.message : "Unknown error"
      );
    } finally {
      setIsDownloading(false);
    }
  };

    if (!sourceUri) {
    return (
      <ThemedView style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No video available offline.</Text>
        {isConnected && (
          <TouchableOpacity
            style={styles.offlineDownload}
            onPress={downloadVideo}
          >
            <Ionicons name="download" size={22} color={Colors.white} />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  } 


  return (
    <ThemedView style={styles.card}>
      <View style={styles.thumbnailWrapper}>
        <VideoPlayer 
          endWithThumbnail
          thumbnail={{
            uri: item.thumbnailUrl,
          }}
          source={{
            uri: sourceUri,
          }}
          onError={(e) => console.log(e)}
          showDuration={true}
          paused={paused}
        />

        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item?.duration}</Text>
        </View>

        {!isDownloaded && !isDownloading && (
          <TouchableOpacity style={styles.downloadIcon} onPress={downloadVideo}>
            <Ionicons name="download" size={ms(25)} color={Colors.white} />
          </TouchableOpacity>
        )}

        {isDownloading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={Colors.primary} size={"large"} />
            <ThemedText type="defaultSemiBold" style={styles.progressText}>
              {(progress * 100).toFixed(0)}%
            </ThemedText>
          </View>
        )}
      </View>

      <ThemedView style={styles.infoRow}>
        <Ionicons name="person-circle" size={ms(50)} color="#9ca3af" />
        <View style={styles.textContainer}>
          <ThemedText
            numberOfLines={2}
            type="defaultSemiBold"
            style={styles.titleText}
          >
            {item.title}
          </ThemedText>
          <ThemedText type="default" style={styles.metaText}>
            {item.author} • {item.views} views • {item.uploadTime}
          </ThemedText>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = ScaledSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  thumbnailWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  durationBadge: {
    position: "absolute",
    bottom: "8@ms",
    right: "8@ms",
    backgroundColor: "#000000cc",
    borderRadius: "4@ms",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: "#fff",
    fontSize: "12@ms",
  },
  downloadIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#00000070",
    padding: 6,
    borderRadius: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: "12@ms",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "12@ms",
    paddingHorizontal: "8@ms",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titleText: {
    fontSize: ms(12),
  },
  metaText: {
    fontSize: ms(10),
  },
    offlineDownload: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
    offlineText: {
    fontSize: 14,
    color: "#991b1b",
    marginBottom: 8,
  },
    offlineContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    marginBottom: 16,
  }, downloadText: {
    color: Colors.white,
    marginLeft: 6,
  },
});
