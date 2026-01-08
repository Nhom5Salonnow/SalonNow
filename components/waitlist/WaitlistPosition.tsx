import React from "react";
import { View, Text } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { Users, Clock, TrendingUp } from "lucide-react-native";

interface WaitlistPositionProps {
  position: number;
  totalInQueue: number;
  estimatedWaitMinutes?: number;
  showDetails?: boolean;
}

export const WaitlistPosition: React.FC<WaitlistPositionProps> = ({
  position,
  totalInQueue,
  estimatedWaitMinutes = 30,
  showDetails = true,
}) => {
  return (
    <View
      className="rounded-2xl"
      style={{
        backgroundColor: Colors.salon.pinkLight,
        padding: wp(5),
      }}
    >
      {/* Position Display */}
      <View className="items-center">
        <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>
          Your Position in Queue
        </Text>
        <Text
          style={{
            fontSize: rf(64),
            fontWeight: "700",
            color: Colors.primary,
            lineHeight: rf(70),
          }}
        >
          #{position}
        </Text>
        <Text style={{ fontSize: rf(14), color: Colors.gray[500] }}>
          out of {totalInQueue} people waiting
        </Text>
      </View>

      {showDetails && (
        <View
          className="flex-row justify-around"
          style={{
            marginTop: hp(3),
            paddingTop: hp(2),
            borderTopWidth: 1,
            borderTopColor: "rgba(0,0,0,0.1)",
          }}
        >
          {/* People Ahead */}
          <View className="items-center">
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: wp(12),
                height: wp(12),
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <Users size={rf(20)} color={Colors.primary} />
            </View>
            <Text
              style={{
                fontSize: rf(18),
                fontWeight: "600",
                color: "#000",
                marginTop: hp(1),
              }}
            >
              {position - 1}
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>
              People Ahead
            </Text>
          </View>

          {/* Estimated Wait */}
          <View className="items-center">
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: wp(12),
                height: wp(12),
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <Clock size={rf(20)} color={Colors.primary} />
            </View>
            <Text
              style={{
                fontSize: rf(18),
                fontWeight: "600",
                color: "#000",
                marginTop: hp(1),
              }}
            >
              ~{estimatedWaitMinutes * position}
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>
              Min Est. Wait
            </Text>
          </View>

          {/* Conversion Rate */}
          <View className="items-center">
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: wp(12),
                height: wp(12),
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <TrendingUp size={rf(20)} color={Colors.primary} />
            </View>
            <Text
              style={{
                fontSize: rf(18),
                fontWeight: "600",
                color: "#000",
                marginTop: hp(1),
              }}
            >
              85%
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>
              Success Rate
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default WaitlistPosition;
