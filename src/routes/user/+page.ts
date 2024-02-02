import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getAccount } from '$lib/appwrite';

export let ssr = false;

export const load: PageLoad = async ({ params }) => {
	try {
		const account = await getAccount();

		return {
			account
		};
	} catch(err) {
		throw redirect(307, '/');
	}
};
