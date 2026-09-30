<script>
	import { resolve } from '$app/paths';
	// Übernimmt Fehlermeldungen und eingegebene Werte
	let { form } = $props();
</script>

<svelte:head>
	<title>Create an account | Your account</title>
</svelte:head>

<!-- Zeigt das Registrierungsformular -->
<main class="page">
	<section class="card">
		<a class="link mb-6 inline-block text-sm" href={resolve('/')}>← Back to home</a>
		<div><span class="badge">YOUR ACCOUNT</span></div>
		<h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Make yourself at home.</h1>
		<p class="mb-8 text-sm leading-6 text-slate-500">Create an account in just a few steps.</p>
		<form action="?/register" method="POST" class="flex flex-col gap-5">
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
				<label class="label" for="email">E-mail</label>
				<input
					class="input"
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					value={form?.email ?? ''}
					required
				/>
			</div>
			<div>
				<label class="label" for="password">Password</label>
				<p id="password-help" class="mb-2 text-xs text-slate-500">Use at least 8 characters.</p>
				<input
					class="input"
					id="password"
					aria-describedby="password-help"
					name="password"
					type="password"
					autocomplete="new-password"
					minlength="8"
					required
				/>
			</div>
			<div>
				<label class="label" for="password2">Confirm password</label>
				<input
					class="input"
					id="password2"
					name="password2"
					type="password"
					autocomplete="new-password"
					minlength="8"
					required
				/>
			</div>
			<button class="btn-primary" type="submit">Register</button>
			<!-- Verlinkt zur Anmeldung -->
			<p class="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
				Already have an account? <a class="link" href={resolve('/login')}>Login</a>
			</p>
		</form>
	</section>
</main>
