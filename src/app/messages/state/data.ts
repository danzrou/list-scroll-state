import { createMessage, MessageType } from './message.model';

const types = [MessageType.Comment, MessageType.Fact, MessageType.Task];
const getRandomType = () => types[Math.floor(Math.random() * types.length)];

export function createMessages(amount: number = 20) {
	const msgs = [];

	for (let i = 0; i < amount; i++) {
		msgs.push(createMessage(getRandomType()));
	}

	return msgs;
}

export function createNewMessage() {
	const type = getRandomType();
	return createMessage(type, true);
}
