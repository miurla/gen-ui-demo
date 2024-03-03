import { createAI, getMutableAIState, render } from "ai/rsc";
import OpenAI from "openai";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { BotMessage } from "@/components/message";
import WeatherCard from "@/components/weather-card";

const openai = new OpenAI();

async function submitMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update AI state with new message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: content,
    },
  ]);

  const ui = render({
    provider: openai,
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content },
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call)
    text: ({ content, done }) => {
      // text can be streamed from the LLM, but we only want to close the stream with .done() when its completed.
      // done() marks the state as available for the client to access
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }
      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      get_city_weather: {
        description: "Get the current weather for a city",
        parameters: z
          .object({
            city: z
              .string()
              .describe("The city and state, e.g. San Francisco, CA"),
          })
          .required(),
        render: async function* (args) {
          yield <Spinner />;

          // Workaround for a bug in the current version (v3.0.1)
          // issue: https://github.com/vercel/ai/issues/1026
          const { city } = JSON.parse(args as unknown as string);
          console.log(city); // This is the correct

          const weather = await getWeather(city);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation
              content: JSON.stringify(weather),
            },
          ]);

          return (
            <BotMessage>
              <WeatherCard info={weather} />
            </BotMessage>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Dummy function for getWeather
async function getWeather(city: string): Promise<any> {
  // This is a mock function. Replace it with your actual weather fetching logic.
  console.log(`Fetching weather for ${city}...`);
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return a mock weather data
  return {
    city,
    temperature: 7,
    high: 12,
    low: 1,
    weatherType: "Sunny",
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
