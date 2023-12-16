<script lang="ts">
	import { page } from '$app/stores';
	let pageData = $derived($page.data);
</script>

<section>
	<h1>{pageData.name}</h1>
	<img class="image" src={pageData.url} alt="company" />
</section>

<style>
	section {
		max-width: 600px;
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	image {
		max-width: 480px;
	}
</style>
