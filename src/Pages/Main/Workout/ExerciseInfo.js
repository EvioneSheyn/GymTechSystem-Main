import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import React, { useEffect, useRef, useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ExerciseInfo() {
  const playerRef = useRef(null);
  const [videoId, setVideoId] = useState("acSm0vMpqBg");
  const [videoUrl, setVideoUrl] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const { exercise } = route.params;
  const [loading, setLoading] = useState(true);

  const instructions = [
    "Extend one arm straight in front of you, palm down.",
    "Use the other hand to gently pull fingers back toward you.",
    "Feel the stretch in your forearm and shoulder.",
    "Hold for the prescribed time.",
  ];
  const description =
    "Enhances flexibility in forearms and shoulders, reducing injury risk.";

  const fetchFirstVideo = async () => {
    try {
      const query = exercise.name; // your search query
      const queryURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        query
      )}`;

      setVideoUrl(queryURL);
    } catch (err) {
      console.error("Error fetching video:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchFirstVideo();
      setLoading(false);
    };
    load();
  }, []);

  return (
    <View
      style={{
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 14,
          alignItems: "center",
          padding: 10,
          marginBottom: 24,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" style={{ fontSize: 24 }} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>Info</Text>
      </View>
      <View style={{ gap: 0 }}>
        {!loading && (
          <YoutubePlayer
            ref={playerRef}
            height={220}
            play={true}
            videoId={videoId}
          />
        )}
        <Text>
          If player takes time to load, visit:{" "}
          <Text
            style={{
              color: "blue",
            }}
            onPress={() => Linking.openURL(videoUrl)}
          >
            Link to Tutorial Video
          </Text>
        </Text>
      </View>
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 24 }}>
          Description
        </Text>
        <Text
          style={{
            paddingHorizontal: 10,
          }}
        >
          {description}
        </Text>
      </View>

      <View>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 24 }}>
          Instructions
        </Text>
        {instructions.map((item, index) => (
          <Text
            style={{
              paddingHorizontal: 10,
            }}
            key={index}
          >
            - {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
