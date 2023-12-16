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
		// console.log(`hasMore: ${hasMore}`);
	});

	$effect(() => {
		// console.log("add listener");
		element?.addEventListener('scroll', onScroll);
		element?.addEventListener('resize', onScroll);
    if(element) {
      setTimeout(onScroll, 1);
    }

		return () => {
			const element = target ?? component?.parentNode;
			// console.log("remove listener");
			element?.removeEventListener('scroll', onScroll);
			element?.removeEventListener('resize', onScroll);
		};
	});

  const onScroll = () => {
		if (component == null) {
			return;
		}

		const rect = component.getBoundingClientRect();

		// console.log(`window inner height: ${window.innerHeight}`);
		// console.log(`elem rect: ${JSON.stringify(rect)}`);

		// console.log(`threshold: ${threshold}`);

		needMore = rect.top + threshold <= window.innerHeight;

		// console.log(`needMore: ${needMore}`);
		// console.log(`hasMore: ${hasMore}`);
		if (needMore && hasMore) {
			// console.log("invoke loadMore");
			onLoadMore();
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
