// Gibt den eingeloggten User an jede Seite weiter (über data.user).
export const load = async ({ locals }) => {
    return {
        user: locals.user
    };
};