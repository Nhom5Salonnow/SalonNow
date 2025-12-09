import HomeScreen from "@/app/(tabs)/home";
import { HOME_CATEGORIES } from "@/constants";
import { render } from "@testing-library/react-native";

jest.mock("@/components/salon", () => ({
  HomeCategoryCard: ({ name }: { name: string }) => (
    <div testID={`category-${name}`}>{name}</div>
  ),
  PromoCard: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div testID={`promo-${title}`}>
      {title}
      {subtitle && <span>{subtitle}</span>}
    </div>
  ),
  SpecialistCard: ({ name }: { name: string }) => (
    <div testID={`specialist-${name}`}>{name}</div>
  ),
}));

jest.mock("@/constants", () => ({
  HOME_CATEGORIES: [
    { id: "1", name: "Hair Cut", imageUrl: "http://example.com/1.jpg" },
    { id: "2", name: "Hair Color", imageUrl: "http://example.com/2.jpg" },
    { id: "3", name: "Massage", imageUrl: "http://example.com/3.jpg" },
  ],
}));

describe("HomeScreen", () => {

  it("renders greeting text with default user name", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Hi")).toBeTruthy();
    expect(getByText("Doe John")).toBeTruthy();
  });

  it("renders profile image", () => {
    const { UNSAFE_getByType } = render(<HomeScreen />);
    const images = UNSAFE_getByType(require("react-native").Image);
    expect(images).toBeTruthy();
  });

  it("renders Categories section title", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Categories")).toBeTruthy();
  });

  it("renders all categories from HOME_CATEGORIES", () => {
    const { getByTestId } = render(<HomeScreen />);
    HOME_CATEGORIES.forEach((category) => {
      expect(getByTestId(`category-${category.name}`)).toBeTruthy();
    });
  });

  it("renders correct number of category cards", () => {
    const { getAllByTestId } = render(<HomeScreen />);
    const categoryCards = getAllByTestId(/^category-/);
    expect(categoryCards.length).toBe(HOME_CATEGORIES.length);
  });

  it("renders Hair Specialist section title", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Hair Specialist")).toBeTruthy();
  });

  it("renders all specialist cards", () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId("specialist-Doe John")).toBeTruthy();
    expect(getByTestId("specialist-Lucy")).toBeTruthy();
    expect(getByTestId("specialist-Laila")).toBeTruthy();
  });

  it("renders correct specialist information", () => {
    const { getByTestId } = render(<HomeScreen />);
    const specialists = [
      { id: "1", name: "Doe John", rating: 2, phone: "+732 8888 111" },
      { id: "2", name: "Lucy", rating: 2, phone: "+732 8888 111" },
      { id: "3", name: "Laila", rating: 0, phone: "+732 8888 111" },
    ];
    specialists.forEach((specialist) => {
      expect(getByTestId(`specialist-${specialist.name}`)).toBeTruthy();
    });
  });

  it("has correct number of specialist cards (3 specialists)", () => {
    const { getAllByTestId } = render(<HomeScreen />);
    const specialists = getAllByTestId(/^specialist-/);
    expect(specialists.length).toBe(3);
  });
});
