import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type LocationKey, type ConnectionState, LOCATIONS } from '../types';

export interface ConnectionSliceState {
  selectedLocation: LocationKey;
  connectionState: ConnectionState;
  announcement: string;
}

const initialState: ConnectionSliceState = {
  selectedLocation: 'lisbon',
  connectionState: 'idle',
  announcement: '',
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    selectLocation: (state, action: PayloadAction<{ location: LocationKey; announce?: boolean }>) => {
      const { location, announce = true } = action.payload;
      state.selectedLocation = location;
      state.connectionState = 'idle';
      if (announce) {
        const info = LOCATIONS[location];
        state.announcement = `Destination selected: ${info.city}, ${info.country}. Ready to explore.`;
      }
    },
    setConnectionState: (
      state,
      action: PayloadAction<{ state: ConnectionState; announcement?: string }>
    ) => {
      state.connectionState = action.payload.state;
      if (action.payload.announcement !== undefined) {
        state.announcement = action.payload.announcement;
      }
    },
  },
});

export const { selectLocation, setConnectionState } = connectionSlice.actions;

export default connectionSlice.reducer;
