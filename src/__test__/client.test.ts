// src/__tests__/client.test.ts
import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import axios from 'axios';
import { UjumbeSmsClient, createMessageRequest, addMessageBag } from '../index';

// Mock axios with proper TypeScript typing
// vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe("UjumbeSmsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // mockedAxios.create.mockReturnValue(mockedAxios);
  });

  describe("sendSingleMessage", () => {
    it("should send a single message successfully", async () => {
      const mockResponse = {
        data: {
          status: {
            code: "1008",
            type: "success",
            description: "Your messages have been queued",
          },
          meta: {
            recipients: 1,
            credits_deducted: 1,
            available_credits: "6608",
            user_email: "test@example.com",
            date_time: {
              date: "20150815 18:19:47",
              timezone_type: 3,
              timezone: "Africa/Nairobi",
            },
          },
        },
      };

      // mockedAxios.post.mockResolvedValue(mockResponse);

      const client = new UjumbeSmsClient({
        apiKey: "test_api_key",
        email: "test@example.com",
      });

      const response = await client.sendSingleMessage(
        "07123456789",
        "Single test message",
        "UjumbeSMS"
      );

      expect(response).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/messaging",
        {
          data: [{
            message_bag: {
              numbers: "07123456789",
              message: "Single test message",
              sender: "UjumbeSMS"
            }
          }]
        },
        expect.objectContaining({
          headers: {
            "X-Authorization": "test_api_key",
            "Email": "test@example.com",
            "Content-Type": "application/json"
          }
        })
      );
    });

    it("should throw error on API failure", async () => {
      const errorResponse = {
        response: {
          data: {
            status: {
              code: "1001",
              description: "Invalid API credentials"
            }
          }
        }
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      const client = new UjumbeSmsClient({
        apiKey: "invalid_key",
        email: "test@example.com"
      });

      await expect(
        client.sendSingleMessage("07123456789", "Test", "Sender")
      ).rejects.toThrow("Invalid API credentials");
    });
  });

  describe("sendMessages", () => {
    it("should send multiple messages", async () => {
      const mockResponse = {
        data: {
          status: { code: "1008", description: "Queued" },
          meta: { recipients: 3 }
        }
      };
      // mockedAxios.post.mockResolvedValue(mockResponse);

      const client = new UjumbeSmsClient({
        apiKey: "test_key",
        email: "test@example.com"
      });

      const request = createMessageRequest();
      addMessageBag(request, "07123456789", "First", "Sender1");
      addMessageBag(request, "0722222222", "Second", "Sender2");

      await client.sendMessages(request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/messaging",
        {
          data: [
            { message_bag: { numbers: "07123456789", message: "First", sender: "Sender1" } },
            { message_bag: { numbers: "0722222222", message: "Second", sender: "Sender2" } }
          ]
        },
        expect.anything()
      );
    });
  });

  // Uncomment and adapt similar patterns for getBalance tests
});

// // src/__tests__/client.test.ts
// import axios from "axios";
// import { UjumbeSmsClient, createMessageRequest, addMessageBag } from "../index";

// // Mock axios
// jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe("UjumbeSmsClient", () => {
//   // Reset mocks before each test
//   beforeEach(() => {
//     jest.clearAllMocks();

//     // Setup default axios.create mock
//     mockedAxios.create.mockReturnValue(mockedAxios as any);
//   });

//   describe("sendSingleMessage", () => {
//     it("should send a single message successfully", async () => {
//       // Setup mock response
//       const mockResponse = {
//         data: {
//           status: {
//             code: "1008",
//             type: "success",
//             description: "Your messages have been queued",
//           },
//           meta: {
//             recipients: 1,
//             credits_deducted: 1,
//             available_credits: "6608",
//             user_email: "test@email.com",
//             date_time: {
//               date: "20150815 18:19:47",
//               timezone_type: 3,
//               timezone: "Africa/Nairobi",
//             },
//           },
//         },
//       };

//       mockedAxios.post.mockResolvedValueOnce(mockResponse);

//       // Create client and send message
//       const client = new UjumbeSmsClient({
//         apiKey: "test_api_key",
//         email: "test@example.com",
//       });

//       const response = await client.sendSingleMessage(
//         "07123456789",
//         "Single test message",
//         "UjumbeSMS"
//       );

//       // Check response
//       expect(response).toEqual(mockResponse.data);

//       // Check that axios was called with correct parameters
//       expect(mockedAxios.post).toHaveBeenCalledTimes(1);
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         "/api/messaging",
//         {
//           data: [
//             {
//               message_bag: {
//                 numbers: "07123456789",
//                 message: "Test message",
//                 sender: "TESTSENDER",
//               },
//             },
//           ],
//         },
//         expect.objectContaining({
//           headers: expect.objectContaining({
//             "X-Authorization": "test_api_key",
//             Email: "test@email.com",
//           }),
//         })
//       );
//     });

//     it("should throw an error when API returns an error", async () => {
//       // Setup mock error response
//       const errorResponse = {
//         response: {
//           status: 400,
//           data: {
//             status: {
//               code: "1001",
//               type: "error",
//               description: "Invalid API credentials",
//             },
//           },
//           statusText: "Bad Request",
//         },
//       };

//       mockedAxios.post.mockRejectedValueOnce(errorResponse);

//       // Create client
//       const client = new UjumbeSmsClient({
//         apiKey: "invalid_api_key",
//         email: "test@example.com",
//       });

//       // Test error handling
//       await expect(
//         client.sendSingleMessage("07123456789", "Test message", "TESTSENDER")
//       ).rejects.toThrow("Invalid API credentials");
//     });
//   });

//   describe("sendMessages", () => {
//     it("should send multiple messages successfully", async () => {
//       // Setup mock response
//       const mockResponse = {
//         data: {
//           status: {
//             code: "1008",
//             type: "success",
//             description: "Your messages have been queued",
//           },
//           meta: {
//             recipients: 3,
//             credits_deducted: 3,
//             available_credits: "6605",
//             user: "Test User",
//             date_time: {
//               date: "20150815 18:19:47",
//               timezone_type: 3,
//               timezone: "Africa/Nairobi",
//             },
//           },
//         },
//       };

//       mockedAxios.post.mockResolvedValueOnce(mockResponse);

//       // Create client
//       const client = new UjumbeSmsClient({
//         apiKey: "test_api_key",
//         email: "test@example.com",
//       });

//       // Create request with multiple message bags
//       const request = createMessageRequest();

//       addMessageBag(request, "07123456789", "First test message", "TESTSENDER");

//       addMessageBag(
//         request,
//         "07123456790,07123456791",
//         "Second test message",
//         "TESTSENDER2"
//       );

//       const response = await client.sendMessages(request);

//       // Check response
//       expect(response).toEqual(mockResponse.data);

//       // Check that axios was called with correct parameters
//       expect(mockedAxios.post).toHaveBeenCalledTimes(1);
//       expect(mockedAxios.post).toHaveBeenCalledWith(
//         "/api/messaging",
//         {
//           data: [
//             {
//               message_bag: {
//                 numbers: "07123456789",
//                 message: "First test message",
//                 sender: "TESTSENDER",
//               },
//             },
//             {
//               message_bag: {
//                 numbers: "07123456790,07123456791",
//                 message: "Second test message",
//                 sender: "TESTSENDER2",
//               },
//             },
//           ],
//         },
//         expect.objectContaining({
//           headers: expect.objectContaining({
//             "X-Authorization": "test_api_key",
//             Email: "test@example.com",
//           }),
//         })
//       );
//     });

//     it("should throw an error when API returns an error for multiple messages", async () => {
//       // Setup mock error response
//       const errorResponse = {
//         response: {
//           status: 400,
//           data: {
//             status: {
//               code: "1003",
//               type: "error",
//               description: "Invalid message format",
//             },
//           },
//           statusText: "Bad Request",
//         },
//       };

//       mockedAxios.post.mockRejectedValueOnce(errorResponse);

//       // Create client
//       const client = new UjumbeSmsClient({
//         apiKey: "test_api_key",
//         email: "test@example.com",
//       });

//       // Create request
//       const request = createMessageRequest();

//       addMessageBag(request, "07123456789", "Test message", "TESTSENDER");

//       // Test error handling
//       await expect(client.sendMessages(request)).rejects.toThrow(
//         "Invalid message format"
//       );
//     });
//   });

//   // describe("getBalance", () => {
//   //   it("should get account balance successfully", async () => {
//   //     // Setup mock response
//   //     const mockResponse = {
//   //       data: {
//   //         status: {
//   //           code: "1010",
//   //           type: "success",
//   //           description: "Account balance retrieved successfully",
//   //         },
//   //         meta: {
//   //           available_credits: "6600",
//   //           user: "Test User",
//   //           date_time: {
//   //             date: "20150815 18:19:47",
//   //             timezone_type: 3,
//   //             timezone: "Africa/Nairobi",
//   //           },
//   //         },
//   //       },
//   //     };

//   //     mockedAxios.get.mockResolvedValueOnce(mockResponse);

//   //     // Create client
//   //     const client = new UjumbeSmsClient({
//   //       apiKey: "test_api_key",
//   //       email: "test@example.com",
//   //     });

//   //     const response = await client.getBalance();

//   //     // Check response
//   //     expect(response).toEqual(mockResponse.data);

//   //     // Check that axios was called with correct parameters
//   //     expect(mockedAxios.get).toHaveBeenCalledTimes(1);
//   //     expect(mockedAxios.get).toHaveBeenCalledWith(
//   //       "/api/account/balance",
//   //       expect.objectContaining({
//   //         headers: expect.objectContaining({
//   //           "X-Authorization": "test_api_key",
//   //           Email: "test@example.com",
//   //         }),
//   //       })
//   //     );
//   //   });

//   //   it("should throw an error when API returns an error for balance check", async () => {
//   //     // Setup mock error response
//   //     const errorResponse = {
//   //       response: {
//   //         status: 401,
//   //         data: {
//   //           status: {
//   //             code: "1001",
//   //             type: "error",
//   //             description: "Unauthorized access",
//   //           },
//   //         },
//   //         statusText: "Unauthorized",
//   //       },
//   //     };

//   //     mockedAxios.get.mockRejectedValueOnce(errorResponse);

//   //     // Create client
//   //     const client = new UjumbeSmsClient({
//   //       apiKey: "wrong_api_key",
//   //       email: "test@example.com",
//   //     });

//   //     // Test error handling
//   //     await expect(client.getBalance()).rejects.toThrow("Unauthorized access");
//   //   });
//   // });

//   describe("helper functions", () => {
//     it("should create a message request correctly", () => {
//       const request = createMessageRequest();
//       expect(request).toEqual({ data: [] });
//     });

//     it("should add a message bag to the request", () => {
//       const request = createMessageRequest();

//       addMessageBag(request, "07123456789", "Test message", "TESTSENDER");

//       expect(request).toEqual({
//         data: [
//           {
//             message_bag: {
//               numbers: "07123456789",
//               message: "Test message",
//               sender: "TESTSENDER",
//             },
//           },
//         ],
//       });
//     });

//     it("should add multiple message bags to the request", () => {
//       const request = createMessageRequest();

//       addMessageBag(request, "07123456789", "First message", "SENDER1");

//       addMessageBag(
//         request,
//         "07123456790,07123456791",
//         "Second message",
//         "SENDER2"
//       );

//       expect(request).toEqual({
//         data: [
//           {
//             message_bag: {
//               numbers: "07123456789",
//               message: "First message",
//               sender: "SENDER1",
//             },
//           },
//           {
//             message_bag: {
//               numbers: "07123456790,07123456791",
//               message: "Second message",
//               sender: "SENDER2",
//             },
//           },
//         ],
//       });
//     });
//   });

//   describe("constructor", () => {
//     it("should create an instance with the provided configuration", () => {
//       const client = new UjumbeSmsClient({
//         apiKey: "test_api_key",
//         email: "test@example.com",
//         baseUrl: "https://ujumbesms.co.ke/",
//       });

//       expect(mockedAxios.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           baseURL: "https://ujumbesms.co.ke/",
//           headers: expect.objectContaining({
//             "X-Authorization": "test_api_key",
//             Email: "test@example.com",
//             "Content-Type": "application/json",
//           }),
//         })
//       );
//     });

//     it("should create an instance with the default base URL when not provided", () => {
//       const client = new UjumbeSmsClient({
//         apiKey: "test_api_key",
//         email: "test@example.com",
//       });

//       expect(mockedAxios.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           baseURL: "https://ujumbe.co.ke/",
//           headers: expect.objectContaining({
//             "X-Authorization": "test_api_key",
//             Email: "test@example.com",
//             "Content-Type": "application/json",
//           }),
//         })
//       );
//     });
//   });
// });
