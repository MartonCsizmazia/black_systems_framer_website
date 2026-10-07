/**
 * The company's legal details, shown on the legal page (/legal) and named in
 * its privacy notice. Same in every language, so they live here once.
 *
 * PLACEHOLDERS: replace every [bracketed] value with the real details. Leave
 * `euVatNumber` empty ('') if the company has no EU VAT number; its row is
 * then hidden.
 */
export const COMPANY = {
  name: '[Company legal name, e.g. Black Systems Kft.]',
  seat: '[Registered seat: postcode, city, street and number]',
  registrationNumber: '[Company registration number, e.g. Cg. 01-09-000000]',
  registrationCourt: '[Registering court, e.g. Fővárosi Törvényszék Cégbírósága]',
  taxNumber: '[Tax number, e.g. 12345678-1-42]',
  euVatNumber: '[EU VAT number, e.g. HU12345678]',
}

/** The website's hosting provider (required in the company details by the
 * Hungarian e-commerce act, Ekertv. 4. §). */
export const HOSTING_PROVIDER = {
  name: 'Cloudflare, Inc.',
  address: '101 Townsend St, San Francisco, CA 94107, USA',
  email: 'privacy@cloudflare.com',
}
