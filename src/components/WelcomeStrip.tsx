export function WelcomeStrip(): JSX.Element {
  return (
    <section className="welcome-strip shell" aria-label="A private connection for everyday life">
      <p>
        A private connection.
        <br />
        <span>A wider world.</span>
      </p>
      <div className="welcome-places">
        <span>At home</span>
        <span>On the move</span>
        <span>On public Wi-Fi</span>
      </div>
    </section>
  );
}
