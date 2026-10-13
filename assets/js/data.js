"use strict";
// Central, editable service catalogue and pricing configuration.
globalThis.CN = {
  prices: [2499, 3499, 4499, 5999, null],
  sizes: ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"],
  types: [
    { id: "move-in", name: "Move-In Cleaning", extra: 0 },
    { id: "move-out", name: "Move-Out Cleaning", extra: 500 },
    { id: "deep", name: "Full Home Deep Cleaning", extra: 250 },
  ],
  packages: [
    {
      id: "essential",
      name: "Essential Clean",
      extra: 0,
      detail:
        "Accessible surfaces, standard bathroom care, kitchen exteriors and floors.",
      hours: 0,
    },
    {
      id: "complete",
      name: "Complete Deep Clean",
      extra: 1000,
      detail:
        "Essential scope plus accessible baseboards, detailed fittings and interior window sills.",
      hours: 1,
    },
    {
      id: "intensive",
      name: "Intensive Move-Out Clean",
      extra: 2000,
      detail:
        "Complete scope with extra time for accessible buildup and handover preparation.",
      hours: 2,
    },
  ],
  addons: [
    { id: "oven", name: "Oven interior", price: 599 },
    { id: "fridge", name: "Refrigerator interior", price: 699 },
    { id: "windows", name: "Interior windows", price: 499 },
    { id: "cabinets", name: "Cabinet interiors", price: 799 },
    { id: "balcony", name: "Balcony / utility area", price: 499 },
    { id: "extra-care", name: "Additional deep-cleaning time", price: 999 },
  ],
  // Illustrative zones only; replace with operator-approved coverage before launch.
  coverage: [
    {
      code: "10001",
      name: "Manhattan",
      note: "Illustrative New York coverage entry.",
    },
    {
      code: "11201",
      name: "Brooklyn",
      note: "Illustrative New York coverage entry.",
    },
    {
      code: "11101",
      name: "Queens",
      note: "Illustrative New York coverage entry.",
    },
  ],
  services: [
    [
      "move-in",
      "Move-In Deep Cleaning",
      "Prepare an empty or accessible home before you unpack.",
      "Kitchen and bathroom surfaces|Dust removal|Floors and accessible edges",
      "Standard package",
    ],
    [
      "move-out",
      "Move-Out Deep Cleaning",
      "A considered clean to help prepare your home for handover.",
      "Agreed room checklist|Accessible fittings|Final scope review",
      "Standard package",
    ],
    [
      "kitchen",
      "Kitchen Deep Cleaning",
      "Detailed care for the surfaces you cook and gather around.",
      "Countertops|Sink and taps|Cabinet and appliance exteriors",
      "Standard inclusion",
    ],
    [
      "bathroom",
      "Bathroom Deep Cleaning",
      "Work through everyday touchpoints and accessible wet-area surfaces.",
      "Toilet and basin|Shower surfaces|Mirrors and floors",
      "Standard inclusion",
    ],
    [
      "bedroom",
      "Bedroom Deep Cleaning",
      "Give resting spaces a fresh, orderly start.",
      "Accessible dusting|Window sills|Wardrobe exteriors",
      "Standard inclusion",
    ],
    [
      "living",
      "Living Room Cleaning",
      "A room-by-room reset for shared living spaces.",
      "Dusting|Doors and switch plates|Accessible floor edges",
      "Standard inclusion",
    ],
    [
      "floors",
      "Floor Scrubbing & Mopping",
      "Choose appropriate care for the flooring and its condition.",
      "Loose dust|Material-aware mopping|Accessible corners",
      "Scrubbing quoted separately",
    ],
    [
      "windows",
      "Interior Window Cleaning",
      "Care for safely accessible interior glass and window surfaces.",
      "Accessible interior glass|Sills|Frame wipe-down",
      "Optional add-on",
    ],
    [
      "cabinets",
      "Cabinet & Cupboard Cleaning",
      "Clear accessible interiors before storage and unpacking.",
      "Empty cabinet interiors|Accessible shelves|Exteriors",
      "Interior care is an add-on",
    ],
    [
      "appliance-exterior",
      "Appliance Exterior Cleaning",
      "Wipe down safely accessible appliance surfaces.",
      "Exterior doors|Handles|Accessible control surfaces",
      "Standard inclusion",
    ],
    [
      "appliance-interior",
      "Interior Appliance Cleaning",
      "Discuss oven and refrigerator interiors as additional tasks.",
      "Oven interior|Fridge shelves|Agreed removable parts",
      "Optional add-on",
    ],
    [
      "balcony",
      "Balcony & Utility Area Cleaning",
      "Extend the agreed scope to additional home areas.",
      "Accessible floors|Dust removal|Surface wipe-down",
      "Optional add-on",
    ],
    [
      "dust",
      "Dust & Cobweb Removal",
      "Remove dust and cobwebs within safe accessible reach.",
      "Accessible corners|Reachable fittings|Room surfaces",
      "Standard inclusion",
    ],
    [
      "post-move",
      "Post-Move Surface Cleaning",
      "Reset reachable surfaces after boxes and belongings are moved.",
      "Accessible dusting|Surface cleaning|Floor reset",
      "Scope agreed before booking",
    ],
    [
      "addons",
      "Optional Add-On Cleaning",
      "Tailor the appointment to the spaces that need more time.",
      "Interior appliances|Extra bathrooms|Additional areas",
      "Quoted separately",
    ],
  ],
  rooms: {
    Kitchen: [
      "Countertops",
      "Cabinet exteriors",
      "Sink and fixtures",
      "Stove surface",
      "Appliance exteriors",
      "Floors",
      "Accessible corners",
    ],
    Bathrooms: [
      "Toilets",
      "Sinks",
      "Showers",
      "Bathtubs",
      "Mirrors",
      "Accessible tiles",
      "Fixtures",
      "Floors",
    ],
    Bedrooms: [
      "Accessible surfaces",
      "Window sills",
      "Wardrobe exteriors",
      "Baseboards",
      "Floors",
    ],
    "Living areas": [
      "Dusting",
      "Doors",
      "Switch plates",
      "Window sills",
      "Baseboards",
      "Floors",
    ],
    "Additional areas": [
      "Hallways",
      "Entryways",
      "Staircases",
      "Balconies",
      "Utility spaces",
    ],
  },
  posts: [
    [
      "move-out-checklist",
      "Move-Out Cleaning Checklist for Renters",
      "Moving out",
      "Prepare room by room, from kitchen surfaces to the final handover.",
      "kitchen",
      5,
    ],
    [
      "before-moving-in",
      "How to Prepare a Home Before Moving In",
      "Moving in",
      "Plan access, storage and a cleaning window before the boxes arrive.",
      "living-room",
      4,
    ],
    [
      "deep-vs-regular",
      "Deep Cleaning vs Regular Cleaning",
      "Cleaning care",
      "Understand the difference between routine upkeep and a detailed reset.",
      "bathroom",
      5,
    ],
    [
      "kitchen-handover",
      "Kitchen Cleaning Before a Property Handover",
      "Cleaning care",
      "Build a sensible checklist for surfaces, fixtures and appliance scope.",
      "kitchen-detail",
      4,
    ],
    [
      "bathroom-care",
      "Bathroom Deep Cleaning Tips",
      "Cleaning care",
      "Discuss materials and buildup before deciding on the cleaning approach.",
      "bathroom",
      4,
    ],
    [
      "cleaning-costs",
      "What Affects Move-Out Cleaning Costs?",
      "Planning",
      "Size, property condition, bathrooms and access all shape the estimate.",
      "bright-home",
      6,
    ],
    [
      "prepare-for-cleaners",
      "How to Prepare for Professional Cleaners",
      "Planning",
      "Clear accessible surfaces and share details that help the appointment.",
      "bedroom",
      4,
    ],
    [
      "empty-apartment",
      "Cleaning an Empty Apartment",
      "Moving in",
      "Make the most of easier access before furniture moves in.",
      "bright-home",
      4,
    ],
    [
      "missed-areas",
      "Commonly Missed Cleaning Areas",
      "Cleaning care",
      "Remember window sills, door edges, handles and reachable corners.",
      "kitchen",
      5,
    ],
    [
      "moving-day",
      "Moving-Day Cleaning Tips",
      "Moving out",
      "Separate the cleaning plan from the packing plan to reduce last-minute work.",
      "living-room",
      4,
    ],
  ],
  calculate(selection) {
    const size = Number(selection.size);
    if (!Number.isInteger(size) || size < 0 || size > 4)
      throw new Error("Invalid property size");
    const base = this.prices[size];
    if (base === null) return null;
    const type =
      this.types.find((item) => item.id === selection.type) || this.types[0];
    const pack =
      this.packages.find((item) => item.id === selection.package) ||
      this.packages[0];
    const extras = [...new Set(selection.addons || [])].reduce(
      (sum, id) =>
        sum + (this.addons.find((item) => item.id === id)?.price || 0),
      0,
    );
    const bathrooms = Number(selection.bathrooms || 1);
    return (
      base + type.extra + pack.extra + extras + Math.max(0, bathrooms - 1) * 499
    );
  },
  money(amount) {
    return amount === null
      ? "Quote after assessment"
      : `₹${Number(amount).toLocaleString("en-IN")}`;
  },
  hours(selection) {
    if (Number(selection.size) === 4)
      return "Assessed with your property details";
    const extra =
      (this.packages.find((item) => item.id === selection.package)?.hours ||
        0) + Math.ceil((selection.addons || []).length / 2);
    const start = 3 + Number(selection.size) + extra;
    return `${start}–${start + 1} hours (indicative)`;
  },
};

