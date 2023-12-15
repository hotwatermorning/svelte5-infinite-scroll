<script lang="ts">
  type Props = {
    threshold: number,
    nodeToScroll: Node | undefined,
    hasMore: boolean,
    onLoadMore: () => void,
  };

  let {
    threshold = 0,
    nodeToScroll = undefined,
    hasMore,
    onLoadMore,
  } = $props<Props>();

  let needMore = $state(false);
  let component = $state<HTMLDivElement>();

  $effect(() => {
    // console.log(`hasMore: ${hasMore}`);
  });

  $effect(() => {
    const element = nodeToScroll ?? component?.parentNode;
    // console.log("add listener");
    element?.addEventListener("scroll", onScroll);
    element?.addEventListener("resize", onScroll);

    return () => {
      const element = nodeToScroll ?? component?.parentNode;
      // console.log("remove listener");
      element?.removeEventListener("scroll", onScroll);
      element?.removeEventListener("resize", onScroll);
    };
  });

  const onScroll = (e: Event) => {
    const element = e.target as HTMLElement;
    if(element == null) {
      return;
    }

    if(component == null) {
      return;
    }

    const rect = component.getBoundingClientRect();

    // console.log(`window inner height: ${window.innerHeight}`);
    // console.log(`elem rect: ${JSON.stringify(rect)}`);

    // console.log(`threshold: ${threshold}`);

    needMore = rect.top + threshold <= window.innerHeight;

    // console.log(`needMore: ${needMore}`);
    // console.log(`hasMore: ${hasMore}`);
    if(needMore && hasMore) {
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
