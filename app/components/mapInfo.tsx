import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  title: string;
  protests: number;
  accessibility: number;
};

export default function MapInfo({ title, protests, accessibility }: Props) {
  const buildingColors: any = {
    EV: "#FF9898",
    H: "#4CAF50",
    FB: "#a683eb",
    JMSB: "#2196F3",
    LB: "#FFC107",
  };

  return (
    <View style={styles.markerRoot}>
      <View style={[styles.bubble, { backgroundColor: buildingColors[title] }]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.row}>
          <View style={styles.item}>
            <Icon name="campaign" size={14} color="#fff" />
            <Text style={styles.text}>{protests}</Text>
          </View>

          <View style={styles.item}>
            <Icon name="accessible" size={14} color="#fff" />
            <Text style={styles.text}>{accessibility}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.arrow, { borderTopColor: buildingColors[title] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  markerRoot: {
    width: 90,
    height: 70,
    alignItems: "center",
    justifyContent: "flex-end",

    padding: 10,
  },

  container: {
    alignItems: "center",
  },

  bubble: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",

    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, .2)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    elevation: 8,

    zIndex: 1,
  },

  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 13,
    marginBottom: 2,
  },

  row: {
    flexDirection: "row",
    gap: 8,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -2,
    zIndex: 0,
  },
});
