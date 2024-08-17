import Tile from './tile.js'

export default {
  props: ['board'],
  events: ['move'],
  template: `
    <div class="board">
      <template v-for="(row, rowIndex) in board" :index="rowIndex">
        <Tile v-for="(marker, columnIndex) in row" :marker="marker" @click="$emit('move', rowIndex, columnIndex)" />
      </template>
    </div>
  `,
  components: {
    Tile,
  },
}
