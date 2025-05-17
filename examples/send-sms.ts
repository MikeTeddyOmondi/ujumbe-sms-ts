// examples/send-sms.ts
import { config } from "dotenv";
import { UjumbeSmsClient, createMessageRequest, addMessageBag } from "../src";

config();

async function main() {
  // Create client instance
  const client = new UjumbeSmsClient({
    apiKey: process.env.UJUMBESMS_API_KEY!,
    email: process.env.UJUMBESMS_EMAIL!,
  });

  try {
    // Option 1: Using the convenience method for a single message
    const singleResponse = await client.sendSingleMessage(
      "254717135176,254790378969",
      "Sent from UjumbeSMS TypeScript client!",
      "UjumbeSMS"
    );

    console.log("Single message response:", singleResponse);

    // Option 2: Creating and sending a custom request with multiple message bags
    const request = createMessageRequest();

    // Add first message bag
    addMessageBag(
      request,
      "254712345678",
      "Sent from UjumbeSMS TypeScript client [Message Bags Test]",
      "UjumbeSMS"
    );

    // Add second message bag with different content
    addMessageBag(
      request,
      "254712345678,254798765432",
      "Sent from UjumbeSMS TypeScript client [Message Bags Test]",
      "UjumbeSMS"
    );

    const multiResponse = await client.sendMessages(request);
    console.log("Multiple message response:", multiResponse);

    // Option 3: Using the client helper methods
    const customRequest = client.createRequest();
    client.addMessageToRequest(
      customRequest,
      "2547XXXXXXXX",
      "Sent from UjumbeSMS TypeScript client [Client Helpers Test]",
      "UjumbeSMS"
    );

    const helperResponse = await client.sendMessages(customRequest);
    console.log("Helper methods response:", helperResponse);

    console.log("Credits remaining:", helperResponse.meta.available_credits);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending SMS:", error.message);
    } else {
      console.error("Unknown error occurred");
    }
  }
}

// Execute the example
main().catch(console.error);
