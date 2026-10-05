import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';
import { verifyPassword, createSession } from '$lib/server/auth.js';

// Leitet eingeloggte Benutzer zum Dashboard weiter
export function load({ locals }) {
	if (locals.user) redirect(303, '/dashboard');
}

export const actions = {
	// Prüft die Login-Daten und erstellt eine Session
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = String(data.get('username') ?? '').trim();
		const password = String(data.get('password') ?? '');

		// Verwendet dieselbe Fehlermeldung für ungültige Login-Daten
		if (!username || !password) {
			return fail(400, { error: 'Wrong username or password', username });
		}
		const [users] = await pool.execute('SELECT id, password_hash FROM users WHERE name = ?', [
    username
]);
		const user = users[0];
		if (!user || !(await verifyPassword(password, user.password_hash))) {
			return fail(400, { error: 'Wrong username or password', username });
		}

		// Setzt das Session-Cookie und öffnet das Dashboard
		const sessionId = await createSession(user.id);
		cookies.set('session', sessionId, {
			path: '/',
			maxAge: 30 * 24 * 60 * 60,
			httpOnly: true,
			sameSite: 'lax'
		});
		redirect(303, '/dashboard');
	}
};
