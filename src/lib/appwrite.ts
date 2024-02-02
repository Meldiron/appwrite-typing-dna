import { Client, Functions, Account } from 'appwrite';

const client = new Client()
	.setEndpoint('https://qa.appwrite.org/v1')
	.setProject('65ba4eeeaac022ea46fb');

const functions = new Functions(client);
const account = new Account(client);

export const getAccount = async () => {
	return await account.get();
};

export const deleteSession = async() => {
	return await account.deleteSession('current');
}

export const signInWithTypingDna = async (email: string, typingPattern: any) => {
	const execution = await functions.createExecution(
		'signIn',
		JSON.stringify({
			email,
			typingPattern
		})
	);

    if(!execution.responseBody) {
        throw new Error("Typing pattern did not match.");
    }

	let json;
	try {
		json = JSON.parse(execution.responseBody);
	} catch (err) {
        throw new Error("Typing pattern did not match.");
	}

    if(!json.ok) {
        throw new Error(json.msg);
    }

	await account.createSession(json.userId, json.secret);
};
