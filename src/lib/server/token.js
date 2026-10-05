// Hilfsfunktionen für den Reset-Token (Link in der Mail)
import { randomBytes, createHash } from 'crypto';

// Erstellt einen zufälligen Token für den Reset-Link
// 32 zufällige Bytes -> 64 Hex-Zeichen, praktisch nicht zu erraten
export function createToken() {
    return randomBytes(32).toString('hex');
}

// Hasht den Token mit SHA-256 – in der DB wird nur der Hash gespeichert.
// Falls jemand die Datenbank sieht, kann er mit dem Hash keinen Link bauen.
export function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}
