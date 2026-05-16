import useCountUp from './useCountUp';

export { default } from './useCountUp';

export function CountUp({ end, decimals = 0 }) {
  const value = useCountUp(end, 2000, decimals);
  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value);
}
