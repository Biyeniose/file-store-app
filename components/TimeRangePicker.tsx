import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimeRangePicker = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [validRange, setValidRange] = useState(true);
  const [timeRangeText, setTimeRangeText] = useState("");

  const timeOptions = Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2);
    const minute = index % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    validateTimeRange(value, endTime);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    validateTimeRange(startTime, value);
  };

  const validateTimeRange = (start: string, end: string) => {
    if (!start || !end) return;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    const diffInMinutes =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    if (diffInMinutes >= 30 && diffInMinutes <= 300) {
      setValidRange(true);
      setTimeRangeText(`Selected Time Range: ${start} - ${end}`);
    } else {
      setValidRange(false);
      setTimeRangeText("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Start Time:</Text>
      <Picker
        selectedValue={startTime}
        onValueChange={handleStartTimeChange}
        style={styles.picker}
      >
        <Picker.Item label="Select Start Time" value="" />
        {timeOptions.map((time) => (
          <Picker.Item key={time} label={time} value={time} />
        ))}
      </Picker>

      <Text style={styles.label}>End Time:</Text>
      <Picker
        selectedValue={endTime}
        onValueChange={handleEndTimeChange}
        style={styles.picker}
      >
        <Picker.Item label="Select End Time" value="" />
        {timeOptions.map((time) => (
          <Picker.Item key={time} label={time} value={time} />
        ))}
      </Picker>

      {!validRange && (
        <Text style={styles.errorText}>
          Please select a valid time range between 30 minutes and 5 hours.
        </Text>
      )}

      {timeRangeText && (
        <Text style={styles.timeRangeText}>{timeRangeText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  timeRangeText: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
});

export default TimeRangePicker;
