<script>
    import { resolve } from '$app/paths';
    // Übernimmt Fehlermeldungen, die E-Mail und ob die Mail verschickt wurde
    let { form } = $props();
</script>

<svelte:head>
    <title>Forgot password | Your account</title>
</svelte:head>

<!-- Passwort vergessen: E-Mail eingeben oder Bestätigung anzeigen -->
<main class="page">
    <section class="card">
        <a class="link mb-6 inline-block text-sm" href={resolve('/login')}>← Back to login</a>
        <div><span class="badge">PASSWORD RESET</span></div>

        {#if form?.sent}
            <!-- Zeigt die Bestätigung, nachdem die Mail verschickt wurde -->
            <h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Check your mail.</h1>
            <p class="mb-8 text-sm leading-6 text-slate-500">
                If an account exists for <span class="font-semibold text-slate-900">{form.email}</span>,
                we sent you a reset link. It is valid for 15 minutes.
            </p>
            <p class="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                No mail? <a class="link" href={resolve('/forgot-password')}>Try again</a>
            </p>
        {:else}
            <!-- Zeigt das Formular zur Eingabe der E-Mail -->
            <h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Forgot your password?</h1>
            <p class="mb-8 text-sm leading-6 text-slate-500">
                Enter your e-mail and we will send you a link to reset it.
            </p>
            <form action="?/send" method="POST" class="flex flex-col gap-5">
                <!-- Fehlermeldung, z.B. wenn keine E-Mail eingegeben wurde -->
                {#if form?.error}
                    <p class="alert-error" role="alert">{form.error}</p>
                {/if}
                <!-- Eingabefeld für die E-Mail -->
                <div>
                    <label class="label" for="email">E-Mail</label>
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
                <!-- Absende-Button: schickt das Formular an den send-Action -->
                <button class="btn-primary" type="submit">Send mail</button>
                <!-- Verlinkt zurück zum Login -->
                <p class="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                    Remembered it? <a class="link" href={resolve('/login')}>Login</a>
                </p>
            </form>
        {/if}
    </section>
</main>
