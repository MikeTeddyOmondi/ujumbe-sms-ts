# UjumbeSMS TypeScript Client Library

A modern, modular TypeScript client library for the UjumbeSMS API, allowing you to easily send SMS messages from your JavaScript/TypeScript applications.

## Features

- Full TypeScript support with comprehensive type definitions
- Promise-based API for easy integration with async/await
- Modular design with flexible configuration options
- Helper functions for creating and managing message requests
- Detailed error handling with custom error types
- Comprehensive documentation and examples

## Installation

```bash
npm install ujumbe-sms-client
# or
yarn add ujumbe-sms-client
```

## Quick Start

```typescript
import { UjumbeSmsClient } from "ujumbe-sms-client";

async function sendSms() {
  // Create a client instance
  const client = new UjumbeSmsClient({
    apiKey: "YOUR_API_KEY",
    email: "your@email.com",
  });

  try {
    // Send a simple message
    const response = await client.sendSingleMessage(
      "254712345678",
      "Hello from UjumbeSMS!",
      "UjumbeSMS",
    );

    console.log("Message sent successfully!");
    console.log(`Credits remaining: ${response.meta.available_credits}`);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

sendSms();
```

## Usage Guide

### Configuration

Create a client with your API credentials:

```typescript
import { UjumbeSmsClient } from "ujumbe-sms-client";

const client = new UjumbeSmsClient({
  apiKey: "YOUR_API_KEY",
  email: "your@email.com",
  // Optional configuration options
  baseUrl: "https://ujumbesms.co.ke", // Default
  timeout: 30000, // 30 seconds (default)
});
```

### Sending a Single Message

Use the convenient `sendSingleMessage` method to send a message to one or more recipients:

```typescript
const response = await client.sendSingleMessage(
  "254712345678,254712345678", // Multiple numbers separated by commas
  "Your message content here",
  "SENDER_ID", // Your registered sender ID or default "UjumbeSMS"
);

console.log(`Message sent to ${response.meta.recipients} recipients`);
```

### Sending Multiple Messages

Create and send multiple message bags in a single request:

```typescript
import { createMessageRequest, addMessageBag } from "ujumbe-sms-client";

// Create a new message request
const request = createMessageRequest();

// Add first message bag
addMessageBag(request, "07123456789", "First message content", "SENDER_ID");

// Add second message bag with different content or recipients
addMessageBag(
  request,
  "07123456790,07123456791",
  "Second message content",
  "SENDER_ID",
);

// Send the request
const response = await client.sendMessages(request);
```

### Using Client Helper Methods

The client also provides helper methods for creating and modifying requests:

```typescript
// Create a new request
const request = client.createRequest();

// Add messages to the request
client.addMessageToRequest(
  request,
  "07123456789",
  "Message content",
  "SENDER_ID",
);

client.addMessageToRequest(
  request,
  "254712345679",
  "Another message",
  "SENDER_ID",
);

// Send the request
const response = await client.sendMessages(request);
```

### Error Handling

The library throws `UjumbeSmsError` instances that provide detailed information about what went wrong:

```typescript
import { UjumbeSmsClient, UjumbeSmsError } from "ujumbe-sms-client";

try {
  const response = await client.sendSingleMessage(
    "254712345679",
    "Message content",
    "SENDER_ID",
  );
  console.log("Message sent successfully!");
} catch (error) {
  if (error instanceof UjumbeSmsError) {
    console.error(`Error: ${error.message}`);
    if (error.statusCode) {
      console.error(`Status code: ${error.statusCode}`);
    }
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
  } else {
    console.error("Unknown error occurred:", error);
  }
}
```

## API Reference

### UjumbeSmsClient

```typescript
class UjumbeSmsClient {
  constructor(config: UjumbeSmsConfig);

  /**
   * Sends one or more messages using the UjumbeSMS API
   */
  sendMessages(request: MessageRequest): Promise<ApiResponse>;

  /**
   * Convenience method to send a single message to one or more recipients
   */
  sendSingleMessage(
    numbers: string,
    message: string,
    sender: string,
  ): Promise<ApiResponse>;

  /**
   * Creates a new message request that can be customized and sent
   */
  createRequest(): MessageRequest;

  /**
   * Adds a message bag to an existing request
   */
  addMessageToRequest(
    request: MessageRequest,
    numbers: string,
    message: string,
    sender: string,
  ): MessageRequest;
}
```

### Configuration

```typescript
interface UjumbeSmsConfig {
  /**
   * Your UjumbeSMS API key
   */
  apiKey: string;

  /**
   * Email address associated with your UjumbeSMS account
   */
  email: string;

  /**
   * Base URL for the UjumbeSMS API (defaults to http://ujumbesms.co.ke)
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds (defaults to 30000)
   */
  timeout?: number;
}
```

### Message Models

```typescript
interface MessageBag {
  numbers: string;
  message: string;
  sender: string;
}

interface MessageBagContainer {
  message_bag: MessageBag;
}

interface MessageRequest {
  data: MessageBagContainer[];
}

// Helper functions
function createMessageRequest(): MessageRequest;

function addMessageBag(
  request: MessageRequest,
  numbers: string,
  message: string,
  sender: string,
): MessageRequest;
```

### Response Models

```typescript
interface ApiResponse {
  status: StatusInfo;
  meta: MetaInfo;
}

interface StatusInfo {
  code: string;
  type: string;
  description: string;
}

interface MetaInfo {
  recipients: number;
  credits_deducted: number;
  available_credits: string;
  user_email: string;
  date_time: DateTime;
}

interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}
```

### Error Handling

```typescript
class UjumbeSmsError extends Error {
  code?: string;
  statusCode?: number;
  originalError?: unknown;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      originalError?: unknown;
    },
  );
}
```

## Examples

### Basic Message Sending

```typescript
import { UjumbeSmsClient } from "ujumbe-sms-client";

const client = new UjumbeSmsClient({
  apiKey: "YOUR_API_KEY",
  email: "your@email.com",
});

async function sendBasicMessage() {
  try {
    const response = await client.sendSingleMessage(
      "254712345679",
      "Hello from UjumbeSMS TypeScript client!",
      "COMPANY", // default to UjumbeSMS if you dont have a Sender ID
    );

    console.log("Message sent successfully!");
    console.log(`Status: ${response.status.description}`);
    console.log(`Recipients: ${response.meta.recipients}`);
    console.log(`Credits used: ${response.meta.credits_deducted}`);
    console.log(`Credits remaining: ${response.meta.available_credits}`);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

sendBasicMessage();
```

### Multiple Messages in One Request

```typescript
import {
  UjumbeSmsClient,
  createMessageRequest,
  addMessageBag,
} from "ujumbe-sms-client";

const client = new UjumbeSmsClient({
  apiKey: "YOUR_API_KEY",
  email: "your@email.com",
});

async function sendMultipleMessages() {
  try {
    const request = createMessageRequest();

    // First message
    addMessageBag(
      request,
      "254712345679",
      "First message content",
      "UjumbeSMS",
    );

    // Second message to multiple recipients
    addMessageBag(
      request,
      "254712345679,254712345679",
      "Second message content for multiple recipients",
      "UjumbeSMS",
    );

    const response = await client.sendMessages(request);
    console.log(`Sent ${response.meta.recipients} messages successfully`);
  } catch (error) {
    console.error("Failed to send messages:", error);
  }
}

sendMultipleMessages();
```

## License

This library is licensed under the [MIT](./LICENSE.md) License.

---
