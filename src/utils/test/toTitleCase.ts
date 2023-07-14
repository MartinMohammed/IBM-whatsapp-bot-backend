import toTitleCase from "../toTitleCase";

describe("toTitleCase", () => {
    it("should convert a lowercase string to title case", () => {
      const input = "hello world";
      const expectedOutput = "Hello World";
      const result = toTitleCase(input);
      expect(result).toBe(expectedOutput);
    });
  
    it("should convert an uppercase string to title case", () => {
      const input = "HELLO WORLD";
      const expectedOutput = "Hello World";
      const result = toTitleCase(input);
      expect(result).toBe(expectedOutput);
    });
  
    it("should maintain the title case of a string", () => {
      const input = "Hello World";
      const expectedOutput = "Hello World";
      const result = toTitleCase(input);
      expect(result).toBe(expectedOutput);
    });
  
    it("should handle empty strings", () => {
      const input = "";
      const expectedOutput = "";
      const result = toTitleCase(input);
      expect(result).toBe(expectedOutput);
    });
  
    it("should handle strings with leading or trailing whitespace", () => {
      const input = "   hello world   ";
      const expectedOutput = "   Hello World   ";
      const result = toTitleCase(input);
      expect(result).toBe(expectedOutput);
    });
  });
  