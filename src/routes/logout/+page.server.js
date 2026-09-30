import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth.js';

export const actions = {
	// Löscht die Session und leitet zur Startseite weiter
	logout: async ({ cookies }) => {
		const sessionId = cookies.get('session');
		if (sessionId) await invalidateSession(sessionId);
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	}
};
