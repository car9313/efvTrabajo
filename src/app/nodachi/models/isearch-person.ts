import {SearchSources} from './search-sources.enum';

export interface ISearchConfig {
  search: SearchSources;
  filter?: Array<{ key: string, value: any }>;
}
