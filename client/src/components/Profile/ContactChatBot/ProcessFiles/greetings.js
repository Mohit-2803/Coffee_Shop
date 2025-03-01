/**
 * Returns a greeting message.
 *
 * @returns {string} Greeting message.
 */
export const getGreetingReply = (userInput) => {
  if (userInput.includes("how are you")) {
    return "I am fine. What assistance do need?";
  }
  return "Hello! How can I assist you today?";
};
