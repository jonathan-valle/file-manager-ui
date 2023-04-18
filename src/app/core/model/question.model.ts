import { Answer } from "./answer.model";

export interface Question {
  id: string;
  questionText: string;
  topic: string[];
  answers: Answer[];
  createdBy: string;
  createdAt: Date;
}
