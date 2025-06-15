import api from './api';

export interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  isUp: boolean;
  isDown: boolean;
}

export interface ChartData {
  date: string;
  price: number;
  volume: number;
}

export interface StockPriceResponse {
  code: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
  isUp: boolean;
  isDown: boolean;
}

export interface ChartDataResponse {
  code: string;
  data: Array<{
    date: string;
    price: string;
    volume: string;
  }>;
}

export const stockService = {
  getStockPrice: async (stockCode: string): Promise<StockData> => {
    const response = await api.get<StockPriceResponse>(`/api/stock/price/${stockCode}`);
    const data = response.data;
    
    return {
      code: data.code,
      name: data.name,
      price: parseInt(data.price.replace(/,/g, '')),
      change: parseInt(data.change.replace(/,/g, '')),
      changePercent: parseFloat(data.changePercent),
      volume: parseInt(data.volume.replace(/,/g, '')),
      isUp: data.isUp,
      isDown: data.isDown
    };
  },

  getStockChartData: async (stockCode: string, days: number = 7): Promise<ChartData[]> => {
    const response = await api.get<ChartDataResponse>(`/api/stock/chart/${stockCode}?days=${days}`);
    
    return response.data.data.map(item => ({
      date: item.date,
      price: parseInt(item.price.replace(/,/g, '')),
      volume: parseInt(item.volume.replace(/,/g, ''))
    }));
  }
};