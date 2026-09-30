<script>
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Welcome | Your account</title>
	<meta name="description" content="Sign in to your account or create a new one." />
</svelte:head>

<!-- Responsive Abstände und Farben kommen aus den gemeinsamen Tailwind-Klassen. -->
<main class="page">
	<section class="card text-center" aria-labelledby="welcome-title">
		<span class="badge">YOUR ACCOUNT</span>
		<h1 id="welcome-title" class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
			A fresh start.
		</h1>
		<p class="mt-4 text-base leading-7 text-slate-500">
			Welcome! Sign in to pick up where you left off, or create an account to get started.
		</p>
		<div class="mt-8 flex flex-col gap-3">
			<a class="btn-primary" href={resolve('/login')}
				>Sign in <span class="ml-2" aria-hidden="true">→</span></a
			>
			<a class="btn-secondary" href={resolve('/register')}>Create an account</a>
		</div>
		<p class="mt-8 text-xs text-slate-500">One place to manage your account.</p>
	</section>
</main>
