<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { Snapshot } from "@sveltejs/kit";
	import SearchControl from "../../components/SearchControl.svelte";
	import type { Company } from "../../models";
	import CompanyCard from "./CompanyCard.svelte";
	import InfinityScroll from "../../components/InfinityScroll.svelte";
	import { onMount } from "svelte";

	let query = $state("");
  const perPage = 10;
  let isLoading = $state(false);

  $effect(() => {
    query = decodeURIComponent($page.url.searchParams.get("q") ?? "");
  });

  const onSearch = (queryText: string) => {
    console.log(`onSearch: ${queryText}`);
    goto(`/search/?q=${encodeURIComponent(queryText)}`);
  };

  type SearchResult = {
    companies: Company[];
    total: number;
  }

  type PageData = {
    searchResult: SearchResult;
    pageIndex: number;
    scrollPosition: number;
    query: string;
  };

  const createEmptyPageData = (): PageData => ({
    searchResult: { companies: [], total: 0 },
    pageIndex: -1,
    scrollPosition: 0,
    query: "",
  });

  let pageData = $state<PageData>(createEmptyPageData());

  export const snapshot: Snapshot = {
    capture: () => {
      console.log(`saved scrollPosition: ${window.scrollY}`);
      return { ...pageData, scrollPosition: window.scrollY }
    },
    restore: async (value: PageData) => {
      pageData = value;
      console.log(`stored scrollPosition: ${pageData.scrollPosition}`);
      // DOM の再構築が終わってからスクロール位置を戻すために次のイベントループまで待つ
      setTimeout(() => {
        window.scroll(0, pageData.scrollPosition);
      }, 0);
    }
  };

  const searchCompanies = async (query: string, pageIndex: number, perPage: number) => {
    return await fetch(`${$page.url.origin}/api/v1/companies?q=${encodeURIComponent(query)}&page=${pageIndex + 1}&perPage=${perPage}`);
  };

  const loadMore = async () => {
    if (isLoading) {
      return;
    }
    if (query.trim() === '') {
      return;
    }

    isLoading = true;

    await new Promise((resolve) => setTimeout(resolve, 300));

    // console.log(`searchCompanies: ${query}`);
    const res = await searchCompanies(query.trim(), pageData.pageIndex + 1, perPage);
    if(!res.ok) {
      // TODO: error handling
      return;
    }

    const payload = await res.json() as SearchResult;
    pageData.searchResult.total = payload.total;
    pageData.searchResult.companies.push(...payload.companies);
    pageData.pageIndex += 1;
    pageData = pageData;
    isLoading = false;
  };

  let itemCount = $derived(pageData.pageIndex * perPage);
  let hasMoreData = $derived(pageData.pageIndex * perPage < (pageData.searchResult.total ?? 0));

  $effect(() => {
    // console.log(`itemCount changed: ${itemCount}`);
  });

  $effect(() => {
    // console.log(`hasMoreData changed: ${hasMoreData}`);
  });

  $effect(() => {
    if(query.trim() !== "" && pageData.query !== query) {
      console.log("clear pageData");
      pageData = createEmptyPageData();
      pageData.query = query;
      console.log("invoke loadMore");
      loadMore();
    }
  });
</script>

<section>
  <div class="search-control-wrapper">
    <SearchControl query={query} onSearch={onSearch} />
    {#each pageData.searchResult.companies as c}
    <div class="company-card-wrapper">
      <CompanyCard id={c.id} name={c.name} thumbnail={c.url} />
    </div>
    {/each}
    {#if isLoading}
      <div class="loading-indicator">Loading...</div>
    {:else}
    <InfinityScroll
      nodeToScroll={document}
      threshold={20}
      hasMore={hasMoreData}
      onLoadMore={loadMore}
    />
    {/if}
  </div>
</section>

<style>
	.search-control-wrapper {
		max-width: 600px;
	}

  .company-card-wrapper + .company-card-wrapper {
    border-top: 1px solid #00000020;
  }
</style>
