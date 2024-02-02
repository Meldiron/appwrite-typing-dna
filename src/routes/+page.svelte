<script>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { signInWithTypingDna } from "$lib/appwrite";
	import { onMount } from "svelte";

	let loading = false;
	let email = '';
	let tdna;

	onMount(() => {
		if(browser) {
			tdna = new TypingDNA();
			tdna.addTarget('pattern');

			let disabler = new AutocompleteDisabler({showTypingVisualizer: true, showTDNALogo: true});
			// disabler.disableCopyPaste();
			disabler.disableAutocomplete();
		}
	});

	async function signIn(event) {
		event.preventDefault();

		if(loading) {
			return;
		}

		loading = true;

		try {
			const typingPattern = tdna.getTypingPattern({ type: 1, text: 'Appwrite is a truly open source backend as a service' });
			await signInWithTypingDna(email, typingPattern);
			goto('/user');
		} catch(err) {
			alert(err.message ? err.message : err.toString());
		} finally {
			loading = false;
		}
	}
</script>

<div class="u-max-width-500 u-width-full-line">
	<h1 class="heading-level-2 u-margin-block-start-auto">Sign in</h1>
	<div class="u-margin-block-start-24">
		<form class="form common-section" on:submit={signIn}>
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<p>
						Demo application of <a class="link" href="https://appwrite.io">Appwrite</a> authentication with custom tokens allowing integration with 
						<a class="link" href="https://www.typingdna.com/">Typing DNA</a
						>.
					</p>
				</li>
				<li class="form-item">
					<label class="label is-required" for="email">Email</label>
					<div class="input-text-wrapper">
						<input
							bind:value={email}
							id="email"
							placeholder="Email"
							type="email"
							class="input-text"
							autocomplete="off"
						/>
					</div>
				</li>
				<li class="form-item">
					<label class="label is-required" for="password">Typing Pattern</label>
					<div class="input-text-wrapper" style="--amount-of-buttons: 1">
						<input
							id="pattern"
							placeholder="Type sentence below"
							type="text"
							class="input-text disable-autocomplete"
							autocomplete="off"
						/>

						<p class="u-margin-block-start-4">Appwrite is a truly open source backend as a service</p>
					</div>
				</li>
				<li class="form-item">
					<button disabled={loading} class="button is-full-width" type="submit"> Sign in</button>
				</li>
			</ul>
		</form>
	</div>
	<ul class="inline-links is-center is-with-sep u-margin-block-start-32">
		<li class="inline-links-item">
			<span class="text">Don't have an account? <a class="link" href="/signup">Sign up</a></span>
		</li>
	</ul>
</div>

<style>
	.with-separators {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-transform: uppercase;
		width: 100%;
		color: var(--separator-text);
		--separator-color: hsl(var(--color-neutral-85));
		--separator-text: hsl(var(--color-neutral-60));
	}

	.with-separators:before,
	.with-separators:after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--separator-color);
	}
</style>
