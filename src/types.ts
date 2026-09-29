export type LocationKey = 'lisbon' | 'kyoto' | 'vancouver';

export interface LocationInfo {
  readonly city: string;
  readonly country: string;
  readonly note: string;
}

export const LOCATIONS: Readonly<Record<LocationKey, LocationInfo>> = {
  lisbon: {
    city: 'Lisbon',
    country: 'Portugal',
    note: 'A slower morning. A little more room.',
  },
  kyoto: {
    city: 'Kyoto',
    country: 'Japan',
    note: 'A different time zone. The same familiar feeling.',
  },
  vancouver: {
    city: 'Vancouver',
    country: 'Canada',
    note: 'City days. Somewhere wild just beyond.',
  },
};

export function isLocationKey(key: unknown): key is LocationKey {
  return typeof key === 'string' && Object.prototype.hasOwnProperty.call(LOCATIONS, key);
}

export type ConnectionState = 'idle' | 'connecting' | 'connected';

export interface ConnectionCopy {
  readonly label: string;
  readonly status: string;
  readonly detail: string;
}

export const CONNECTION_COPY: Readonly<Record<ConnectionState, ConnectionCopy>> = {
  idle: {
    label: 'Connect',
    status: 'Ready to explore',
    detail: 'Your next destination is one tap away.',
  },
  connecting: {
    label: 'Cancel',
    status: 'Finding your Wayline…',
    detail: 'A new place. The same familiar feeling.',
  },
  connected: {
    label: 'Disconnect',
    status: "You're connected",
    detail: 'A little peace of mind. Wherever you are.',
  },
};

export type ContextKey = 'home' | 'travel' | 'wifi';

export interface ContextContent {
  readonly title: string;
  readonly copy: string;
  readonly location: string;
}

export const CONTEXTS: Readonly<Record<ContextKey, ContextContent>> = {
  home: {
    title: 'Your own little corner.',
    copy: 'A quieter connection for the things you do every day.',
    location: 'Lisbon, Portugal',
  },
  travel: {
    title: 'New place. Same peace of mind.',
    copy: 'A familiar connection, from departure lounge to check-in.',
    location: 'Kyoto, Japan',
  },
  wifi: {
    title: 'Coffee first. Worries later.',
    copy: 'A little more care when the network is not your own.',
    location: 'Vancouver, Canada',
  },
};

export function isContextKey(key: unknown): key is ContextKey {
  return typeof key === 'string' && Object.prototype.hasOwnProperty.call(CONTEXTS, key);
}

export type DialogId = 'demo-dialog' | 'guide-wifi-dialog' | 'guide-vpn-dialog';
