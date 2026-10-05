// Gibt den eingeloggten User an jede Seite weiter (über data.user).
// locals.user wird vorher in hooks.server.js gesetzt.
export const load = async ({ locals }) => {
    return {
        user: locals.user
    };
};
