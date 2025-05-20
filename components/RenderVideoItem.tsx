import { useVideoStore } from "@/store/videoStore";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
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
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function RenderVideoItem({
  item,
  isConnected,
  activeVideoId,
  setActiveVideoId,
}: {
  item: any;
  isConnected: boolean;
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}) {
  const { downloaded, setDownloadedUri } = useVideoStore();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const isDownloaded = !!downloaded[item.id];
  const progress = progressMap[item.id] || 0;
  const sourceUri = isDownloaded
    ? downloaded[item.id]
    : isConnected
    ? item.videoUrl
    : null;

  const player = useVideoPlayer({ uri: sourceUri });
  useEffect(() => {
    if (!player) return;

    if (activeVideoId === item.id) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }, [activeVideoId, player]);

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
      <View>
        <Text>No video available offline.</Text>
        {/* Optionally, download button */}
      </View>
    );
  }

  return (
    <ThemedView style={styles.card}>
      <View style={styles.thumbnailWrapper}>
        <TouchableOpacity onPress={() => setActiveVideoId(item.id)}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          {isPlaying && (
            <VideoView
              player={player}
              style={[
                styles.thumbnail,
                { position: "absolute", top: 0, left: 0 },
              ]}
              allowsFullscreen
              allowsPictureInPicture
            />
          )}
        </TouchableOpacity>

        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>

        {/* Download Button */}
        {!isDownloaded && !isDownloading && (
          <TouchableOpacity style={styles.downloadIcon} onPress={downloadVideo}>
            <Ionicons name="download" size={22} color="#fff" />
          </TouchableOpacity>
        )}

        {isDownloading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.progressText}>
              {(progress * 100).toFixed(0)}%
            </Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <ThemedView style={styles.infoRow}>
        <Ionicons name="person-circle" size={ms(50)} color="#9ca3af" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <ThemedText numberOfLines={2} type="defaultSemiBold" style={{fontSize:ms(12)}}>
            {item.title}
          </ThemedText>
          <ThemedText type="default" style={{fontSize:ms(10)}}>
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
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
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
  
});
