<script lang="ts">
    import { deleteSession } from '$lib/appwrite';
    import { goto } from "$app/navigation";

	export let data;

	const { account } = data;

	function getInitials(name: string) {
		const [first, last] = name.split(' ');
		if (last) return `${first[0]}${last[0]}`;
		return `${first[0]}`;
	}

    let loading = false;

    async function signOut() {
		if(loading) {
			return;
		}

		loading = true;

		try {
			await deleteSession();
			goto('/');
		} catch(err) {
			alert(err.message ? err.message : err.toString());
		} finally {
			loading = false;
		}
    }
</script>

<div class="u-max-width-500 u-width-full-line">
	<h1 class="heading-level-2 u-margin-block-start-auto">Your account</h1>
	<div class="u-margin-block-start-24">
		<section class="card">
			<div class="user-profile">
				<span class="avatar">{getInitials(account.email)}</span>
				<span class="user-profile-info">
					<span class="name">{account.email}</span>
					<div class="interactive-text-output u-padding-inline-0">
						<span class="text">{account.$id}</span>
						<div class="u-flex u-cross-child-start u-gap-8">
							<button class="interactive-text-output-button" aria-label="copy text">
								<span class="icon-duplicate" aria-hidden="true" />
							</button>
						</div>
					</div>
				</span>
			</div>
		</section>
		<form class="form common-section" method="POST">
			<ul class="form-list" style="--form-list-gap: 1.5rem;">
				<li class="form-item">
					<button disabled={loading} on:click={signOut} class="button is-secondary is-full-width" type="submit">Sign out</button>
				</li>
			</ul>
		</form>
	</div>
</div>