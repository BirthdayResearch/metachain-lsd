import React from "react";
import { render } from "@testing-library/react";
import JoinTheCommunitySection from "@/app/landing-page/components/JoinTheCommunitySection";

test("JoinTheCommunitySection matches snapshot", () => {
  const { asFragment } = render(<JoinTheCommunitySection />);
  expect(asFragment()).toMatchSnapshot();
});
