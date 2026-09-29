import { useAppSelector } from '../store';

export function Announcement(): JSX.Element {
  const announcement = useAppSelector((state) => state.connection.announcement);

  return (
    <p
      id="connection-announcement"
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </p>
  );
}
