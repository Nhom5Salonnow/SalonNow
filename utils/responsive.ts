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

// ============================================
// RE-EXPORT FROM LIBRARIES
// ============================================

// From react-native-size-matters
// - scale(size): Scale theo chiều ngang
// - verticalScale(size): Scale theo chiều dọc
// - moderateScale(size, factor?): Scale vừa phải (mặc định factor = 0.5)
// - moderateVerticalScale(size, factor?): Scale dọc vừa phải
export { scale, verticalScale, moderateScale, moderateVerticalScale };
export { scale as s, verticalScale as vs, moderateScale as ms };
export { moderateVerticalScale as mvs };

// From react-native-responsive-screen
// - wp(percentage): Width theo phần trăm màn hình
// - hp(percentage): Height theo phần trăm màn hình
export { wp, hp };

// From react-native-responsive-fontsize
// - RFValue(fontSize, standardHeight?): Font size responsive
// - RFPercentage(percent): Font size theo % chiều cao màn hình
export { RFValue, RFPercentage };
export { RFValue as rf };

// ============================================
// SCREEN DIMENSIONS
// ============================================
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// ============================================
// USAGE GUIDE
// ============================================
/**
 * 1. LAYOUT - Dùng Flexbox + Percentage (wp, hp)
 *    <View style={{ paddingHorizontal: wp(5), marginTop: hp(2) }}>
 *    <View style={{ width: wp(80), height: hp(50) }}>
 *
 * 2. FONT SIZE - Dùng RFValue hoặc moderateScale
 *    <Text style={{ fontSize: rf(16) }}>        // Responsive font
 *    <Text style={{ fontSize: ms(16) }}>        // Moderate scale font
 *
 * 3. SPACING/SIZING cố định - Dùng scale functions
 *    <View style={{ padding: s(16), height: vs(100) }}>
 *    <View style={{ borderRadius: ms(12) }}>
 *
 * 4. Kết hợp với Flexbox
 *    <View style={{ flex: 1, paddingHorizontal: wp(5) }}>
 *      <View style={{ flex: 0.3 }}>Header</View>
 *      <View style={{ flex: 0.7 }}>Content</View>
 *    </View>
 */
