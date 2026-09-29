import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import connectionReducer, { type ConnectionSliceState } from './connectionSlice';
import motionReducer, { type MotionSliceState } from './motionSlice';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    motion: motionReducer,
  },
});

export interface RootState {
  readonly connection: ConnectionSliceState;
  readonly motion: MotionSliceState;
}

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
