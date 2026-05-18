export interface Subject {
  id: string;
  name: string;
  userId: string;
  color?: string;
  createdAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  userId: string;
  deadline?: string;
  completed?: boolean;
  createdAt?: Date;
}
