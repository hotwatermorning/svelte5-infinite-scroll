<script lang="ts">
	type Props = {
		threshold: number;
		target: EventTarget | undefined;
		hasMore: boolean;
		onLoadMore: () => void;
	};

	let { threshold = 0, target = undefined, hasMore, onLoadMore } = $props<Props>();

	let needMore = $state(false);
	let component = $state<HTMLDivElement>();

	$effect(() => {
		const element = target ?? component?.parentNode;
		element?.addEventListener('scroll', onScroll);
		element?.addEventListener('resize', onScroll);
    if(element) {
      setTimeout(onScroll, 1);
    }

		return () => {
			const element = target ?? component?.parentNode;
			element?.removeEventListener('scroll', onScroll);
			element?.removeEventListener('resize', onScroll);
		};
	});

  const onScroll = () => {
		if (component == null) {
			return;
		}

		const rect = component.getBoundingClientRect();

		needMore = rect.top + threshold <= window.innerHeight;

		if (needMore && hasMore) {
			onLoadMore();
      setInterval(() => onScroll(), 1);
		}
	};
</script>

<div class="infinity-scroll-element" bind:this={component} />

<style>
	.infinity-scroll-element {
		width: 100%;
		height: 0px;
		border: none;
		border: 1px solid red;
	}
</style>
