# AI Image Generator Dashboard

An advanced AI-powered image generation application built with Next.js 15, Genkit, and Google AI. This dashboard allows users to create stunning images from text prompts with various style presets and customization options.

## Features

- **AI-Powered Image Generation**: Create high-quality images from text prompts using Google's Gemini 2.0 Flash model
- **Multiple Style Presets**: Choose from Cinematic, Minimalist, and Anime artistic styles
- **Customizable Resolution**: Generate images with resolutions from 512px to 8192px
- **Aspect Ratio Selection**: Support for multiple aspect ratios (16:9, 1:1, 9:16, 4:3)
- **Prompt Assistant**: Get AI-suggested prompts to enhance your creativity
- **History Tracking**: Keep track of all your generated images
- **Community Gallery**: Browse images created by other users
- **Responsive Design**: Works beautifully on all device sizes
- **Modern UI**: Glassmorphism design with smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js 15 with React Server Components
- **AI Integration**: Genkit with Google AI (Gemini 2.0 Flash)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Hooks
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google AI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/girishlade111/AI-generated-image.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Google AI API key:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## Usage

1. Enter a detailed prompt describing the image you want to generate
2. Select a style preset (Cinematic, Minimalist, or Anime)
3. Adjust the resolution and aspect ratio as needed
4. Click "Generate" to create your image
5. Use the Prompt Assistant if you need help crafting the perfect prompt

## Project Structure

```
src/
├── ai/                 # AI flows and configurations
│   ├── flows/          # Genkit flows for image generation and prompt suggestions
│   ├── dev.ts          # Development configuration
│   └── genkit.ts       # Genkit initialization
├── app/                # Next.js app directory
│   ├── actions.ts      # Server actions for AI interactions
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   └── dashboard.tsx   # Main dashboard component
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint
- `npm run typecheck` - Runs TypeScript type checking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Genkit](https://github.com/firebase/genkit)
- [Google AI](https://ai.google/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
---

## 👤 Credits

**Built by Girish Lade** — [ladestack.in](https://ladestack.in)
