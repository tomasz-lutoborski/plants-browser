<script lang="ts">
	export let data;
	let foundSpecies: { name: string; family: string }[] = [];
	let timer: NodeJS.Timeout;

	import { onMount } from 'svelte';
	import type {
		PostMessage,
		PostMessageDataRequest,
		PostMessageDataResponse
	} from '$lib/message-type';

	let syncWorker: Worker | undefined = undefined;

	function onWorkerMessage({
		data: { msg, data }
	}: MessageEvent<PostMessage<PostMessageDataResponse>>) {
		if (msg === 'result') {
			foundSpecies = data;
		}
	}

	async function loadWorker() {
		const SyncWorker = await import('$lib/fuse-worker?worker');
		syncWorker = new SyncWorker.default();

		syncWorker.onmessage = onWorkerMessage;

		const message: PostMessage<PostMessageDataRequest> = {
			msg: 'init',
			data: data.jsonData
		};
		syncWorker.postMessage(message);
	}

	function handleSearch(e: Event) {
		if (syncWorker) {
			const target = e.target as HTMLInputElement;
			const message: PostMessage<PostMessageDataRequest> = {
				msg: 'search',
				data: data.jsonData,
				query: target.value
			};

			clearTimeout(timer);
			timer = setTimeout(() => syncWorker?.postMessage(message), 300);
		}
	}

	// function handleSpeciesClick(e: Event) {
	// 	const target = e.target as HTMLButtonElement;
	// 	const speciesName = target.querySelector('.search__species')?.textContent;

	// 	if (speciesName) {
	// 	}
	// }

	onMount(loadWorker);
</script>

<div class="content">
	<section class="search__wrapper">
		<input class="search__input" type="text" on:input={(e) => handleSearch(e)} />

		<div class="search__cards">
			{#each foundSpecies as species}
				<button class="search__card">
					<div class="search__text search__text--right">
						<p class="search__label">species</p>
						<h3 class="search__species">{species.name}</h3>
					</div>
					<div class="search__text search__text--left">
						<p class="search__label">family</p>
						<h3 class="search__family">{species.family}</h3>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<section class="info__wrapper">
		<h1>Species name</h1>
		<div id="map" />
		<p>photos</p>
	</section>
</div>

<style>
	p,
	h1,
	h3 {
		margin: 0;
	}

	.content {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}
	.search__cards {
		max-height: 80vh;
		overflow-y: auto;
	}
	.search__wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.search__input {
		border: solid 1px var(--color-green-1);
		padding: 0.5rem;
		margin-bottom: 1rem;
		border-radius: 5px;
		transition: all 0.1s linear;
	}

	.search__input:focus {
		outline: solid 2px var(--color-green-2);
		outline-offset: 2px;
	}

	.search__card {
		border: solid 1px var(--color-green-1);
		width: 100%;
		background-color: rgba(141, 224, 177, 0.2);
		padding: 0.5rem;
		margin-bottom: 1rem;
		border-radius: 5px;
		transition: all 0.1s linear;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		cursor: pointer;
	}

	.search__card:hover {
		background-color: rgba(141, 224, 177, 0.4);
	}

	.search__text {
		display: flex;
		flex-direction: column;
	}
	.search__text--left {
		align-items: flex-end;
	}

	.search__text--right {
		align-items: flex-start;
	}

	.info__wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>
