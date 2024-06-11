import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import NumericFormat from "@/components/NumericFormat";
import BigNumber from "bignumber.js";

describe("NumericFormat", () => {
  test("renders without crashing", () => {
    render(<NumericFormat value={new BigNumber(1234.5678)} />);
    expect(screen.getByText(/1234.5678/)).toBeInTheDocument();
  });

  test("formats number without trailing zeros when trimTrailingZeros is true", () => {
    render(
      <NumericFormat
        value={new BigNumber(1234.5678)}
        trimTrailingZeros={true}
      />,
    );
    expect(screen.getByText(/1234.5678/)).toBeInTheDocument();
  });

  test("formats number with trailing zeros when trimTrailingZeros is false", () => {
    render(
      <NumericFormat
        value={new BigNumber(1234.5678)}
        trimTrailingZeros={false}
      />,
    );
    expect(screen.getByText(/1234.56780000/)).toBeInTheDocument();
  });

  test("formats BigNumber value correctly", () => {
    render(<NumericFormat value={new BigNumber(1234.5678)} />);
    expect(screen.getByText(/1234.5678/)).toBeInTheDocument();
  });
});
