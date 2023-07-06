import { checkIfMessageIsWhatsappAction } from "../checkIfMessageIsWhatsappAction";
import { SupportedTelegramActions } from "../../types/supportedTelegramActions";

// Test suite for the checkIfMessageIsWhatsappAction function
describe("Given is a sample whatsapp message: ", () => {
  // Test case: checkIfMessageIsWhatsappAction should return true for a whatsapp message
  it("should return true if the telegram message was destined to whatsapp ", () => {
    // Prepare a sample whatsapp message
    const demoMessage = `${SupportedTelegramActions.SEND_WHATSAPP_MESSAGE} Hi`;

    // Assert that checkIfMessageIsWhatsappAction returns true for the sample message
    expect(checkIfMessageIsWhatsappAction(demoMessage)).toBeTruthy();
  });

  // Test case: checkIfMessageIsWhatsappAction should return false for unsupported telegram action
  it("should return false if the telegram Action is not supported: ", () => {
    // Prepare a sample telegram action that is not supported
    const telegramDemoAction = "😇";
    const demoMessage = `${telegramDemoAction} Hi`;

    // Assert that checkIfMessageIsWhatsappAction returns false for the sample message
    expect(checkIfMessageIsWhatsappAction(demoMessage)).toBeFalsy();
  });
});
