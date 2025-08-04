// src/models.ts

/**
 * MessageBag represents the request structure for sending messages
 */
export interface MessageBag {
  numbers: string;
  message: string;
  sender: string;
}

/**
 * MessageBagContainer represents a container for the message bag
 * This is used to wrap the message bag in a list for the API request.
 */
export interface MessageBagContainer {
  message_bag: MessageBag;
}

/**
 * MessageRequest represents the request structure for sending messages
 * This structure contains a list of message bags to be sent.
 */
export interface MessageRequest {
  data: MessageBagContainer[];
}

/**
 * DateTime structure to represent the date and time information
 * returned by the API. This structure includes the date, timezone type,
 * and timezone string.
 */
export interface DateTime {
  date: string;
  timezone_type: number;
  timezone: string;
}

/**
 * MessagingMetaInfo structure to represent the metadata information
 * returned by the messaging API.
 */
export interface MessagingMetaInfo {
  recipients: number;
  credits_deducted: number;
  available_credits: string;
  user_email: string;
  date_time: DateTime;
}

/**
 * BalanceMetaInfo structure to represent the metadata information
 * returned by the balance API.
 */
export interface BalanceMetaInfo {
  user: string;
  credits: number;
  rate: number;
  date_time: DateTime;
}

/**
 * MessageHistoryMetaInfo structure to represent the metadata information
 * returned by the message history API.
 */
export interface MessageHistoryMetaInfo {
  user: string;
  date_time: DateTime;
}

/**
 * StatusInfo structure to represent the status information
 * returned by the API.
 */
export interface StatusInfo {
  code: string;
  type: string;
  description: string;
}

/**
 * MessageSent represents a single message in the history
 */
export interface MessageSent {
  id: number;
  request_id: number;
  number: string;
  message: string;
  user_id: number;
  sender_id: string;
  transaction_id: string;
  message_count: number;
  status: string;
  flag: string;
  created_at: string;
  updated_at: string;
  scheduled_date: string;
}

/**
 * Items structure for paginated message history results
 */
export interface Items {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  from: number;
  to: number;
  data: MessageSent[];
}

/**
 * MessagingApiResponse structure to represent the response from the Messaging API
 */
export interface MessagingApiResponse {
  status: StatusInfo;
  meta?: MessagingMetaInfo;
}

/**
 * BalanceApiResponse structure to represent the response from the Balance API
 */
export interface BalanceApiResponse {
  status: StatusInfo;
  meta?: BalanceMetaInfo;
}

/**
 * MessageHistoryApiResponse structure to represent the response from the Messages History API
 */
export interface MessageHistoryApiResponse {
  status: StatusInfo;
  meta?: MessageHistoryMetaInfo;
  items: Items;
}

/**
 * Creates a new empty message request
 */
export function createMessageRequest(): MessageRequest {
  return {
    data: [],
  };
}

/**
 * Adds a message bag to an existing request
 */
export function addMessageBag(
  request: MessageRequest,
  numbers: string,
  message: string,
  sender: string,
): MessageRequest {
  const bag: MessageBag = {
    numbers,
    message,
    sender,
  };

  const container: MessageBagContainer = {
    message_bag: bag,
  };

  request.data.push(container);
  return request;
}

/**
 * Utility class for MessageHistoryApiResponse with helper methods
 */
export class MessageHistoryUtils {
  /**
   * Get all successfully delivered messages
   */
  static getDeliveredMessages(
    response: MessageHistoryApiResponse,
  ): MessageSent[] {
    return response.items.data.filter(
      (msg) => msg.status === "DeliveredToTerminal",
    );
  }

  /**
   * Get all failed messages
   */
  static getFailedMessages(response: MessageHistoryApiResponse): MessageSent[] {
    return response.items.data.filter(
      (msg) =>
        msg.status.includes("Blacklisted") || msg.status.includes("Invalid"),
    );
  }

  /**
   * Get messages by phone number
   */
  static getMessagesByNumber(
    response: MessageHistoryApiResponse,
    number: string,
  ): MessageSent[] {
    return response.items.data.filter((msg) => msg.number.includes(number));
  }

  /**
   * Get messages by status
   */
  static getMessagesByStatus(
    response: MessageHistoryApiResponse,
    status: string,
  ): MessageSent[] {
    return response.items.data.filter((msg) => msg.status === status);
  }

  /**
   * Get total message count
   */
  static getTotalMessages(response: MessageHistoryApiResponse): number {
    return response.items.total;
  }

  /**
   * Check if there are more pages
   */
  static hasNextPage(response: MessageHistoryApiResponse): boolean {
    return response.items.next_page_url !== null;
  }

  /**
   * Check if there are previous pages
   */
  static hasPreviousPage(response: MessageHistoryApiResponse): boolean {
    return response.items.prev_page_url !== null;
  }
}

// For backward compatibility, keep ApiResponse typed as an alias
export type ApiResponse = MessagingApiResponse;
