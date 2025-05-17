// src/models.ts

/**
 * Represents a message bag containing recipient numbers, message content, and sender ID
 */
export interface MessageBag {
  numbers: string;
  message: string;
  sender: string;
}

/**
 * Container for a message bag as per API specification
 */
export interface MessageBagContainer {
  message_bag: MessageBag;
}

/**
 * The complete message request payload
 */
export interface MessageRequest {
  data: MessageBagContainer[];
}

/**
 * Date and time information from API response
 */
export interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

/**
 * Meta information about the API response
 */
export interface MetaInfo {
  recipients: number;
  credits_deducted: number;
  available_credits: string;
  user_email: string;
  date_time: DateTime;
}

/**
 * Status information from the API response
 */
export interface StatusInfo {
  code: string;
  type: string;
  description: string;
}

/**
 * Complete API response structure
 */
export interface ApiResponse {
  status: StatusInfo;
  meta: MetaInfo;
}

/**
 * Creates a new MessageRequest with an empty data array
 */
export function createMessageRequest(): MessageRequest {
  return { data: [] };
}

/**
 * Adds a message bag to an existing MessageRequest
 *
 * @param request - The message request to add to
 * @param numbers - Comma-separated recipient phone numbers
 * @param message - The message content to send
 * @param sender - The sender ID to use
 * @returns The updated MessageRequest
 */
export function addMessageBag(
  request: MessageRequest,
  numbers: string,
  message: string,
  sender: string
): MessageRequest {
  const messageBag: MessageBag = {
    numbers,
    message,
    sender,
  };

  const container: MessageBagContainer = {
    message_bag: messageBag,
  };

  request.data.push(container);
  return request;
}
