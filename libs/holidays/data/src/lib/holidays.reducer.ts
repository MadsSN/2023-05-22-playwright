import {Holiday} from '@eternal/holidays/model';
import {createFeature, createReducer} from '@ngrx/store';
import {addFavourite, load, loaded, removeFavourite,} from './holidays.actions';
import {LoadStatus} from '@eternal/shared/ngrx-utils';
import {immerOn} from 'ngrx-immer/store';
import {safeAssign} from '@eternal/shared/util';

export interface HolidaysState  {
  holidays: Holiday[];
  favouriteIds: number[];
  loadStatus: LoadStatus;
}

const initialState: HolidaysState = {
  holidays: [],
  favouriteIds: [],
  loadStatus: 'not loaded',
};

export const holidaysFeature = createFeature({
  name: 'holidays',
  reducer: createReducer<HolidaysState>(
    initialState,
    immerOn(load, (state) => {
      state.loadStatus = 'loading';
    }),
    immerOn(loaded, (state, { holidays }) => {
      safeAssign(state, { loadStatus: 'loaded', holidays });
    }),
    immerOn(addFavourite, (state, { id }) => {
      if (state.favouriteIds.includes(id) === false) {
        state.favouriteIds.push(id);
      }
    }),
    immerOn(removeFavourite, (state, { id }) => {
      const ix = state.favouriteIds.indexOf(id);
      if (ix > -1) {
        state.favouriteIds.splice(ix, 1);
      }
    })
  ),
});
