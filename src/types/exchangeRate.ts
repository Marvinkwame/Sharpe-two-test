export interface ExchangeRate {
  base: string;
  date: string;
  rates: {
    [currency: string]: number;
  };
}