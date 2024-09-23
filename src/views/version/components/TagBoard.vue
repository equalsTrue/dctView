<template>
  <div class="board-column">
    <sticky>
      <div class="board-column-header">
        {{ headerText }}
      </div>
    </sticky>
    <div
      :list="list"
      class="board-column-content">
      <div v-for="element in list" :key="element.id" class="board-item">
        <span style="font-size: 1.1em;"><strong>{{ element.name }}</strong></span>
        <span style="line-height: 0.2em;font-size: 0.8em;">【{{ element.date }}】</span>
        <p style="line-height: 1em;font-size: 1em;">{{ element.description }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import Sticky from '@/components/Sticky'

export default {
  name: 'TagBoard',
  components: {
    draggable,
    Sticky
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
<style lang="scss">
.board-column {
  min-width: 350px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 100px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 1em;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);
    }
  }
}
</style>

