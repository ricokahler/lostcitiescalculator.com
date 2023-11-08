import { Fragment, useId } from 'react';
import styles from './SegmentedControl.module.css';
import { adjustHue, transparentize } from 'color2k';

interface SegmentedControlProps {
  segments: string[];
  value: string;
  onChange: (value: string) => void;
  color: string;
}

export function SegmentedControl({
  segments,
  value,
  onChange,
  color,
}: SegmentedControlProps) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      onChange(e.currentTarget.value);
    }
  };

  const index = segments.findIndex((segment) => segment === value);
  const width = `calc(${(100 / segments.length).toFixed(3)}% + 2px)`;

  return (
    <div
      className={styles.segmentedControl}
      style={{
        // @ts-expect-error types are wrong
        '--segmented-control-primary': color,
        '--segmented-control-hue-shift': adjustHue(color, 30),
        '--segmented-control-hint': transparentize(color, 0.3),
        '--segmented-control-text-active': 'white',
        '--segmented-control-text-inactive': transparentize(color, 0.3),
      }}
    >
      <div
        className={styles.floater}
        style={{
          transform: `translate(${(index * 100).toFixed(2)}%, 0)`,
          width,
        }}
      />
      {segments.map((segment) => (
        <Fragment key={segment}>
          <input
            className={styles.input}
            type="radio"
            id={`${id}-${segment}`}
            name={id}
            value={segment}
            checked={value === segment}
            onChange={handleChange}
          />
          <label
            htmlFor={`${id}-${segment}`}
            className={styles.label}
            style={{ width }}
          >
            {segment}
          </label>
        </Fragment>
      ))}
    </div>
  );
}
