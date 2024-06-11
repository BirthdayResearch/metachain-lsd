import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import BigNumber from "bignumber.js";
import NumericFormat from "@/components/NumericFormat";

describe("NumericFormat", () => {
  test("renders without crashing", () => {
    render(<NumericFormat value={new BigNumber(1234.5678)} />);
    expect(screen.getByText(/1234.5678/)).toBeInTheDocument();
  });

  test("formats '0.000000001' correctly when trimTrailingZeros is false", () => {
    render(<NumericFormat value={new BigNumber("0.000000001")} />);
    expect(screen.getByText(/0.00000000/)).toBeInTheDocument();
  });

  test("formats number with trailing zeros when trimTrailingZeros is false", () => {
    render(<NumericFormat value={new BigNumber(1234.5678)} />);
    expect(screen.getByText(/1234.56780000/)).toBeInTheDocument();
  });

  test("formats BigNumber value correctly when trimTrailingZeros is false", () => {
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

  test("formats '0.00' correctly when trimTrailingZeros is true", () => {
    render(
      <NumericFormat value={new BigNumber("0.00")} trimTrailingZeros={true} />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("formats '100.10000' correctly when trimTrailingZeros is true", () => {
    render(
      <NumericFormat
        value={new BigNumber("100.10000")}
        trimTrailingZeros={true}
      />,
    );
    expect(screen.getByText(100.1)).toBeInTheDocument();
  });
  test("formats '01.00' correctly when trimTrailingZeros is true", () => {
    render(
      <NumericFormat value={new BigNumber("01.00")} trimTrailingZeros={true} />,
    );
    expect(screen.getByText(1)).toBeInTheDocument();
  });
});
