# ClearNest complete website

## 1. Open and install
Extract the ZIP first. Open `index.html` in a browser, or serve the extracted directory with a static server. No build, account, command-line dependency or online font is needed for the local pages. Map embeds need an internet connection.

## 2. Structure
`index.html` is Home 1; `pages/` contains the other 17 pages. Shared assets live in `assets/`, and this folder contains documentation and validation notes. The project uses local Bootstrap 5 grid CSS plus custom brand styles.

## 3. Pages and navigation
Home 1, Home 2, About, Services, Service Details, Booking, Pricing, Service Areas, Checklist, Gallery, Blog, Blog Details, Contact, Login, Register, Dashboard, 404 and Coming Soon. Header dropdowns expose the homepage alternatives and service resources. Footer links expose account pages and the journal. Query strings select a service or article without additional HTML copies.

## 4. Palette
Black `#000000`, Orange `#EC5E27`, Milk `#FDFDF1`. CSS variables in `assets/styles.css` control these colors. Natural photographs and the external map are content, rather than designed interface surfaces. Local Bootstrap grid CSS does not add a theme palette.

## 5. Typography and alignment
System Arial/Helvetica keeps the site usable offline. Headings use weight 600. Paragraphs use regular weight and comfortable line height. Grid and flex layouts stretch cards within the same row; service-card text rows use CSS subgrid where supported, with a flex fallback. Mobile stacks keep natural content height. The FAQ introduction now has relevant preparation content rather than an empty stretched column.

## 6. Photographs
Replace JPGs in `assets/images/` with appropriately licensed photographs, preserving names. Keep useful image dimensions and descriptive alt text. Interior photography is illustrative, not actual customer work. Source: Unsplash image CDN. Do not publish real testimonials or claimed results without permission and supporting content.

## 7. Page backgrounds
Each interior page uses a distinct local JPG path in `assets/images/background/`. The CSS `.page-hero` uses a transparent Black overlay to keep Milk headings readable. Adjust the inline `background-image` declaration in each page to replace it. Relative image URLs are declared directly on the heading section so they resolve from that HTML file. Home 2 uses a dedicated visual-first image. Authentication and dashboard layouts prioritize usable content instead of a large background heading.

## 8. Booking workflow
Eight stages: type → property and bathrooms → package → add-ons → preferred schedule → property/contact details → review → locally saved request. Native date input supplies the accessible calendar. Past dates and invalid contact fields are rejected. Date choices and time windows do not represent live availability. Saving writes a request with status `Awaiting confirmation` to `clearnest-bookings` on this device. It is not sent to an operator.

## 9. Pricing configuration
Edit `assets/js/data.js`: property-size base prices, cleaning-type adjustments, package adjustments and add-ons. Additional bathroom care is ₹499 per bathroom after the first. Four-plus bedrooms require assessment and show no fixed amount. `CN.calculate()` is shared by pricing, booking and the saved request estimate. All prices are indicative INR amounts, not binding quotes. Duration estimates are scope-dependent.

## 10. Coverage configuration
`CN.coverage` contains three explicitly illustrative Chennai entries. Replace these with approved coverage records. The postal-code checker differentiates listed and not-listed states; neither confirms geographic availability. The map is a New York City overview, not a verified office or live coverage boundary.

## 11. Checklists
`CN.rooms` contains category tasks. Package selection changes indicated inclusion scope. Optional tasks persist through `clearnest-selection` into the booking flow. Additional spaces, interior appliances and cabinet interiors are not implied standard inclusions.

## 12. Gallery
Seven filters cover kitchens, bathrooms, living rooms, bedrooms, floors, cabinets and move-out spaces. Range sliders support keyboard and pointer input. The JPG comparison diagrams are precisely labeled illustrative scope drawings, not real customer transformations. Replace each paired image with real photographs of the same space and perspective, with customer permission and an accurate description.

## 13. Dashboard
Overview, booking requests and filtering, local schedule changes/cancellation, status tracking, selected packages, estimate records, address CRUD, notifications/read state, profile/preferences and logout. Later operational status stages remain unconnected. Downloaded request JSON is a request summary, not an invoice. No final invoices or successful payments are fabricated.

## 14. Forms and secure identity
Contact and interest forms store local records and explicitly report that no message has been sent. Login and Register open a local workspace only; they do not authenticate an online account. Registration validates password consistency and discards passwords. Passwords are never written to storage. Do not rely on the local dashboard as an access-controlled system. Add a secure authentication service and server-side authorization before handling real customer accounts.

## 15. Integration points
Replace local persistence in `site.js`, `booking.js`, `dashboard.js` and `forms.js` with authenticated backend APIs. Configure Formspree/Netlify Forms for delivery, Mailchimp/ConvertKit for subscriptions, a verified Google Maps location, a booking/calendar API for availability, email notification delivery, and Stripe/PayPal for payments. Do not change local confirmations into real success messages until the server verifies the action. Keep credentials on the server, never in browser JS.

## 16. Theme
Theme follows the system preference until a manual choice is saved under `clearnest-theme`. Black/Milk swap surfaces and text, with Orange as the accent. Forms, dropdowns and dashboard use the same variables.

## 17. Layout reversal
`clearnest-rtl` mirrors columns, navigation and other layout positions while keeping English characters and paragraph alignment unchanged. True translated Arabic or Hebrew content would need proper locale direction in addition to layout mirroring.

## 18. Motion
Fade-up reveals, hover transitions, tab changes, navigation motion and the Home 1 benefit strip. The Home 1 pause control saves its state under `clearnest-motion`. System reduced-motion disables animated effects. The site does not require motion to access content.

## 19. SEO and operations
Unique titles, descriptions, Open Graph basics, breadcrumbs and article structured data. `sitemap.xml` uses the current hosted origin. Authentication, dashboard, 404 and maintenance pages use `noindex`. Update the sitemap, canonicals and organization data if the origin or brand changes. Real office/address/contact details must be supplied before claiming them in LocalBusiness markup.

## 20. Validation, changelog and support
See `VALIDATION.md` for performed checks and limits. The project includes all previous icon and row-alignment corrections, the FAQ spacing fix and the completed page set. Verify the final visual appearance at 375, 430, 768, 1024, 1280, 1440 and 1920px in your browser. Browser layout, Lighthouse performance, external map loading and cross-browser checks were not available in this build environment. Report the page and viewport with any issue found.

## Latest focused corrections
Booking and Service Details now place their main work area and supporting box one below the other; these supporting boxes are no longer sticky. Checklist summaries use matching row height with inclusion badges aligned in a fixed column; mobile badges move beneath the task title. Both maps now show New York City as an illustrative American location, not a verified business address. INR estimates and illustrative Chennai postal-code examples remain separate configuration and were not changed by the map request.

Home Page 1 and About include three equal-height testimonial slots with replaceable profile assets in assets/images/testimonials/customer-1.svg through customer-3.svg. Replace the image src with your own local JPG path when ready. Replace the feedback and customer names with customer-approved content; none of these slots claim actual reviews.

## Testimonial copy
About and Home Page 1 use illustrative feedback attributed to fictional American names Emily Carter, Michael Bennett and Olivia Parker. A visible note identifies these as illustrative. Replace each quote and name with approved real feedback before representing these as customer reviews. Profile paths are assets/images/testimonials/customer-1.svg, customer-2.svg and customer-3.svg; update each img src to your own JPG path when replacing the silhouettes.
