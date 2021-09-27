import React from "react";
import { OpaqueColorValue, View, ViewProps } from "react-native";
import { useList } from "../hooks/useList";
import { Divider } from "react-native-paper";

interface Props extends ViewProps {
  children: React.ReactNode;
  space: number;
  direction?: "column" | "column-reverse";
  withSeparator?: boolean;
  separatorColor?: string | OpaqueColorValue;
}

export function Stack({
  children,
  space,
  direction = "column",
  withSeparator = false,
  separatorColor,
  style,
  ...rest
}: Props) {
  const elements = React.Children.toArray(children);
  const list = useList(elements);

  return (
    <View
      style={[
        style,
        {
          flexDirection: direction,
        },
      ]}
      {...rest}
    >
      {list.map(([child, { isLast }], index) => {
        if (isLast) {
          return child;
        }
        return (
          <React.Fragment key={index}>
            {child}
            {space > 0 && <View style={{ width: space, height: space }} />}
            {withSeparator && (
              <Divider style={{ backgroundColor: separatorColor }} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
