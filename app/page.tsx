"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, ArrowRight, ArrowLeft, Loader2, Home } from 'lucide-react'
import OpenAI from "openai"; // Add this import

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export default function AICrimeNovel() {
  const [storyStarted, setStoryStarted] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState('')
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next')
  const [storyContent, setStoryContent] = useState<string>(''); // State to hold the generated story content
  const [totalPages, setTotalPages] = useState(0); // Total pages based on the story length

  const startStory = async () => {
    setIsLoading(true);
    const fullStory = await generateStoryContent(initialPrompt) || ''; // Generate the full story
    setStoryContent(fullStory); // Set the full story content
    setTotalPages(Math.ceil(fullStory.split('\n').length / 4)); // Assuming 4 lines per page
    setStoryStarted(true);
    setCurrentPage(0);
    setIsLoading(false);
  }

  const generateStoryContent = async (prompt: string) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative writer tasked with generating a short crime story based on the user's input. Use the provided context to craft an engaging narrative." },
        { role: "user", content: prompt },
      ],
    });
    return completion.choices[0].message.content; // Return the generated content
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setPageDirection('next');
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setPageDirection('prev');
    }
  }

  const backToStart = () => {
    setStoryStarted(false);
    setCurrentPage(0);
    setInitialPrompt('');
    setStoryContent('');
    setTotalPages(0);
  }

  const pageVariants = {
    initial: (direction: string) => ({
      opacity: 0,
      x: direction === 'next' ? 300 : -300
    }),
    in: {
      opacity: 1,
      x: 0
    },
    out: (direction: string) => ({
      opacity: 0,
      x: direction === 'next' ? -300 : 300
    })
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  const linesPerPage = 5; // Number of lines to display per page
  const storyLines = storyContent.split('\n');
  const title = storyLines[0].startsWith('**') && storyLines[0].endsWith('**') ? 
    storyLines[0].slice(2, -2).trim().replace(/^Title:\s*/, '') : ''; // Remove ** from both ends and "Title:" from the start
  const currentPageContent = storyLines.slice(currentPage * linesPerPage + (title ? 1 : 0), (currentPage + 1) * linesPerPage + (title ? 1 : 0)).join('\n');

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {!storyStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
              AI Crime Novel Generator <BookOpen className="inline-block ml-2" />
            </h1>
            <form onSubmit={(e) => { e.preventDefault(); startStory(); }} className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-lg font-semibold text-gray-700">
                  Set the Scene
                </Label>
                <Textarea
                  id="prompt"
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                  placeholder="Describe the detective, the crime, or the setting to start your story..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                disabled={!initialPrompt || isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="mr-2" />
                )}
                Begin the Mystery
              </Button>
            </form>
          </motion.div>
        ) : (
          <div className="relative" style={{ height: '600px' }}>
            <AnimatePresence initial={false} mode="wait" custom={pageDirection}>
              <motion.div
                key={currentPage}
                custom={pageDirection}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="absolute inset-0 p-6 flex flex-col"
                style={{
                  backgroundColor: currentPageContent ? "transparent" : "lightgrey", // Use light grey if no content
                }}
              >
                <div className="flex-grow overflow-auto prose prose-lg max-w-none">
                  {title && (
                    <h2 className="text-4xl font-bold text-center mb-4">
                      {title}
                    </h2>
                  )}
                  <p className="text-gray-800 leading-relaxed">
                    {currentPageContent || "No story content available."} {/* Display a message if no content */}
                    {currentPage === totalPages - 1 && (
                      <span className="font-bold"> This is the final page of the story.</span>
                    )}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Page {currentPage + 1} of {totalPages}</div>
                  <div className="space-x-2">
                    {currentPage > 0 && (
                      <Button
                        onClick={goToPreviousPage}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <ArrowLeft className="mr-2" />
                        Previous Page
                      </Button>
                    )}
                    {currentPage < totalPages - 1 ? (
                      <Button
                        onClick={goToNextPage}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2" />
                        )}
                        Next Page
                      </Button>
                    ) : (
                      <Button
                        onClick={backToStart}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <Home className="mr-2" />
                        Back to Start
                      </Button>
                    )}
                  </div>
                </div>
                {currentPage > 0 && <div className="page-break"></div>}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}