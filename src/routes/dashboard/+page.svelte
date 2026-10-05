<script>
	// The user comes from +layout.server.js
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard | Your account</title>
</svelte:head>

<main class="page">
	<section class="card">
		<div><span class="badge">YOUR ACCOUNT</span></div>
		<h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">
			Hi, {data.user.username}.
		</h1>
		<p class="mb-8 text-sm leading-6 text-slate-500">You are logged in as {data.user.email}.</p>
		<form method="POST" action="/logout?/logout">
			<button class="btn-primary" type="submit">Log out</button>
		</form>
	</section>
</main>