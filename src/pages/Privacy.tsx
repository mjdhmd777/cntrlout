import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background py-16">
        <div className="container max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, including your name, email address, 
              professional details, and portfolio information during registration and profile creation.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              Your information is used to operate and improve the platform, verify your identity, 
              facilitate connections between users, and communicate important updates about your account.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. Profile information you choose to make public 
              will be visible to other platform users. We may share information with service providers 
              who help operate our platform.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure, and we cannot 
              guarantee absolute security.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">5. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal information. 
              You may also request a copy of your data or ask us to restrict processing in 
              certain circumstances.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">6. Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to maintain your session, remember your 
              preferences, and analyze platform usage. You can control cookie settings through 
              your browser.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the date above.
            </p>

            <h2 className="mt-8 text-2xl font-semibold text-foreground">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@cntrlout.com" className="text-primary hover:underline">
                privacy@cntrlout.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
