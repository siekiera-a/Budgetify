import React, {memo} from "react";
import {useWindowDimensions} from "react-native";
import {PieChart} from "react-native-chart-kit";
import {useSettings} from "../../contexts";

type Props = {
  expenses: number;
  settled: number;
  waiting: number;
  notPaid: number;
};

export const Chart = memo(function Chart({
  expenses,
  settled,
  waiting,
  notPaid,
}: Props) {
  const { width } = useWindowDimensions();
  const { dictionary } = useSettings();

  const data = [
    {
      value: expenses,
      color: "#4361CB",
      name: dictionary.expenses,
      legendFontColor,
      legendFontSize,
    },
    {
      value: settled,
      color: "#38C938",
      name: dictionary.settled,
      legendFontColor,
      legendFontSize,
    },
    {
      value: waiting,
      color: "#ffd60a",
      name: dictionary.PENDING,
      legendFontColor,
      legendFontSize,
    },
    {
      value: notPaid,
      color: "#EDCCAB",
      name: dictionary.notPaid,
      legendFontColor,
      legendFontSize,
    },
  ];

  return (
    <PieChart
      data={data}
      width={width}
      height={200}
      accessor="value"
      chartConfig={{
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        
      }}
      backgroundColor="transparent"
      paddingLeft="0"
      avoidFalseZero

    />
  );
});

const legendFontSize = 12
const legendFontColor = "#7F7F7F"
