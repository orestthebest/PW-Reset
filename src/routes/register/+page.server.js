import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';
import { hashPassword, createSession } from '$lib/server/auth.js';

// Leitet eingeloggte Benutzer zum Dashboard weiter
export function load({ locals }) {
	if (locals.user) redirect(303, '/dashboard');
}

export const actions = {
	// Prüft die Registrierung und erstellt einen Benutzer mit Session
	register: async ({ request, cookies }) => {
		// Formulardaten auslesen
		const data = await request.formData();
		const username = String(data.get('username') ?? '').trim();
		// E-Mail klein schreiben, damit sie beim Passwort-Reset gefunden wird
		const email = String(data.get('email') ?? '').trim().toLowerCase();
		const password = String(data.get('password') ?? '');
		const password2 = String(data.get('password2') ?? '');

		// Prüft Pflichtfelder und Passwörter
		if (!username || !email || !password || !password2) {
			return fail(400, { error: 'Please fill in all fields', username, email });
		}
		// Passwort muss mindestens 8 Zeichen haben
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', username, email });
		}
		// Beide Passwörter müssen gleich sein
		if (password !== password2) {
			return fail(400, { error: 'Passwords do not match', username, email });
		}

		// Speichert den Benutzer und behandelt doppelte Einträge
		let userId;
		try {
			// Passwort wird nur als Hash gespeichert, niemals im Klartext
			const hash = await hashPassword(password);
			const [result] = await pool.execute(
				'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
				[username, email, hash]
			);
			// ID des neuen Users merken (für die Session)
			userId = result.insertId;
		} catch (error) {
			console.error('REGISTER ERROR:', error);
			// name und email sind UNIQUE -> doppelte Werte lösen ER_DUP_ENTRY aus
			if (error.code === 'ER_DUP_ENTRY') {
				return fail(400, { error: 'Username or e-mail is already taken', username, email });
			}
			return fail(400, { error: 'Registration failed. Please try again', username, email });
		}

		// Erstellt die Session und setzt das Cookie (30 Tage gültig)
		try {
			const sessionId = await createSession(userId);
			cookies.set('session', sessionId, {
				path: '/',
				maxAge: 30 * 24 * 60 * 60,
				httpOnly: true, // JavaScript im Browser kann das Cookie nicht lesen
				sameSite: 'lax' // Schutz gegen Anfragen von fremden Seiten
			});
		} catch (error) {
			console.error('SESSION ERROR:', error);
			return fail(400, { error: 'Account created. Please log in', username, email });
		}

		// Nach erfolgreicher Registrierung direkt zum Dashboard
		redirect(303, '/dashboard');
	}
};
