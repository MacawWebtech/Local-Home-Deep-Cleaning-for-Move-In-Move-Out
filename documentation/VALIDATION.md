# Validation record

## Checks performed
- All 18 pages parsed and their scripts executed without runtime errors in a DOM test environment.
- Theme, RTL and hamburger menu events verified on every page.
- All local navigation links, image references, scripts, styles and background image paths resolved.
- Unique element IDs, one main landmark and one main heading checked on every page.
- Every photograph has an alt description; all JPG files decode.
- All designed CSS color values are Black, Orange or Milk. Hexadecimal letter case does not change color values.
- Old starburst glyph removed, with the home-outline icon and favicon used consistently.
- Customer-facing text checked for unwanted development words.
- Service search, pricing type/size changes and four-plus-bedroom quote state checked.
- Listed and not-listed postal code states checked.
- Checklist tabs and optional-task persistence checked.
- Gallery filtering and comparison-slider values checked.
- Blog pagination and topic filters checked.
- Full eight-stage booking tested through creation of a local request and an exact calculated estimate.
- Saved request appeared in the dashboard; user-provided angle brackets rendered as text, rather than HTML.
- Local schedule changes, cancellation, address create/edit/remove and profile saving checked.
- No profile password field is stored.
- JavaScript syntax checked for all eight source files; HTML/CSS/JS formatted into readable lines.
- ZIP integrity and extracted path structure verified during packaging.

## Limits
These DOM and file checks do not measure rendered element sizes. Browser visual checks at 375, 430, 768, 1024, 1280, 1440 and 1920px, cross-browser checks, Lighthouse scores, animation rendering, external map loading and real service integrations were not available in this environment. No claim is made that these unperformed checks passed.

The final project remains a static website with locally stored requests and profiles. Real authentication, availability, bookings, payments, messages and automated notifications require connected services.

## Background and responsive alignment correction
Heading backgrounds now use direct inline `background-image` declarations, avoiding relative URL interpretation through a CSS custom property in another stylesheet. Image paths resolve from each page. Full-image darkening is reduced; a separate translucent Black text backing keeps headings readable. Service and pricing cards share actual text-row heights through subgrid with existing flex fallbacks. Mobile cards retain natural content height, and image boxes use consistent aspect ratios.

All 11 heading background declarations and the full-project local asset check were rerun. Browser visual measurements remain unperformed.

## Screenshot spacing, checklist and testimonial update
Booking and Service Details now stack the main and supporting areas vertically with no sticky side card. Closed checklist summaries use a shared minimum height and fixed inclusion-badge column; mobile badges move under the task title. Contact and coverage maps show New York City. Home Page 1 and About contain three testimonial slots each with replaceable local profile SVGs; feedback remains clearly awaiting customer-approved content.

The existing page/script and interaction checks were rerun, along with targeted checks for the six profile references and both New York map URLs. Visual height and alignment verification in a browser remains pending.

## Centered service sections and testimonial copy
The Service Details support box is center-aligned. Seven existing information sections now form aligned two-column cards on desktop/tablet and stack on mobile; the original text and links are preserved. About and Home Page 1 show descriptive illustrative feedback using fictional American names and six references to replaceable profile placeholders. Targeted DOM checks verified all seven service cards, preserved links and overview image, the six descriptions/names and the visible illustrative disclosure. Browser visual alignment remains pending.
