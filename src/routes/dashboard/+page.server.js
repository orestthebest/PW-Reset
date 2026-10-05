import { redirect } from '@sveltejs/kit';

// Only logged-in users may see the dashboard
export function load({ locals }) {
	if (!locals.user) redirect(303, '/login');
}