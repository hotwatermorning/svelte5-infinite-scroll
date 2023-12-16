<script lang="ts">
  import { goto } from '$app/navigation';

  type Props = {
    query: string;
    onSearch: (query: string) => void;
  };

  let { query, onSearch } = $props<Props>();

  let text = $state('');

  $effect(() => {
    text = query;
  });

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onClicked();
    }
  }

  function onClicked() {
    onSearch(text);
  }
</script>

<div class="layout-search-control">
  <input type="text" bind:value={text} on:keydown={onKeydown} />
  <button on:click={onClicked} disabled={text.trim() === ''}>検索</button>
</div>

<style>
  .layout-search-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input {
    border: 1px solid #ccc;
    padding: 6px 10px;
    border-radius: 4px;
    color: #666;
    width: 100%;
  }

  button {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    background-color: #4444ff;
    color: #fff;
    width: 100px;
  }
</style>
