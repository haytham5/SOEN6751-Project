import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "./components/bottomNav";
import { saveNewReport } from "./data/reportSH";
import { styles } from "./styles/addReportStyles";

export default function AddReport() {
  const router = useRouter();

  const [image, setImage] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("EV");
  const [floor, setFloor] = useState("1");
  const [type, setType] = useState<"protest" | "event" | "accessibility">(
    "protest",
  );
  const [description, setDescription] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitReport = () => {
    saveNewReport({
      id: Date.now().toString(),
      name,
      description,
      type,
      building,
      floor,
      image,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    console.log("Report added");

    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Report</Text>
        </View>

        {/* Report Form */}
        <View style={styles.form}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imageText}>Tap to add photo</Text>
            )}
          </TouchableOpacity>

          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Report name"
            value={name}
            onChangeText={setName}
          />

          {/* Type */}
          <View style={styles.dropdown}>
            <Picker selectedValue={type} onValueChange={setType}>
              <Picker.Item label="Protest" value="protest" />
              <Picker.Item label="Event" value="event" />
              <Picker.Item label="Accessibility" value="accessibility" />
            </Picker>
          </View>

          {/* Building */}
          <View style={styles.dropdown}>
            <Picker selectedValue={building} onValueChange={setBuilding}>
              <Picker.Item label="EV Building" value="EV" />
              <Picker.Item label="Hall Building" value="H" />
              <Picker.Item label="JMSB" value="JMSB" />
              <Picker.Item label="Library (LB)" value="LB" />
              <Picker.Item label="Faubourg (FB)" value="FB" />
            </Picker>
          </View>

          {/* Floor */}
          <TextInput
            style={styles.input}
            placeholder="Floor"
            value={floor}
            onChangeText={setFloor}
          />

          {/* Description */}
          <TextInput
            style={styles.description}
            placeholder="Summary of the Event..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}
