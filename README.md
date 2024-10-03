# AI Crime Novel Generator

## Overview
The AI Crime Novel Generator is a web application that utilizes OpenAI's GPT-4 model to create engaging crime stories based on user input. Users can set the scene by providing a prompt, and the application generates a narrative that can be navigated page by page.

## Features
- **Interactive Story Generation**: Users can input prompts to generate unique crime stories.
- **Page Navigation**: Read the generated story one page at a time, with options to go back and forth.
- **Responsive Design**: The application is designed to work on various screen sizes.

## Technologies Used
- **Next.js**: A React framework for building server-side rendered applications.
- **OpenAI API**: For generating story content using the GPT-4 model.
- **Framer Motion**: For smooth animations and transitions between pages.
- **Tailwind CSS**: For styling the application with utility-first CSS.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crime-novel-gen.git
   cd crime-novel-gen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root of the project and add your OpenAI API key:
   ```plaintext
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage
1. Enter a prompt in the "Set the Scene" textarea to describe the detective, the crime, or the setting.
2. Click on "Begin the Mystery" to generate the story.
3. Use the navigation buttons to move between pages of the generated story.

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to OpenAI for providing the API that powers the story generation.
- Special thanks to the contributors of the libraries used in this project.

## Contact
For any inquiries, please reach out to [your-email@example.com](mailto:your-email@example.com).
