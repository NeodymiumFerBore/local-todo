import { GUID } from "../src/types";
import { webcrypto } from "node:crypto";

// Setup crypto module for jest jsdom environment
Object.defineProperty(globalThis, "crypto", {
  value: webcrypto,
});

describe("GUID class", () => {
  it("should generate valid GUID", () => {
    expect(GUID.validate(new GUID().toString())).toBeTruthy();
  });
});

describe("GUID class", () => {
  it("should accept a valid GUID string", () => {
    const t = "b00f19ed-11ff-4d1b-9282-e1438fb8d2cb";
    expect(new GUID(t).toString()).toEqual(t);
  });
});

describe("GUID class", () => {
  it("should refuse an invalid GUID string", () => {
    const failureCases = [
      "b00f19ed-11ff-4d1b9282-e1438fb8d2cb", // Missing -
      "b00f19ed-11ff-4d1b-9282-g1438fb8d2cb", // Letter g not hexa
      "b00f19ed-11ff-4d1b-9282-e1438fb8d2cba", // Too long
      "b00f19ed-11ff-4d1b-9282", // Too short
      "", // Empty should fail
    ];

    failureCases.forEach((e) => {
      expect(() => {
        new GUID(e);
      }).toThrow("String '" + e + "' is not a valid GUID");
    });
  });
});
