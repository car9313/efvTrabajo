export interface ChartItem {

  titulo?: string;
  graficos?: Array<{
    titulo?: string,
    ejeX?: { data: Array<{ id: number, label: string } | string>, label: string },
    ejeY?: Array<{ data: Array<any>, label: string }>,
    chartOptions?: any,
    chartColors?: Array<any>,
    chartType?: string,
    options?: {stacked?: boolean},
  }>;
}

export class LabelChart {
  constructor(public id: number = null, public label: string = '') {
  }

  public toString = (): string => {
    return this.label;
  }
}
