import { ColumnCalculator } from './ColumnCalculator';
import styles from './RoundCalculator.module.css';
import { RoundState } from './types';

interface RoundCalculatorProps {
  state: RoundState;
  onChange: (reducer: (state: RoundState) => RoundState) => void;
}

export function RoundCalculator({ state, onChange }: RoundCalculatorProps) {
  return (
    <div className={styles.roundCalculator}>
      <div className={styles.columns}>
        <ColumnCalculator
          suit="purple"
          color="#8848f0"
          state={state}
          onChange={onChange}
        />
        <ColumnCalculator
          suit="red"
          color="#d11111"
          state={state}
          onChange={onChange}
        />
        <ColumnCalculator
          suit="green"
          color="#00964e"
          state={state}
          onChange={onChange}
        />
        <ColumnCalculator
          suit="blue"
          color="#3196f5"
          state={state}
          onChange={onChange}
        />
        <ColumnCalculator
          suit="white"
          color="#efe9f5"
          state={state}
          onChange={onChange}
        />
        <ColumnCalculator
          suit="yellow"
          color="#ffdb0f"
          state={state}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
