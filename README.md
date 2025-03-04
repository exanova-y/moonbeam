# Hey Moonbeam Greeting App

This Next.js application displays celestial greetings and inspirational quotes based on the time of day, using the Deepseek AI API to generate content.

[Demo video](https://youtu.be/4i1nBDi0lqw)

Screenshot:
![](/public/luffy.png)
## Time Periods

The application defines four time periods:

- **Morning**: 5:01 AM - 12:00 PM
- **Afternoon**: 12:01 PM - 5:00 PM
- **Evening**: 5:01 PM - 10:00 PM
- **Night**: 10:01 PM - 5:00 AM

## Features

- Automatically detects the current time period
- Time-specific loading animation with flashing symbols
  - ☀︎ for morning
  - ☁︎ for afternoon
  - ☾ for evening
  - ⋆⁺₊ for night
- Randomly selects videos from folders based on the current time period
- Displays personalized greetings and quotes using Deepseek AI
- Falls back to predefined messages if the API is unavailable
- Responsive design with time-appropriate video backgrounds

## Setup

1. Install dependencies:
   ```
   flox activate && npm install
   ```

2. Set up your Deepseek API key:
   - Edit the `.env.local` file
   - Replace `your_deepseek_api_key_here` with your actual Deepseek API key

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Customization

You can customize the application by:

- Adding more videos to the appropriate folders in the `public` directory:
  - `public/day/` for morning videos (5:01 AM - 12:00 PM)
  - `public/afternoon/` for afternoon videos (12:01 PM - 5:00 PM)
  - `public/evening/` for evening videos (5:01 PM - 10:00 PM)
  - `public/night/` for night videos (10:01 PM - 5:00 AM)
- Modifying the fallback messages in `app/page.tsx`
- Adjusting the time period definitions in the `getTimePeriod` function
- Customizing the loading animation speed in the useEffect hook
- Changing the fade-in animation duration in `globals.css`
