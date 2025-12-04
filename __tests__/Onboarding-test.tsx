import OnboardingScreen from "@/app/onboarding";
import * as asyncStorage from "@/utils/asyncStorage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));



jest.mock("@/utils/asyncStorage", () => ({
  __esModule: true,
  STORAGE_KEYS: {
    AUTH_TOKEN: "authToken",
    USER_DATA: "userData",
    HAS_COMPLETED_ONBOARDING: "hasCompletedOnboarding",
    FAVORITES: "favorites",
  },
  storeData: jest.fn().mockResolvedValue(undefined),
  getData: jest.fn(),
  removeData: jest.fn(),
}));

const mockScreenWidth = (width: number) => {
  jest.resetModules();

  jest.doMock("react-native", () => ({
    Dimensions: {
      get: () => ({ width }),
    },
  }));

  return require("../app/onboarding"); // <-- require sau mock
};

describe("OnboardingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("call storage when pressed skip button", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const { router } = require("expo-router");

    const skipButton = getByText("Skip!");
    fireEvent.press(skipButton);

    await waitFor(() => {
      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        "hasCompletedOnboarding",
        "true"
      );
    });
  });
  it("navigates to home on done", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const { router } = require("expo-router");

    const skipButton = getByText("Skip!");
    fireEvent.press(skipButton);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/home");
    });
  });
  it("advances slides and shows Get Started on final slide", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const nextButton = getByText("Next");

    const presses = require("@/constants").ONBOARDING_SLIDES.length - 1;
    for (let i = 0; i < presses; i++) {
      fireEvent.press(nextButton);
    }

    expect(getByText("Get Started")).toBeTruthy();
  });
  it("handleSkip: calls storeData with correct key and value", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const skipButton = getByText("Skip!");

    fireEvent.press(skipButton);

    await waitFor(() => {
      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        "hasCompletedOnboarding",
        "true"
      );
    });
  });

  it("handleSkip: navigates to /home after storeData succeeds", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const { router } = require("expo-router");
    const skipButton = getByText("Skip!");

    fireEvent.press(skipButton);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/home");
    });
  });
  it("handleNext: advances to next slide when not on last slide", async () => {
    const { getByText, queryByText } = render(<OnboardingScreen />);
    const nextButton = getByText("Next");

    expect(getByText("Next")).toBeTruthy();

    fireEvent.press(nextButton);

    expect(queryByText("Next")).toBeTruthy();
  });

  it("handleNext: shows Get Started button on final slide", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const nextButton = getByText("Next");

    const totalSlides = require("@/constants").ONBOARDING_SLIDES.length;
    const pressCount = totalSlides - 1;

    for (let i = 0; i < pressCount; i++) {
      fireEvent.press(nextButton);
    }

    await waitFor(() => {
      expect(getByText("Get Started")).toBeTruthy();
    });
  });

  it("handleDone: calls storeData when Get Started is pressed", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const nextButton = getByText("Next");

    const totalSlides = require("@/constants").ONBOARDING_SLIDES.length;
    const pressCount = totalSlides - 1;

    for (let i = 0; i < pressCount; i++) {
      fireEvent.press(nextButton);
    }

    const getStartedButton = await waitFor(() => getByText("Get Started"));
    fireEvent.press(getStartedButton);

    await waitFor(() => {
      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        "hasCompletedOnboarding",
        "true"
      );
    });
  });

  it("handleDone: navigates to /home when Get Started is pressed", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const { router } = require("expo-router");
    const nextButton = getByText("Next");

    const totalSlides = require("@/constants").ONBOARDING_SLIDES.length;
    const pressCount = totalSlides - 1;

    for (let i = 0; i < pressCount; i++) {
      fireEvent.press(nextButton);
    }

    const getStartedButton = await waitFor(() => getByText("Get Started"));
    fireEvent.press(getStartedButton);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/home");
    });
  });

  it("handleNext: skips all slides and reaches Get Started", async () => {
    const { getByText } = render(<OnboardingScreen />);
    const nextButton = getByText("Next");

    const totalSlides = require("@/constants").ONBOARDING_SLIDES.length;

    for (let i = 0; i < totalSlides - 1; i++) {
      fireEvent.press(nextButton);
    }

    expect(getByText("Get Started")).toBeTruthy();
  });
});


describe("RESPONSIVE breakpoints", () => {

  test("Small device (<=375)", () => {
    const { RESPONSIVE } = mockScreenWidth(360);
    expect(RESPONSIVE.logoFontSize).toBe(30);
    expect(RESPONSIVE.headerPaddingVertical).toBe(0);
  });

  test("Medium device (376 - 413)", () => {
    const { RESPONSIVE } = mockScreenWidth(390);
    expect(RESPONSIVE.logoFontSize).toBe(36);
    expect(RESPONSIVE.headerPaddingVertical).toBe(32);
  });

  test("Large device (>=414)", () => {
    const { RESPONSIVE } = mockScreenWidth(430);
    expect(RESPONSIVE.logoFontSize).toBe(48);
    expect(RESPONSIVE.headerPaddingVertical).toBe(48);
  });

});
