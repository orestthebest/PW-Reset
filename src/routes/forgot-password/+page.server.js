import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import pool from '$lib/server/db.js';
import { transporter } from '$lib/server/mail.js';
import { createToken, hashToken } from '$lib/server/token.js';

export const actions = {
    // Prüft die E-Mail, speichert einen Token und schickt den Reset-Link.
    send: async ({ request, url }) => {
        // Formulardaten auslesen, E-Mail klein schreiben
        const form = await request.formData();
        const email = String(form.get('email') ?? '').trim().toLowerCase();

        // Leeres Feld -> Fehlermeldung
        if (!email) {
            return fail(400, { error: 'Please enter your e-mail', email });
        }

        // Verify Mail: gibt es einen User mit dieser E-Mail?
        const [rows] = await pool.execute('SELECT id, name FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            const user = rows[0];
            // Zufälligen Token für den Link erzeugen
            const token = createToken();

            // Alte, noch offene Tokens ungültig machen -> immer nur ein gültiger Link
            await pool.execute(
                'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL',
                [user.id]
            );

            // Save Token in DB: nur der Hash wird gespeichert, 15 Minuten gültig
            await pool.execute(
                'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL 15 MINUTE)',
                [user.id, hashToken(token)]
            );

            // Send Mail: Link mit dem echten Token (nicht dem Hash)
            const link = url.origin + '/reset-password?token=' + token;

            // Mail über SMTP2GO verschicken (Absender aus MAIL_FROM in .env)
            await transporter.sendMail({
                from: env.MAIL_FROM,
                to: email,
                subject: 'Reset your password',
                text: 'Hi ' + user.name + ',\n\nclick this link to set a new password (valid for 15 minutes):\n' + link
            });
        }

        // Gleiche Antwort egal ob gefunden oder nicht,
        // damit man nicht herausfinden kann, welche E-Mails registriert sind.
        return { sent: true, email };
    }
};
