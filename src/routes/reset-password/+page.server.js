import { fail } from '@sveltejs/kit';

import pool from '$lib/server/db.js';

import { hashPassword, invalidateAllSessions } from '$lib/server/auth.js';

import { hashToken } from '$lib/server/token.js';
 
// Sucht einen gültigen Token: existiert, noch nicht benutzt, nicht abgelaufen.

async function findValidToken(token) {

    if (!token) return null;

    const [rows] = await pool.execute(

        `SELECT id, user_id FROM password_reset_tokens

         WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()`,

        [hashToken(token)]

    );

    return rows[0] ?? null;

}
 
// Verify Token -> Show Reset Page (oder "Link abgelaufen")

export async function load({ url }) {

    const token = url.searchParams.get('token');

    const valid = (await findValidToken(token)) !== null;

    return { token, valid };

}
 
export const actions = {

    // Enter PW 2x -> Token ungültig machen und neues Passwort speichern

    reset: async ({ request, cookies }) => {

        const form = await request.formData();

        const token = String(form.get('token') ?? '');

        const password = String(form.get('password') ?? '');

        const password2 = String(form.get('password2') ?? '');
 
        // Prüft die Passwörter

        if (password.length < 8) {

            return fail(400, { error: 'Password must be at least 8 characters' });

        }

        if (password !== password2) {

            return fail(400, { error: 'Passwords do not match' });

        }
 
        // Token nochmal prüfen (könnte inzwischen abgelaufen sein)

        const row = await findValidToken(token);

        if (!row) {

            return fail(400, { error: 'This link is invalid or has expired' });

        }
 
        // Invalidate Token: Link kann nur einmal benutzt werden

        const [result] = await pool.execute(

            'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ? AND used_at IS NULL',

            [row.id]

        );

        if (result.affectedRows === 0) {

            return fail(400, { error: 'This link was already used' });

        }
 
        // Neues Passwort speichern

        const hash = await hashPassword(password);

        await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, row.user_id]);
 
        // Alle Sessions löschen -> User ist überall ausgeloggt

        await invalidateAllSessions(row.user_id);

        cookies.delete('session', { path: '/' });
 
        return { success: true };

    }

};
 