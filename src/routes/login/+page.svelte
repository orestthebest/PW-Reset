<script>
	import { resolve } from '$app/paths';
	// Übernimmt Fehlermeldungen und den Benutzernamen
	let { form } = $props();
</script>

<svelte:head>
	<title>Sign in | Your account</title>
</svelte:head>

<!-- Zeigt das Anmeldeformular -->
<main class="page">
	<section class="card">
		<a class="link mb-6 inline-block text-sm" href={resolve('/')}>← Back to home</a>
		<div><span class="badge">YOUR ACCOUNT</span></div>
		<h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back.</h1>
		<p class="mb-8 text-sm leading-6 text-slate-500">Sign in to pick up where you left off.</p>
		<form action="?/login" method="POST" class="flex flex-col gap-5">
			{#if form?.error}
				<p class="alert-error" role="alert">{form.error}</p>
			{/if}
			<div>
				<label class="label" for="username">Username</label>
				<input
					class="input"
					id="username"
					name="username"
					autocomplete="username"
					value={form?.username ?? ''}
					required
				/>
			</div>
			<div>
				<div class="flex flex-wrap items-baseline justify-between gap-x-3">
					<label class="label" for="password">Password</label>
					<a class="link text-xs" href={resolve('/forgot-password')}>Forgot password?</a>
				</div>
				<input
					class="input"
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
			</div>
			<button class="btn-primary" type="submit">Login</button>
			<!-- Verlinkt zur Registrierung -->
			<p class="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
				No account? <a class="link" href={resolve('/register')}>Register</a>
			</p>
		</form>
	</section>
</main>
