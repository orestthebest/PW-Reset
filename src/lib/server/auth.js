// Hilfsfunktionen für Passwörter und Sessions (Login, Logout, Passwort-Reset)
import pool from './db.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

// Verschlüsselt ein Passwort zu einem bcrypt-Hash (10 Runden)
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

// Vergleicht ein eingegebenes Passwort mit dem gespeicherten Hash (true/false)
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

// Erstellt eine neue Session für einen User und speichert sie in der Datenbank
export async function createSession(userId) {
    // Zufällige, nicht erratbare Session-ID (kommt später ins Cookie)
    const sessionId = randomUUID();
    // Ablaufdatum: jetzt + 30 Tage
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Tage
    // Session in der Tabelle "sessions" speichern
    await pool.execute(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sessionId, userId, expiresAt]
    );
    return sessionId;
}

// Prüft eine Session und gibt den dazugehörigen User zurück (oder null)
export async function validateSession(sessionId) {
    // Session + User in einer Abfrage holen, nur wenn die Session noch nicht abgelaufen ist.
    // "name AS username", damit die Seiten data.user.username verwenden können.
    const [rows] = await pool.execute(
        `SELECT u.id, u.name AS username, u.email, u.role
         FROM sessions s JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.expires_at > NOW()`,
        [sessionId]
    );
    // Erster Treffer oder null, wenn die Session ungültig ist
    return rows[0] ?? null;
}

// Löscht eine Session aus der Datenbank (Logout)
export async function invalidateSession(sessionId) {
    await pool.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

// Löscht ALLE Sessions eines Users (nach Passwort-Reset -> überall ausgeloggt)
export async function invalidateAllSessions(userId) {
    await pool.execute('DELETE FROM sessions WHERE user_id = ?', [userId]);
}
