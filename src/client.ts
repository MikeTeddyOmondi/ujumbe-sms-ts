// src/client.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import {
  ApiResponse,
  MessageRequest,
  createMessageRequest,
  addMessageBag,
} from "./models";
import { UjumbeSmsConfig, createConfig } from "./config";
import {
  createNetworkError,
  createApiError,
  createValidationError,
} from "./errors";

/**
 * Client for interacting with the UjumbeSMS API
 */
export class UjumbeSmsClient {
  private readonly config: Required<UjumbeSmsConfig>;
  private readonly httpClient: AxiosInstance;
  private readonly API_MESSAGING_ENDPOINT = "/api/messaging";

  /**
   * Creates a new UjumbeSMS client
   *
   * @param config - Configuration options
   */
  constructor(config: UjumbeSmsConfig) {
    this.config = createConfig(config);

    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  }

  /**
   * Sends one or more messages using the UjumbeSMS API
   *
   * @param request - Message request containing one or more message bags
   * @returns API response
   * @throws {UjumbeSmsError} if the request fails
   */
  public async sendMessages(request: MessageRequest): Promise<ApiResponse> {
    try {
      // Check if there are any message bags
      if (!request.data || request.data.length === 0) {
        throw createValidationError(
          "Message request must contain at least one message bag"
        );
      }

      const response = await this.httpClient.post<ApiResponse>(
        this.API_MESSAGING_ENDPOINT,
        request,
        {
          headers: {
            "X-Authorization": this.config.apiKey,
            email: this.config.email,
          },
        }
      );

      console.log({ data: JSON.stringify(response.data) });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // Handle API errors
        if (axiosError.response) {
          const statusCode = axiosError.response.status;
          let errorMessage = "API request failed";
          let errorCode: string | undefined;

          // Try to extract error details from response
          if (axiosError.response.data) {
            try {
              const errorData = axiosError.response.data as any;
              if (errorData.status?.description) {
                errorMessage = errorData.status.description;
              }
              if (errorData.status?.code) {
                errorCode = errorData.status.code;
              }
            } catch {
              // If we can't parse the error response, use the status text
              errorMessage = axiosError.response.statusText || errorMessage;
            }
          }

          throw createApiError(statusCode, errorCode, errorMessage);
        }

        // Handle network errors
        throw createNetworkError(axiosError);
      }

      // Handle other errors
      throw createNetworkError(error);
    }
  }

  /**
   * Convenience method to send a single message to one or more recipients
   *
   * @param numbers - Comma-separated recipient phone numbers
   * @param message - Message content
   * @param sender - Sender ID
   * @returns API response
   */
  public async sendSingleMessage(
    numbers: string,
    message: string,
    sender: string
  ): Promise<ApiResponse> {
    const request = createMessageRequest();
    addMessageBag(request, numbers, message, sender);
    return this.sendMessages(request);
  }

  /**
   * Creates a new message request that can be customized and sent
   *
   * @returns Empty message request
   */
  public createRequest(): MessageRequest {
    return createMessageRequest();
  }

  /**
   * Adds a message bag to an existing request
   *
   * @param request - The message request to modify
   * @param numbers - Comma-separated recipient phone numbers
   * @param message - Message content
   * @param sender - Sender ID
   * @returns The updated request
   */
  public addMessageToRequest(
    request: MessageRequest,
    numbers: string,
    message: string,
    sender: string
  ): MessageRequest {
    return addMessageBag(request, numbers, message, sender);
  }
}
