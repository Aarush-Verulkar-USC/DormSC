export default function PrivacyPolicy() {
  return (
    <div className="container-main py-14 max-w-3xl animate-fade-in">
      <h1 className="text-2xl font-semibold text-ink mb-2">Legal</h1>
      <p className="text-sm text-muted mb-10">Last updated: June 2026</p>

      <div className="space-y-12">

        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">Privacy Policy</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>When you create an account, we collect your name, email address, and a hashed password. When you post a listing, we collect the listing details you provide. We do not collect payment information.</p>
            <p>We use your information solely to operate DormSC. We do not sell your personal data to third parties.</p>
            <p>Your data is stored on MongoDB Atlas servers in the United States. DormSC uses OpenAI's API to power the housing assistant — listing queries are processed by OpenAI. We retain your data for as long as your account is active. You may request deletion by contacting us.</p>
            <p>We use a single HTTP-only authentication cookie to keep you signed in. We do not use tracking or advertising cookies.</p>
          </div>
        </section>

        <div className="border-t border-line" />

        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">Terms of Service</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>By using DormSC, you agree to these terms. DormSC is intended for USC students, alumni, and affiliated landlords. You must be at least 18 years old to create an account.</p>
            <p>Users who post listings represent that they have the legal right to advertise the property. Listings must be accurate and not misleading. DormSC is not a party to any rental agreement and takes no responsibility for the accuracy of listing content.</p>
            <p>You may not post fraudulent listings, harass other users, scrape data from the platform, or violate any applicable law.</p>
            <p>DormSC is provided "as is." To the fullest extent permitted by law, DormSC and its operators shall not be liable for any indirect or consequential damages arising from your use of the platform.</p>
          </div>
        </section>

        <div className="border-t border-line" />

        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">Cookie Policy</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>DormSC uses a single strictly necessary cookie to manage your session. It is HTTP-only, set when you sign in, and expires after 7 days. No personal data is stored in the cookie itself.</p>
            <p>We do not use advertising, tracking, or analytics cookies. Disabling the session cookie will prevent you from signing in.</p>
          </div>
        </section>

        <div className="border-t border-line" />

        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">Contact</h2>
          <p className="text-sm text-muted">
            For any questions about these policies, contact us at{' '}
            <a href="https://aarushverulkar.dev" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-ink transition-colors">
              aarushverulkar.dev
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
