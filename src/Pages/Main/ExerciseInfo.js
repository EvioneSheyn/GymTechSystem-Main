import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "react-native-vector-icons";
import React, { useRef, useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation, useRoute } from "@react-navigation/native";

const ExerciseInfo = () => {
  const playerRef = useRef(null);
  const [videoId, setVideoId] = useState("catFklsra18");
  const navigation = useNavigation();
  const route = useRoute();
  const { exercise } = route.params;

  const instructions = [
    "Extend one arm straight in front of you, palm down.",
    "Use the other hand to gently pull fingers back toward you.",
    "Feel the stretch in your forearm and shoulder.",
    "Hold for the prescribed time.",
  ];
  const description =
    "Enhances flexibility in forearms and shoulders, reducing injury risk.";

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
        <YoutubePlayer
          ref={playerRef}
          height={220}
          play={true}
          videoId={videoId}
        />
        <Text>
          If player takes time to load, visit:{" "}
          <Text
            style={{
              color: "blue",
            }}
            onPress={() =>
              Linking.openURL(
                `https:://www.youtube.com/watch?v=${videoId}`
              )
            }
          >
            Link to Tutorial Video
          </Text>
        </Text>
      </View>
      <View>
        <Text
          style={{ fontWeight: "bold", fontSize: 18, marginTop: 24 }}
        >
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
        <Text
          style={{ fontWeight: "bold", fontSize: 18, marginTop: 24 }}
        >
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
};

export default ExerciseInfo;

const styles = StyleSheet.create({});
