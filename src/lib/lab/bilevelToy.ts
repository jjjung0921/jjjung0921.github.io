export interface BilevelToyState {
  lambda: number;
  lowerOptimum: number;
  upperObjective: number;
}

export function evaluateBilevelToy(lambda: number): BilevelToyState {
  const lowerOptimum = lambda * 10;
  const upperObjective = -lowerOptimum + 0.5 * (lambda * 5) ** 2;

  return {
    lambda,
    lowerOptimum,
    upperObjective,
  };
}
