import { validateSession } from '$lib/server/auth.js';

// Läuft bei jeder Anfrage: liest die Session aus dem Cookie und legt den
// eingeloggten User in event.locals ab, damit ihn alle Seiten nutzen können.
export async function handle({ event, resolve }) {
    // Session-ID aus dem Cookie "session" lesen
    const sessionId = event.cookies.get('session');
    // Gültige Session -> User-Objekt, sonst null (= nicht eingeloggt)
    event.locals.user = sessionId ? await validateSession(sessionId) : null;
    // Anfrage normal weiterverarbeiten
    return resolve(event);
}
