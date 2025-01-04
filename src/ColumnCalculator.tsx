import classNames from 'classnames';
import styles from './ColumnCalculator.module.css';
import { adjustHue, darken, transparentize } from 'color2k';
import { Suit, RoundState, ExpeditionCard } from './types';

interface ColumnCalculatorProps {
  suit: Suit;
  state: RoundState;
  onChange: (reducer: (state: RoundState) => RoundState) => void;
  color: string;
}

const updateWager =
  (suit: Suit) =>
  (state: RoundState): RoundState => {
    const wager = state.wagers[suit] || 1;

    if (wager === 1) {
      return { ...state, wagers: { ...state.wagers, [suit]: 2 } };
    } else if (wager === 2) {
      return { ...state, wagers: { ...state.wagers, [suit]: 3 } };
    } else if (wager === 3) {
      return { ...state, wagers: { ...state.wagers, [suit]: 4 } };
    } else {
      const next = { ...state.wagers };
      delete next[suit];
      return { ...state, wagers: next };
    }
  };

const toggleExpeditionCard =
  (key: ExpeditionCard) =>
  (state: RoundState): RoundState => {
    const next = { ...state.expeditions };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = true;
    }

    return { ...state, expeditions: next };
  };

export function ColumnCalculator({
  suit,
  state,
  onChange,
  color = suit,
}: ColumnCalculatorProps) {
  const { expeditions, wagers } = state;
  const values = Array.from(Array(9)).map((_, i) => i + 2);
  const wager = wagers[suit] || 1;

  const cardsInSuit = Object.keys(expeditions)
    .map((card) => {
      const [suit, value] = card.split('-');
      return { suit, value: parseInt(value, 10) };
    })
    .filter((card) => card.suit === suit);

  const sum = cardsInSuit.reduce((sum, card) => sum + card.value, 0);

  const cardCount = cardsInSuit.length + (wager - 1);

  const roi = cardCount === 0 ? 0 : sum - 20;
  const bonus = cardCount >= 8 ? 20 : 0;
  const score = roi * wager + bonus;

  return (
    <div
      className={styles.columnCalculator}
      style={{
        // @ts-expect-error types are wrong
        '--suit-active': `linear-gradient(${color}, ${adjustHue(color, 30)})`,
        '--suit-pressed': `linear-gradient(${darken(color, 0.1)}, ${darken(
          adjustHue(color, 30),
          0.1,
        )})`,
        '--suit-inactive': transparentize(color, 0.7),
        '--suit-text': transparentize(color, 0.3),
      }}
    >
      <div className={styles.controls}>
        <button
          className={classNames(styles.button, {
            [styles.buttonActive]: wager > 1,
          })}
          onClick={() => onChange(updateWager(suit))}
        >
          🫱🏼‍🫲🏾{wager !== 1 && <small>x{wager}</small>}
        </button>

        {values.map((value) => {
          const key = `${suit}-${value}` as ExpeditionCard;
          return (
            <button
              key={key}
              className={classNames(styles.button, styles.expeditionCard, {
                [styles.buttonActive]: expeditions[key],
              })}
              onClick={() => onChange(toggleExpeditionCard(key))}
            >
              {value}
            </button>
          );
        })}
      </div>

      <div className={styles.summary}>
        <div className={styles.roiWager}>
          <div className={styles.roi}>{roi}</div>
          <div
            className={classNames(styles.wager, {
              [styles.wagerActive]: wager > 1,
            })}
          >
            x{wager}
          </div>
        </div>
        <div
          className={classNames(styles.bonus, {
            [styles.bonusActive]: bonus,
          })}
        >
          +{bonus}
        </div>
        <div className={styles.score}>{score}</div>
      </div>
    </div>
  );
}
