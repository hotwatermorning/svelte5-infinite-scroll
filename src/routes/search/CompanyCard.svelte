<script lang="ts">
  type Props = {
    id: number;
    name: string;
    thumbnail: string;
  };

  let { id, name, thumbnail } = $props<Props>();
</script>

<a class="layout-company-card" href={`/companies/${id}`}>
  <img class="thumbnail" src={thumbnail} alt="thumbnail" />
  <div class="name">{name}</div>
</a>

<style>
  .layout-company-card {
    text-decoration: none;
    display: flex;
    gap: 10px;
    border-radius: 4px;
    padding: 10px;
  }

  .thumbnail {
    width: 120px;
    height: 80px;
    border-radius: 4px;
  }

  .name {
    color: #333;
  }
</style>
