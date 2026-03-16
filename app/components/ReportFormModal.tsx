import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { X } from "lucide-react-native";
import { saveNewReport } from "../data/reportSH";
import { styles } from "../styles/reportFormModalStyles";

interface ReportFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmitSuccess?: () => void | Promise<void>;
}

const TOTAL_STEPS = 4;

export default function ReportFormModal({
                                            visible,
                                            onClose,
                                            onSubmitSuccess,
                                        }: ReportFormModalProps) {
    const [step, setStep] = useState(1);

    const [image, setImage] = useState<string | undefined>(undefined);
    const [name, setName] = useState("");
    const [building, setBuilding] = useState("EV");
    const [floor, setFloor] = useState("1");
    const [type, setType] = useState<"protest" | "event" | "accessibility">(
        "protest",
    );
    const [description, setDescription] = useState("");

    // const progressPercent = useMemo(() => {
    //     return `${(step / TOTAL_STEPS) * 100}%`;
    // }, [step]);
    const progressPercent = `${(step / TOTAL_STEPS) * 100}%` as `${number}%`;

    const stepTitle = useMemo(() => {
        switch (step) {
            case 1:
                return "Report Type";
            case 2:
                return "Location";
            case 3:
                return "Details";
            case 4:
                return "Photo & Submit";
            default:
                return "Add Report";
        }
    }, [step]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const resetForm = () => {
        setStep(1);
        setImage(undefined);
        setName("");
        setBuilding("EV");
        setFloor("1");
        setType("protest");
        setDescription("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const goNext = () => {
        if (step < TOTAL_STEPS) {
            setStep((prev) => prev + 1);
        }
    };

    const goBack = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const submitReport = async () => {
        await saveNewReport({
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

        resetForm();
        onClose();

        if (onSubmitSuccess) {
            await onSubmitSuccess();
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepLabel}>What kind of report is this?</Text>

                        <View style={styles.dropdown}>
                            <Picker selectedValue={type} onValueChange={setType}>
                                <Picker.Item label="Protest" value="protest" />
                                <Picker.Item label="Event" value="event" />
                                <Picker.Item label="Accessibility" value="accessibility" />
                            </Picker>
                        </View>

                        <View style={styles.helperBox}>
                            <Text style={styles.helperText}>
                                Choose the category that best matches what you are reporting.
                            </Text>
                        </View>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepLabel}>Where is it happening?</Text>

                        <View style={styles.dropdown}>
                            <Picker selectedValue={building} onValueChange={setBuilding}>
                                <Picker.Item label="EV Building" value="EV" />
                                <Picker.Item label="Hall Building" value="H" />
                                <Picker.Item label="JMSB" value="JMSB" />
                                <Picker.Item label="Library (LB)" value="LB" />
                                <Picker.Item label="Faubourg (FB)" value="FB" />
                            </Picker>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Floor"
                            value={floor}
                            onChangeText={setFloor}
                            placeholderTextColor="#777"
                        />
                    </View>
                );

            case 3:
                return (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepLabel}>Describe the report</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Report name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#777"
                        />

                        <TextInput
                            style={styles.description}
                            placeholder="Summary of the event..."
                            multiline
                            numberOfLines={5}
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor="#777"
                        />
                    </View>
                );

            case 4:
                return (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepLabel}>Add an optional photo</Text>

                        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
                            ) : (
                                <Text style={styles.imageText}>Tap to add photo</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.reviewCard}>
                            <Text style={styles.reviewTitle}>Review</Text>
                            <Text style={styles.reviewText}>Type: {type}</Text>
                            <Text style={styles.reviewText}>Building: {building}</Text>
                            <Text style={styles.reviewText}>Floor: {floor}</Text>
                            <Text style={styles.reviewText}>Title: {name || "—"}</Text>
                            <Text style={styles.reviewText}>
                                Description: {description || "—"}
                            </Text>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={handleClose} />

                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <View style={styles.headerTextBlock}>
                            <Text style={styles.title}>Add Report</Text>
                            <Text style={styles.stepTitle}>
                                Step {step} of {TOTAL_STEPS} · {stepTitle}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                            <X size={22} color="#111111" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: progressPercent }]} />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.form}
                    >
                        {renderStepContent()}
                    </ScrollView>

                    <View style={styles.footer}>
                        {step > 1 ? (
                            <TouchableOpacity style={styles.secondaryButton} onPress={goBack}>
                                <Text style={styles.secondaryButtonText}>Back</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.footerSpacer} />
                        )}

                        {step < TOTAL_STEPS ? (
                            <TouchableOpacity style={styles.submitButton} onPress={goNext}>
                                <Text style={styles.submitText}>Next</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={submitReport}
                            >
                                <Text style={styles.submitText}>Submit Report</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}