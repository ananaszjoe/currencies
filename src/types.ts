export interface CurrencyData {
  [key: string]: string;
}

export type Currency = {
  code: string,
  name: string
};

export type RateData = {
  amount: number,
  base: string,
  start_date: string,
  end_date: string,
  rates: {
    [key: string]: {
      [key: string]: number;
    };
  },
}

export type Rate = {
  date: string,
  value: number
}