import { randomBytes, createHash } from 'crypto';

// Erstellt einen zufälligen Token für den Reset-Link (64 Zeichen).
export function createToken() {
    return randomBytes(32).toString('hex');
}

// Hasht den Token mit SHA-256 – in der DB wird nur der Hash gespeichert.
export function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}