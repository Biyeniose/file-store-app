import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";

interface CalendarComponentProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

interface CalendarComponentState {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
}

export default class CalendarComponent extends Component<
  CalendarComponentProps,
  CalendarComponentState
> {
  constructor(props: CalendarComponentProps) {
    super(props);
    this.state = {
      selectedStartDate: null,
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date: any, type: string) {
    if (type === "END_DATE") {
      this.setState({ selectedEndDate: date }, () => {
        this.props.onDateChange(
          this.state.selectedStartDate,
          this.state.selectedEndDate
        );
      });
    } else {
      this.setState({ selectedStartDate: date, selectedEndDate: null }, () => {
        this.props.onDateChange(
          this.state.selectedStartDate,
          this.state.selectedEndDate
        );
      });
    }
  }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2025, 6, 3);
    const startDate = selectedStartDate
      ? selectedStartDate.toISOString().split("T")[0]
      : "";
    const endDate = selectedEndDate
      ? selectedEndDate.toISOString().split("T")[0]
      : "";

    return (
      <View style={styles.cal}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
          todayBackgroundColor="#4285F4"
          selectedDayColor="#F28627"
          selectedDayTextColor="#FFFFFF"
          onDateChange={this.onDateChange}
        />

        <View></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cal: {
    backgroundColor: "#FFFFFF",
  },
});

//<Text>SELECTED START DATE: {startDate}</Text>
//<Text>SELECTED END DATE: {endDate}</Text>
