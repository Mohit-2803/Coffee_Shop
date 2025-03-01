/* eslint-disable react/no-unescaped-entities */

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white">
            Terms and Conditions
          </h1>
          <p className="text-lg text-white mt-2">Last Updated: [22/02/2025]</p>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="container my-10 p-8 bg-white rounded-lg shadow-md px-60">
        <p className="mb-6 text-gray-700">
          Welcome to ShopEase! These Terms and Conditions ("Terms") govern your
          access to and use of our website and services provided by ShopEase
          Inc. ("ShopEase", "we", "us", or "our"). By accessing or using our
          website, you agree to these Terms in full. If you do not agree with
          any part of these Terms, please do not use our services.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            1. Introduction
          </h2>
          <p className="text-gray-700">
            ShopEase is an online marketplace for buying and selling clothing
            and electronics. Our platform is built using the MERN stack,
            utilizes an MS SQL database, and uses Firebase for our
            authentication system. Whether you are here as a buyer or as a
            seller (by creating a seller account), your use of our website is
            subject to these Terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            2. Acceptance of Terms
          </h2>
          <p className="text-gray-700">
            By using ShopEase, you agree to be bound by these Terms and any
            future amendments posted on our website. Your continued use of our
            site confirms your acceptance of the Terms in effect at the time of
            your access.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            3. Eligibility
          </h2>
          <p className="text-gray-700">
            You must be at least 18 years old to register and use ShopEase. By
            accessing our services, you represent that you are at least 18 years
            old and are legally capable of entering into binding contracts.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            4. Account Registration and Security
          </h2>
          <p className="text-gray-700">
            To enjoy the full range of features on ShopEase—including creating a
            seller account—you must register for an account. We use Firebase as
            our authentication system to securely manage your credentials. You
            agree to provide accurate, current, and complete information during
            the registration process and to update such information promptly if
            it changes.
          </p>
          <p className="mt-4 text-gray-700">
            You are responsible for maintaining the confidentiality of your
            account details, including your password, and for all activities
            that occur under your account. Notify us immediately if you suspect
            any unauthorized access or breach of security.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            5. Seller Accounts and Obligations
          </h2>
          <p className="text-gray-700">
            If you wish to sell products on ShopEase, you must register for a
            seller account and comply with the following obligations:
          </p>
          <ul className="list-disc ml-8 mt-4 text-gray-700">
            <li>
              Provide accurate and detailed product listings, including images,
              descriptions, pricing, and any other relevant information.
            </li>
            <li>
              Ensure that all products comply with applicable laws, regulations,
              and ShopEase policies.
            </li>
            <li>
              Maintain appropriate inventory levels and fulfill orders promptly.
            </li>
            <li>
              Communicate professionally with buyers and resolve any issues that
              may arise.
            </li>
            <li>
              Regularly review and comply with any updated seller guidelines
              provided by ShopEase.
            </li>
          </ul>
          <p className="mt-4 text-gray-700">
            ShopEase reserves the right to suspend or terminate any seller
            account if these Terms or our policies are violated.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            6. Product Listings and Descriptions
          </h2>
          <p className="text-gray-700">
            While we strive for accuracy, ShopEase does not guarantee that
            product listings are error-free. All product information is provided
            by sellers, and buyers are encouraged to verify details before
            making a purchase.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            7. Orders and Payments
          </h2>
          <p className="text-gray-700">
            By placing an order on ShopEase, you agree to pay the price listed
            for the product, plus any applicable taxes, shipping, and handling
            fees. We use secure payment gateways to process transactions, and
            all orders are subject to verification and acceptance by the seller.
          </p>
          <p className="mt-4 text-gray-700">
            Any payment disputes should first be resolved between the buyer and
            the seller. ShopEase may assist in mediating such disputes where
            necessary.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            8. Shipping and Delivery
          </h2>
          <p className="text-gray-700">
            Shipping, delivery, and handling policies vary by seller and
            product. It is your responsibility to review these details before
            finalizing your order. ShopEase is not liable for delays, damages,
            or losses during shipping.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            9. Returns and Refunds
          </h2>
          <p className="text-gray-700">
            Returns and refunds are managed according to individual seller
            policies and applicable consumer protection laws. We encourage
            buyers to carefully review the return policies provided by sellers
            prior to purchasing.
          </p>
          <p className="mt-4 text-gray-700">
            In the event of a dispute regarding a return or refund, ShopEase may
            intervene to facilitate a resolution between the buyer and seller.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            10. User Conduct
          </h2>
          <p className="text-gray-700">
            You agree to use ShopEase only for lawful purposes. Prohibited
            activities include, but are not limited to:
          </p>
          <ul className="list-disc ml-8 mt-4 text-gray-700">
            <li>
              Posting any content that is unlawful, harmful, defamatory, or
              otherwise objectionable.
            </li>
            <li>Engaging in fraudulent or deceptive practices.</li>
            <li>
              Interfering with the functionality or security of our website.
            </li>
            <li>
              Violating any local, state, national, or international laws or
              regulations.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            11. Intellectual Property Rights
          </h2>
          <p className="text-gray-700">
            All content on ShopEase—including text, graphics, logos, images, and
            software—is the property of ShopEase or its licensors and is
            protected by intellectual property laws. You may not reproduce,
            modify, distribute, or display any content without our prior written
            consent.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            12. User-Generated Content
          </h2>
          <p className="text-gray-700">
            ShopEase may allow you to submit reviews, comments, or other
            content. By posting such content, you grant ShopEase a
            non-exclusive, worldwide, royalty-free license to use, reproduce,
            modify, and distribute your content. You are solely responsible for
            the content you submit.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            13. Third-Party Links
          </h2>
          <p className="text-gray-700">
            Our website may contain links to third-party websites. These links
            are provided for your convenience only. ShopEase does not endorse,
            control, or assume responsibility for the content or practices of
            these third-party sites.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            14. Disclaimer of Warranties
          </h2>
          <p className="text-gray-700">
            ShopEase and its services are provided "as is" and "as available"
            without any warranties, express or implied. We do not warrant that
            our website will be uninterrupted, error-free, or secure, and you
            use the site at your own risk.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            15. Limitation of Liability
          </h2>
          <p className="text-gray-700">
            In no event shall ShopEase, its directors, employees, or affiliates
            be liable for any indirect, incidental, special, or consequential
            damages arising out of your use of the website or any products
            purchased through the site—even if advised of the possibility of
            such damages.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            16. Indemnification
          </h2>
          <p className="text-gray-700">
            You agree to indemnify, defend, and hold harmless ShopEase and its
            affiliates from any claims, damages, obligations, losses,
            liabilities, or expenses (including reasonable attorneys’ fees)
            arising from:
          </p>
          <ul className="list-disc ml-8 mt-4 text-gray-700">
            <li>Your use of the website or services;</li>
            <li>Your violation of these Terms;</li>
            <li>
              Your infringement or misappropriation of any third party’s
              intellectual property or other rights.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            17. Changes to the Terms
          </h2>
          <p className="text-gray-700">
            ShopEase reserves the right to modify or update these Terms at any
            time. Any changes will become effective immediately upon being
            posted on our website. Your continued use of our site following the
            posting of changes constitutes your acceptance of such changes.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            18. Termination
          </h2>
          <p className="text-gray-700">
            We may terminate or suspend your account and access to ShopEase at
            any time and for any reason without prior notice, especially if you
            breach any of these Terms or engage in conduct that harms our users
            or business interests.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            19. Governing Law and Jurisdiction
          </h2>
          <p className="text-gray-700">
            These Terms are governed by and construed in accordance with the
            laws of the jurisdiction in which ShopEase operates, without regard
            to its conflict of law provisions. By using our website, you agree
            to submit to the exclusive jurisdiction of the courts in that
            region.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            20. Dispute Resolution
          </h2>
          <p className="text-gray-700">
            Any disputes arising out of or relating to these Terms or your use
            of ShopEase shall first be attempted to be resolved informally. If
            an informal resolution is not achieved, you agree that the dispute
            will be resolved by binding arbitration in accordance with the rules
            of the appropriate arbitration forum.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            21. Privacy Policy
          </h2>
          <p className="text-gray-700">
            Your privacy is important to us. Please review our Privacy Policy,
            which explains how we collect, use, and protect your personal data.
            By using our website, you consent to our practices as described in
            the Privacy Policy.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            22. Technology and Data Security
          </h2>
          <p className="text-gray-700">
            ShopEase is built on the MERN stack with an MS SQL database, and we
            use Firebase for our authentication system. While we implement
            robust security measures to protect your data, no system is entirely
            immune to breaches. You agree to use our site with the understanding
            that we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            23. Feedback and Suggestions
          </h2>
          <p className="text-gray-700">
            Any feedback, ideas, or suggestions you submit regarding ShopEase
            are non-confidential and become our property. You agree that we are
            free to use such feedback for any purpose without any obligation to
            you.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            24. Entire Agreement
          </h2>
          <p className="text-gray-700">
            These Terms, along with our Privacy Policy and any additional
            guidelines posted on ShopEase, constitute the entire agreement
            between you and ShopEase regarding your use of the site and
            services, superseding any prior agreements.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            25. Severability
          </h2>
          <p className="text-gray-700">
            If any provision of these Terms is held to be invalid or
            unenforceable, the remaining provisions will remain in full force
            and effect.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            26. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions or concerns about these Terms, please
            contact us at:
          </p>
          <p className="mt-4 text-gray-700">
            Email:{" "}
            <a
              href="mailto:support@shopease.com"
              className="text-blue-500 hover:underline"
            >
              support@shopease.com
            </a>
          </p>
          <p className="text-gray-700">
            Address: 1234 ShopEase Avenue, Suite 100, City, State, ZIP Code
          </p>
        </section>

        <p className="mt-10 text-center text-gray-600">
          By using ShopEase, you acknowledge that you have read, understood, and
          agree to be bound by these Terms and Conditions.
        </p>
      </main>
    </div>
  );
};

export default TermsPage;
