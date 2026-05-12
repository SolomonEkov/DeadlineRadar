export interface Subject {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  subjectId: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}
