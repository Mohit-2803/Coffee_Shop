/* eslint-disable no-unused-vars */
import { getGreetingReply } from "./ProcessFiles/greetings";
import { processOrderRequest } from "./ProcessFiles/orders";

/**
 * Processes the user's input and returns an updated messages array with the bot's reply.
 *
 * @param {string} userInput - The input from the user.
 * @param {Array} currentMessages - The current array of messages.
 * @param {Object} user - The user object containing details (e.g., email).
 * @returns {Promise<Array>} - A promise that resolves to the updated messages array.
 */
export const processUserInput = async (userInput, currentMessages, user) => {
  let reply = "";
  const lowerInput = userInput.toLowerCase();
  // Check if the input is composed entirely of numbers (ignoring spaces)
  const isNumericOnly = /^\d+$/.test(userInput.trim());

  if (
    lowerInput.includes("hello") ||
    lowerInput.includes("hi") ||
    lowerInput.includes("hey") ||
    lowerInput.includes("how are you")
  ) {
    reply = getGreetingReply(userInput);
  }
  // If input includes order keywords or is purely numeric (assuming it's an order ID)
  else if (
    lowerInput.includes("order") ||
    lowerInput.includes("orders") ||
    isNumericOnly
  ) {
    reply = await processOrderRequest(userInput);
  } else {
    reply = "I'm sorry, I didn't understand that. Could you please rephrase?";
  }

  const botMessage = { sender: "bot", text: reply };

  // Return a promise that resolves with the updated messages array after a short delay.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...currentMessages, botMessage]);
    }, 500);
  });
};
