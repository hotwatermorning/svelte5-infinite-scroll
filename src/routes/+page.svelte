<script lang="ts">
	import { goto } from "$app/navigation";
	import SearchControl from "../components/SearchControl.svelte";

	let query = "";
	const onSearch = (queryText: string) => {
		goto(`/search/?q=${encodeURIComponent(queryText)}`);
	};

</script>

<section>
	<div class="search-control-wrapper">
		<SearchControl {query} onSearch={onSearch} />
	</div>
</section>

<style>
	.search-control-wrapper {
		max-width: 600px;
	}
</style>
