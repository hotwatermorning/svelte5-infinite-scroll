<script lang="ts">
  type Props = {
    threshold: number;
    target: EventTarget | undefined;
    hasMore: boolean;
    onLoadMore: () => Promise<void>;
  };

  let { threshold = 0, target = undefined, hasMore, onLoadMore } = $props<Props>();

  let component = $state<HTMLDivElement>();
  let element = $derived(target ?? component?.parentNode);

  $effect(() => {
    element?.addEventListener('scroll', onScroll);
    element?.addEventListener('resize', onScroll);
    if (element) {
      // InfiniteScroll コンポーネントが最初にマウントされたタイミングで
      // すでにデータの追加読み込みが必要な場合がある。
      // その場合に備えてイベントを発火させておく
      const ev = new CustomEvent("scroll");
      element?.dispatchEvent(ev);
    }

    return () => {
      element?.removeEventListener('scroll', onScroll);
      element?.removeEventListener('resize', onScroll);
    };
  });

  const onScroll = async () => {
    if (component == null) {
      return;
    }

    const rect = component.getBoundingClientRect();

    const needMore = rect.top + threshold <= window.innerHeight;

    if (needMore && hasMore) {
      await onLoadMore();
      const ev = new CustomEvent("scroll");
      element?.dispatchEvent(ev);
    }
  };
</script>

<div class="infinity-scroll-element" bind:this={component} />

<style>
  .infinity-scroll-element {
    width: 100%;
    height: 0px;
    border: none;
  }
</style>
