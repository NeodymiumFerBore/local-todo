import { GUID } from "../src/types";

describe("GUID class", () => {
  it("should generate valid GUID", () => {
    expect(GUID.validate(new GUID().toString())).toBeTruthy();
  });
});

describe("GUID class", () => {
  it("should accept a valid GUID string", () => {
    let guid = new GUID("b00f19ed-11ff-4d1b-9282-e1438fb8d2cb");
    expect(guid.toString()).toEqual("b00f19ed-11ff-4d1b-9282-e1438fb8d2cb");
  });
});

describe("GUID class", () => {
  it("should refuse an invalid GUID string", () => {
    let failureCases = [
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
