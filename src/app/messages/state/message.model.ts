let uniqueId = 1;

export const enum MessageType {
  Comment = 'Comment',
  Fact = 'Fact',
  Task = 'Task'
}

export interface Message {
  id: number;
  content: string;
  type: MessageType;
  isNew: boolean;
}

export function createMessage(type: MessageType, isNew: boolean = false) {
  const id = uniqueId++;
  return {
    id: id,
    content: `${type} - ${id}`,
    type,
    isNew
  } as Message;
}
