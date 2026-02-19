
import { LessonId, LessonData, PuzzleLevel } from './types';

export const LESSONS: LessonData[] = [
  {
    id: LessonId.MOVE_1_1,
    title: "Let's Move! 💃",
    subtitle: "Learn to navigate the stage!",
    content: [
      "Welcome to the world of coding! 🚀",
      "**Move 🏃‍♂️**: Use steps to go forward!",
      "**Spin 🌀**: Rotate the sprite around!",
      "**Jump ✨**: Instantly teleport to any spot!",
      "**Slide ⛸️**: Glide smoothly across the screen!"
    ],
    tasks: [
      "Can you make the sprite walk? 🏃‍♂️",
      "Make the sprite spin in a circle! 🌀",
      "Jump to the middle (0,0)! ✨"
    ]
  },
  {
    id: LessonId.COSTUME_1_2,
    title: "Dress Up! 👗",
    subtitle: "Change the appearance!",
    content: [
      "Sprites can look like anything! 🎭",
      "**Costumes 👕**: Switch between different outfits!",
      "**Backdrops 🌈**: Change the entire world around you!",
      "**Messages 📢**: Make your sprite speak to everyone!"
    ],
    tasks: [
      "Find a new costume! 🦄",
      "Switch to a different world! 🌈",
      "Make the sprite say 'Hello!' 👋"
    ]
  },
  {
    id: LessonId.STAGE_1_3,
    title: "The Coordinate Map! 🗺️",
    subtitle: "Master the grid system!",
    content: [
      "The screen is a big grid! 📍",
      "**X-Axis ⬅️➡️**: Controls left and right position.",
      "**Y-Axis ⬆️⬇️**: Controls up and down position.",
      "**Origin (0,0) 🎯**: The perfect center point!",
      "**Edges 🏁**: Discover the limits of the world."
    ],
    tasks: [
      "Find the top-right corner! ↗️",
      "Slide to the bottom edge! ⬇️",
      "Return to the exact center! 🎯"
    ]
  }
];

export const PUZZLES: PuzzleLevel[] = [
  {
    id: 1,
    title: "Ocean Guardian! 🐠",
    description: "Help the tropical fish find the glowing coral reef in the deep blue sea!",
    hint: "The reef is near the bottom right edge! Try X: 40 and Y: -30.",
    targetX: 40,
    targetY: -30,
    startX: -35,
    startY: 25,
    allowedBlocks: ['goto'],
    backgroundImage: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1200',
    puzzleType: 'coordinate'
  },
  {
    id: 2,
    title: "Galaxy Quest! 🌌",
    description: "Navigate through the nebula to reach the star cluster!",
    hint: "The star cluster is glowing high on the right! Try X: 35 and Y: 25.",
    targetX: 35,
    targetY: 25,
    startX: -40,
    startY: -15,
    allowedBlocks: ['goto'],
    backgroundImage: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1200',
    puzzleType: 'coordinate'
  },
  {
    id: 3,
    title: "Forest Explorer! 🦝",
    description: "Find the hidden hollow tree in this misty redwood forest.",
    hint: "The tree is tucked away on the left side! Try X: -42 and Y: 10.",
    targetX: -42,
    targetY: 10,
    startX: 20,
    startY: -20,
    allowedBlocks: ['goto'],
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200',
    puzzleType: 'coordinate'
  },
  {
    id: 4,
    title: "Alpine Flight! 🦅",
    description: "Guide the Eagle to its nest on the sharp mountain peak.",
    hint: "It's the highest point on the right! Try X: 45 and Y: 40.",
    targetX: 45,
    targetY: 40,
    startX: -30,
    startY: -35,
    allowedBlocks: ['goto'],
    backgroundImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    puzzleType: 'coordinate'
  },
  {
    id: 5,
    title: "Dune Walker! 🐫",
    description: "Find the oasis hidden behind the giant golden sand dunes.",
    hint: "Look for the green spot near the bottom left! Try X: -20 and Y: -40.",
    targetX: -20,
    targetY: -40,
    startX: 35,
    startY: 15,
    allowedBlocks: ['goto'],
    backgroundImage: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=1200',
    puzzleType: 'coordinate'
  },
  {
    id: 6,
    title: "Arctic Silence! 🐧",
    description: "Slide across the blue ice to reach the iceberg base.",
    hint: "The iceberg is at the bottom right corner! Try X: 48 and Y: -15.",
    targetX: 48,
    targetY: -15,
    startX: -45,
    startY: 30,
    allowedBlocks: ['goto'],
    backgroundImage: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=1200',
    puzzleType: 'coordinate'
  }
];

export const QUIZ_ONE = [
  {
    id: 1,
    question: "Where is the center point (0, 0) of the stage? 🎯",
    options: ["The top corner", "The very middle", "The bottom edge", "Off screen"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "If I change the X number, which way do I move? ⬅️➡️",
    options: ["Up and Down", "Side to Side", "In a circle", "I don't move"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Which coordinate helps me fly high or hop low? ⬆️⬇️",
    options: ["The X number", "The Y number", "The Z number", "The Costume"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "What is the biggest and smallest number we use for X and Y? 🔢",
    options: ["-10 to 10", "-50 to 50", "-240 to 240", "0 to 100""],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "If Y is 50, where am I on the screen? 🌤️",
    options: ["The very bottom", "The very top", "The left side", "The middle"],
    correctAnswer: 1
  }
];

export const COSTUMES = [
  'https://img.icons8.com/stickers/200/rocket.png',
  'https://img.icons8.com/stickers/200/dog.png',
  'https://img.icons8.com/stickers/200/raccoon.png',
  'https://img.icons8.com/stickers/200/penguin.png',
  'https://img.icons8.com/stickers/200/eagle.png',
  'https://img.icons8.com/stickers/200/camel.png',
  'https://img.icons8.com/stickers/200/unicorn.png',
  'https://img.icons8.com/stickers/200/kawaii-dinosaur.png'
];

export const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=1200', // Ocean
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1200', // Galaxy
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200', // Forest
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', // Mountain
  'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=1200', // Desert
  'https://images.unsplash.com/photo-1517783999520-f068d7431a60?q=80&w=1200', // Arctic
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200'  // Summer Hills
];
