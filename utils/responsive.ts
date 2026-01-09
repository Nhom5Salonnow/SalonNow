import { Dimensions } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const { width, height } = Dimensions.get("window");

export { scale, verticalScale, moderateScale, moderateVerticalScale };
export { scale as s, verticalScale as vs, moderateScale as ms };
export { moderateVerticalScale as mvs };

export { wp, hp };

export { RFValue, RFPercentage };
export { RFValue as rf };

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
