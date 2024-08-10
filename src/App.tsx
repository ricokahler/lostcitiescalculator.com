import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { RoundCalculator } from './RoundCalculator';
import { GameState, RoundState, ranks, suits } from './types';
import styles from './App.module.css';
import { SegmentedControl } from './SegmentedControl';

function calculateRoundScore(state: RoundState) {
  const total = suits
    .map((suit) => {
      const parsed = ranks.map((rank) =>
        state.expeditions[`${suit}-${rank}`] ? parseInt(rank, 10) : 0,
      );

      const expeditionTotal = parsed.reduce((sum, rank) => sum + rank, 0);
      const wagerMultiplier = state.wagers[suit] || 1;
      const cardCount =
        parsed.filter((i) => i > 0).length + (wagerMultiplier - 1);

      const roi = cardCount === 0 ? 0 : expeditionTotal - 20;
      const bonus = cardCount >= 8 ? 20 : 0;
      const score = roi * wagerMultiplier + bonus;
      return score;
    })
    .reduce((sum, next) => sum + next, 0);

  return total;
}

const initialState: GameState = {
  player1: [
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
  ],
  player2: [
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
    { expeditions: {}, wagers: {} },
  ],
};

function App() {
  const [state, setState] = useState(() => {
    const savedGameState = localStorage.getItem('game_state');
    if (!savedGameState) return initialState;
    try {
      return JSON.parse(savedGameState) as GameState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('game_state', JSON.stringify(state));
    } catch {
      // intentionally blank
    }
  }, [state]);

  const [player, setPlayer] = useState('Player 1');
  const [round, setRound] = useState('Round 1');

  const scoreRound1Player1 = calculateRoundScore(state.player1[0]);
  const scoreRound2Player1 = calculateRoundScore(state.player1[1]);
  const scoreRound3Player1 = calculateRoundScore(state.player1[2]);
  const scorePlayer1 =
    scoreRound1Player1 + scoreRound2Player1 + scoreRound3Player1;
  const scoreRound1Player2 = calculateRoundScore(state.player2[0]);
  const scoreRound2Player2 = calculateRoundScore(state.player2[1]);
  const scoreRound3Player2 = calculateRoundScore(state.player2[2]);
  const scorePlayer2 =
    scoreRound1Player2 + scoreRound2Player2 + scoreRound3Player2;

  const roundState = (() => {
    if (player === 'Player 1') {
      if (round === 'Round 1') return state.player1[0];
      if (round === 'Round 2') return state.player1[1];
      return state.player1[2];
    }

    if (round === 'Round 1') return state.player2[0];
    if (round === 'Round 2') return state.player2[1];
    return state.player2[2];
  })();

  const handleChange = (updateRound: (state: RoundState) => RoundState) => {
    setState((prev) => {
      if (player === 'Player 1') {
        if (round === 'Round 1') {
          return {
            ...prev,
            player1: [
              updateRound(prev.player1[0]),
              prev.player1[1],
              prev.player1[2],
            ],
          };
        } else if (round === 'Round 2') {
          return {
            ...prev,
            player1: [
              prev.player1[0],
              updateRound(prev.player1[1]),
              prev.player1[2],
            ],
          };
        } else {
          return {
            ...prev,
            player1: [
              prev.player1[0],
              prev.player1[1],
              updateRound(prev.player1[2]),
            ],
          };
        }
      } else {
        if (round === 'Round 1') {
          return {
            ...prev,
            player2: [
              updateRound(prev.player2[0]),
              prev.player2[1],
              prev.player2[2],
            ],
          };
        } else if (round === 'Round 2') {
          return {
            ...prev,
            player2: [
              prev.player2[0],
              updateRound(prev.player2[1]),
              prev.player2[2],
            ],
          };
        } else {
          return {
            ...prev,
            player2: [
              prev.player2[0],
              prev.player2[1],
              updateRound(prev.player2[2]),
            ],
          };
        }
      }
    });
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.emoji}>🏕️</div>
        <div>
          <div className={styles.title}>Lost Cities</div>
          <div className={styles.subtitle}>Score Calculator</div>
        </div>
      </header>
      <div className={styles.summary}>
        <div className={styles.playerScore}>
          <div className={styles.score}>
            <div className={styles.scoreMain}>{scorePlayer1}</div>
            <div className={styles.scoreRounds}>
              <div className={styles.score}>{scoreRound1Player1}</div>
              <div>+</div>
              <div className={styles.score}>{scoreRound2Player1}</div>
              <div>+</div>
              <div className={styles.score}>{scoreRound3Player1}</div>
            </div>
          </div>
          <div className={classNames(styles.playerName, styles.player1)}>
            Player 1
          </div>
        </div>

        <div className={styles.playerScore}>
          <div className={styles.score}>
            <div className={styles.scoreMain}>{scorePlayer2}</div>
            <div className={styles.scoreRounds}>
              <div className={styles.score}>{scoreRound1Player2}</div>
              <div>+</div>
              <div className={styles.score}>{scoreRound2Player2}</div>
              <div>+</div>
              <div className={styles.score}>{scoreRound3Player2}</div>
            </div>
          </div>
          <div className={classNames(styles.playerName, styles.player2)}>
            Player 2
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <div className={styles.selectors}>
          <SegmentedControl
            segments={['Round 1', 'Round 2', 'Round 3']}
            onChange={setRound}
            value={round}
            color="#00964e"
          />

          <SegmentedControl
            segments={['Player 1', 'Player 2']}
            onChange={setPlayer}
            value={player}
            color={player === 'Player 1' ? '#3196f5' : '#d11111'}
          />
        </div>

        <button
          className={styles.reset}
          onClick={() => {
            if (confirm('Are you sure you want to reset?')) {
              setRound('Round 1');
              setState(initialState);
            }
          }}
        >
          Reset
        </button>
      </div>

      <RoundCalculator state={roundState} onChange={handleChange} />

      <footer className={styles.footer}>
        <a href="mailto:hello@rico.codes">hello@rico.codes</a>
        <a href="https://github.com/ricokahler/lostcitiescalculator.com">
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
