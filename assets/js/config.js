/* Next.Education site configuration — the ONE file to edit for money, forms and contests.
   Nothing in here prints a contact address on the page. */
window.NE_CONFIG = {
  siteName: "Next.Education",
  siteUrl: "https://next.education",
  businessContactUrl: "https://web.works/contact",

  /* Google AdSense — Auto ads run from the <head> snippet on every page.
     Optional manual units: paste slot IDs from AdSense > Ads > By ad unit.
     Empty slot = nothing renders (no empty "Advertisement" boxes before approval). */
  adsense: {
    client: "ca-pub-6620975821265271",
    slots: {
      inArticle: "",   // e.g. "1234567890"  (In-article unit)
      display: "",     // e.g. "2345678901"  (Display, responsive)
      multiplex: ""    // e.g. "3456789012"  (Multiplex)
    }
  },

  /* Form delivery (FormSubmit AJAX). The inbox is stored encoded and is never rendered.
     After the first live submission, FormSubmit emails an activation link — click it once.
     FormSubmit then shows a random alias string; paste it into formAlias to stop using the encoded inbox at all. */
  forms: {
    formAlias: "",
    inbox: "=02bj5CbpFWbnBUMhN3ay92diV2d"
  },

  /* Donations — paste any payment links you open. Empty = that button is hidden.
     Pledges always work (they arrive by the form channel and you follow up with a payment link). */
  payments: {
    stripeOneTime: "",     // Stripe Payment Link (one-time, customer chooses amount)
    stripeMonthly: "",     // Stripe Payment Link (subscription)
    paypalHostedButtonId: "", // PayPal hosted button ID (NOT an email)
    buyMeACoffee: "",      // full URL
    kofi: "",              // full URL
    githubSponsors: ""     // full URL
  },

  /* Funding goal shown on the Support page (edit as donations arrive). */
  funding: { goal: 25000, raised: 0, currency: "USD", supporters: 0 },

  /* Contests — edit prizes and dates in one place; pages read from here. */
  contests: {
    essay: {
      name: "The Next Step Essay Prize",
      season: "Season 1",
      opens: "2026-12-01",
      closes: "2027-02-28T23:59:00-05:00",
      winnersBy: "2027-04-15",
      prizes: [
        { place: "Grand prize", amount: 500 },
        { place: "Runner-up", amount: 250 },
        { place: "Third place", amount: 100 }
      ],
      currency: "USD"
    },
    monthly: {
      name: "Next Step Monthly Award",
      amount: 250,
      currency: "USD"
    }
  }
};
