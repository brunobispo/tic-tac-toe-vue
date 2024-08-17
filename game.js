import Score from './score.js'
import Board from './board.js'
import Message from './message.js'
import PlayAgain from './playAgain.js'

const { ref, watch, computed } = Vue

function createEmptyBoard() {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]
}

function randomPlayer() {
  return Math.round(Math.random()) ? X : O
}

const X = 'x'
const O = 'o'
const PLAYERS = ['1', '2']
const MARKERS = [O, X]

export default {
  setup() {
    const turn = ref(randomPlayer())
    const board = ref(createEmptyBoard())
    const score = ref([0, 0])

    const player = computed(() => MARKERS.indexOf(turn.value))
    const finished = computed(
      () =>
        winner.value != null || board.value.every((row) => row.every(Boolean)),
    )
    const winner = computed(() => {
      // prettier-ignore
      const combinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
      ];

      for (const positions of combinations) {
        const markers = positions.map(
          ([row, column]) => board.value[row][column],
        )
        if (markers.every((value) => value != null && value === markers[0])) {
          // return the player who owns the winning markers
          return MARKERS.indexOf(markers[0])
        }
      }

      return null
    })

    watch(winner, (value) => {
      if (value != null) {
        score.value[value] += 1
      }
    })

    function handleReset() {
      turn.value = randomPlayer()
      board.value = createEmptyBoard()
    }

    function handleMove(row, column) {
      if (board.value[row][column] !== null) return
      if (finished.value) return

      board.value[row][column] = turn.value
      turn.value = turn.value === X ? O : X
    }

    return {
      PLAYERS,
      turn,
      board,
      player,
      winner,
      finished,
      score,
      handleReset,
      handleMove,
    }
  },
  template: `
    <div class="game">
      <Score :player1="score[0]" :player2="score[1]" />
      <Board :board="board" @move="handleMove" />
      <Message v-if="winner != null" :text="'Player ' + PLAYERS[winner] + ' wins'" />
      <Message v-else-if="finished" text="It's a draw" />
      <Message v-else :text="'It\\'s player ' + PLAYERS[player] + '\\'s turn'" />
      <PlayAgain v-if="finished" @click="handleReset" />
    </div>
  `,
  components: {
    Score,
    Board,
    Message,
    PlayAgain,
  },
}
