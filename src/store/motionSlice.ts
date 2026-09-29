import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MotionSliceState {
  motionPaused: boolean;
  explicitChoice: boolean;
}

const dataSaving = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
const initialPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches || dataSaving;

const initialState: MotionSliceState = {
  motionPaused: initialPaused,
  explicitChoice: false,
};

export const motionSlice = createSlice({
  name: 'motion',
  initialState,
  reducers: {
    toggleMotion: (state) => {
      state.explicitChoice = true;
      state.motionPaused = !state.motionPaused;
    },
    systemReducedMotionChanged: (state, action: PayloadAction<boolean>) => {
      const reduced = action.payload;
      if (reduced) {
        state.motionPaused = true;
      } else if (!state.explicitChoice) {
        state.motionPaused = dataSaving;
      }
    },
  },
});

export const { toggleMotion, systemReducedMotionChanged } = motionSlice.actions;

export default motionSlice.reducer;
