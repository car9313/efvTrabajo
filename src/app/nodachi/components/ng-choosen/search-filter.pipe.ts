import {Pipe, PipeTransform} from '@angular/core';
import {IMultiSelectOption} from './ng-choosen-opts';

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter implements PipeTransform {

  private _lastOptions: IMultiSelectOption[];
  private _searchCache: { [k: string]: IMultiSelectOption[] } = {};
  private _searchCacheInclusive: { [k: string]: boolean | number } = {};

  transform(options: Array<IMultiSelectOption>, str: string, limit = 0, renderLimit = 0): Array<IMultiSelectOption> {
    str = (str || '').toLowerCase();

    // Drop cache because options were updated
    if (options !== this._lastOptions) {
      this._lastOptions = options;
      this._searchCache = {};
      this._searchCacheInclusive = {};
    }

    const isUnderLimit = options.length <= limit;

    if (this._searchCache[str]) {
      return isUnderLimit ? this._searchCache[str] : this._limitRenderedItems(this._searchCache[str], renderLimit);
    }

    const prevStr = str.slice(0, -1);
    const prevResults = this._searchCache[prevStr];

    if (prevResults) {
      const prevInclusiveOrIdx = this._searchCacheInclusive[prevStr];

      if (prevInclusiveOrIdx === true) {
        // If have previous results and it was inclusive, do only subsearch
        options = prevResults;
      } else if (typeof prevInclusiveOrIdx === 'number') {
        // Or reuse prev results with unchecked ones
        options = [...prevResults, ...options.slice(prevInclusiveOrIdx)];
      }
    }

    const optsLength = options.length;
    const maxFound = limit > 0 ? Math.min(limit, optsLength) : optsLength;
    const filteredOpts = [];

    const regexp = new RegExp(this._escapeRegExp(str), 'i');

    const matchPredicate = (option: IMultiSelectOption) => regexp.test(option.textField);
    const matchExtraPredicate = (option: IMultiSelectOption) => typeof(option.extra) === 'string' ? regexp.test(option.extra) : false;
    const getChildren = (option: IMultiSelectOption) => options.filter(child => child.parentId === option.valueField);
    const getParent = (option: IMultiSelectOption) => options.find(parent => option.parentId === parent.valueField);

    let i = 0, founded = 0;
    for (; i < optsLength && founded < maxFound; ++i) {
      const option = options[i];
      const directMatch = regexp.test(option.textField) || (typeof(option.extra) === 'string' ? regexp.test(option.extra) : false);

      if (directMatch) {
        filteredOpts.push(option);
        founded++;
        continue;
      }

      if (typeof (option.parentId) === 'undefined') {
        const childrenMatch = getChildren(option).some((option) => {
          return matchPredicate(option) || matchExtraPredicate(option);
        });

        if (childrenMatch) {
          filteredOpts.push(option);
          founded++;
          continue;
        }
      }

      if (typeof (option.parentId) !== 'undefined') {
        const parentMatch = matchPredicate(getParent(option)) || matchExtraPredicate(getParent(option));

        if (parentMatch) {
          filteredOpts.push(option);
          founded++;

        }
      }
    }

    this._searchCache[str] = filteredOpts;
    this._searchCacheInclusive[str] = i === optsLength || i + 1;

    return isUnderLimit ? filteredOpts : this._limitRenderedItems(filteredOpts, renderLimit);
  }

  private _limitRenderedItems<T>(items: T[], limit: number): T[] {
    return items.length > limit && limit > 0 ? items.slice(0, limit) : items;
  }

  private _escapeRegExp(str: string): string {
    return str.replace(/[\-\[\]\/{}()*+?.\\^$|]/g, '\\$&');
  }
}
