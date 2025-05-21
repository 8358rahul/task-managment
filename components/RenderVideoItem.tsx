import { Colors } from "@/constants/Colors";
import { useVideoStore } from "@/store/videoStore";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, ScaledSheet } from "react-native-size-matters";
import Video, { VideoRef } from "react-native-video";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function RenderVideoItem({
  item,
  isConnected,
}: {
  item: any;
  isConnected: boolean;
}) {
  const { downloaded, setDownloadedUri } = useVideoStore();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const playerRef = useRef<VideoRef>(null);
  const [paused, setPaused] = React.useState(true);
const [currentTime, setCurrentTime] = useState(0);
const [showThumbnail, setShowThumbnail] = useState(true);

  const isDownloaded = !!downloaded[item.id];
  const progress = progressMap[item.id] || 0;

  const sourceUri = isDownloaded
    ? downloaded[item.id]
    : isConnected
    ? item.videoUrl
    : null;

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Pause video on screen unfocus
        setPaused(true);
      };
    }, [])
  );
  const downloadVideo = async () => {
    if (!isConnected) {
      Alert.alert("Offline", "Cannot download while offline.");
      return;
    }

    const uri = FileSystem.documentDirectory + `video_${item.id}.mp4`;

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
      const { uri: localUri }: any = await downloadResumable.downloadAsync();
      setDownloadedUri(item.id, localUri);
    } catch (e) {
      console.error("Download error:", e);
      Alert.alert("Download Error", "Unable to download this video.");
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
        <View style={styles.controlButtons}>
  <TouchableOpacity
    onPress={() => {
      if (playerRef.current) {
        playerRef.current.seek(Math.max(currentTime - 10, 0));
      }
    }}
    style={styles.skipButton}
  >
    <Ionicons name="play-back" size={24} color={Colors.white} />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      if (playerRef.current) {
        playerRef.current.seek(currentTime + 10);
      }
    }}
    style={styles.skipButton}
  >
    <Ionicons name="play-forward" size={24} color={Colors.white} />
  </TouchableOpacity>
</View>

        <Video
          ref={playerRef}
          source={{ uri: sourceUri }}
          style={styles.video}
          paused={paused}
          resizeMode="cover"
          onBuffer={({ isBuffering }) => console.log("Buffering:", isBuffering)}
          onError={(e) => console.log("Video error:", e)}
          onLoad={() => console.log("Video loaded")} 
          onProgress={({ currentTime }) => {
      setCurrentTime(currentTime);
      if (currentTime > 0) setShowThumbnail(false); // Hide thumbnail on play
    }}
    onEnd={() => {
      setPaused(true);
      setShowThumbnail(true); // Show thumbnail again on replay
    }}
    

        />
        {showThumbnail && (
    <Image
      source={{ uri: item.thumbnailUrl }}
      style={styles.video}
      resizeMode="cover"
    />
  )}

        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item?.duration}</Text>
        </View>

        {!isDownloaded && !isDownloading && (
          <TouchableOpacity style={styles.downloadIcon} onPress={downloadVideo}>
            <Ionicons name="download" size={22} color={Colors.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            setPaused(!paused);
          }}
        >
          <Ionicons
            name={paused ? "play" : "pause"}
            size={ms(30)}
            color={Colors.white}
          />
        </TouchableOpacity>

        {isDownloading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.progressText}>
              {(progress * 100).toFixed(0)}%
            </Text>
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
    bottom: 8,
    right: 8,
    backgroundColor: "#000000cc",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
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
    fontSize: 12,
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
  offlineContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    marginBottom: 16,
  },
  offlineText: {
    fontSize: 14,
    color: "#991b1b",
    marginBottom: 8,
  },
  offlineDownload: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  downloadText: {
    color: Colors.white,
    marginLeft: 6,
  },
  playButton: {
    position: "absolute",
    backgroundColor: "#00000070",
    padding: 6,
    borderRadius: 20,
    zIndex: 100,

    top: 10,
    left: 10,
 
  },
  controlButtons: {
  position: "absolute",
  bottom: 12,
  left: 12,
  flexDirection: "row",
  gap: 16,
  zIndex: 50,
},

skipButton: {
  backgroundColor: "#00000088",
  padding: 10,
  borderRadius: 20,
},

});
