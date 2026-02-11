
export enum LessonId {
  MOVE_1_1 = '1.1',
  COSTUME_1_2 = '1.2',
  STAGE_1_3 = '1.3',
  QUIZ_1 = 'quiz1'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonData {
  id: LessonId;
  title: string;
  subtitle: string;
  content: string[];
  tasks: string[];
  videoUrl?: string;
  quiz?: QuizQuestion[];
}

export interface SpriteState {
  x: number;
  y: number;
  rotation: number;
  costume: string;
  visible: boolean;
}

export type BlockType = 'move' | 'turn' | 'goto' | 'glide' | 'next_costume' | 'say';

export interface CodeBlock {
  id: string;
  type: BlockType;
  value?: number | string;
  x?: number;
  y?: number;
}

export interface PuzzleLevel {
  id: number;
  title: string;
  description: string;
  hint: string;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  allowedBlocks: BlockType[];
  backgroundImage?: string;
  puzzleType?: 'coordinate' | 'jigsaw';
}
