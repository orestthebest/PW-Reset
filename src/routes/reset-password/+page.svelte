<script>

	import { resolve } from '$app/paths';

	// data = Token + ob er gültig ist, form = Fehler oder Erfolg

	let { data, form } = $props();
</script>
 
<svelte:head>
<title>Reset password | Your account</title>
</svelte:head>
 
<main class="page">
<section class="card">
<a class="link mb-6 inline-block text-sm" href={resolve('/login')}>← Back to login</a>
<div><span class="badge">PASSWORD RESET</span></div>
 
		{#if form?.success}
<!-- Erfolg: Passwort wurde geändert -->
<h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Password changed.</h1>
<p class="mb-8 text-sm leading-6 text-slate-500">

				Your new password is saved. For your safety you were logged out on all devices.
</p>
<a class="btn-primary" href={resolve('/login')}>Go to login</a>
 
		{:else if !data.valid}
<!-- Token ungültig, abgelaufen oder schon benutzt -->
<h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Link expired.</h1>
<p class="mb-8 text-sm leading-6 text-slate-500">

				This reset link is invalid, already used or older than 15 minutes.
</p>
<a class="btn-primary" href={resolve('/forgot-password')}>Request a new link</a>
 
		{:else}
<!-- Show Reset Page: neues Passwort 2x eingeben -->
<h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Set a new password.</h1>
<p class="mb-8 text-sm leading-6 text-slate-500">Choose a password with at least 8 characters.</p>
<form action="?/reset" method="POST" class="flex flex-col gap-5">

				{#if form?.error}
<p class="alert-error" role="alert">{form.error}</p>

				{/if}
<input type="hidden" name="token" value={data.token} />
<div>
<label class="label" for="password">New password</label>
<input class="input" id="password" name="password" type="password"

						autocomplete="new-password" minlength="8" required />
</div>
<div>
<label class="label" for="password2">Confirm password</label>
<input class="input" id="password2" name="password2" type="password"

						autocomplete="new-password" minlength="8" required />
</div>
<button class="btn-primary" type="submit">Save password</button>
</form>

		{/if}
</section>
</main>
 