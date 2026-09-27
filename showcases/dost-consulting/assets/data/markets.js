/* Editorial market context. Update text, official sources AND lastReviewed together.
   Investigation prompts are not country ratings or verified cost estimates. */
window.DOST_MARKETS = {
  uae: {
    name: 'UAE / Dubai', short: 'UAE', code: 'AE', x: 76, y: 72, lastReviewed: '2026-09-27',
    tax: 'Standard UAE corporate tax: 0% on the portion of taxable income up to AED 375,000; 9% on the portion exceeding AED 375,000. A Qualifying Free Zone Person has 0% on Qualifying Income and 9% on taxable income that is not Qualifying Income, subject to eligibility conditions. Special regimes may apply; this is not an exhaustive tax assessment.',
    taxSource: 'https://tax.gov.ae/Datafolder/Files/Guides/CT/CT%20General%20Guide%20-%20EN%20-%2010%2009%202023.pdf', taxAuthority: 'UAE Federal Tax Authority',
    extraSource: 'https://tax.gov.ae/en/faq.aspx?keyword=What+UAE+CT+rates+will+apply+to+entities+established+in+a+Free+Zone%3F',
    setup: 'Investigate mainland and free-zone routes against the precise activity, trading permissions, premises and ownership needs.',
    access: 'Test demand in the UAE and wider GCC separately. A Dubai base does not establish product–market fit across the region.',
    operations: 'Budget for premises, licences, banking, compliance, people and recurring renewals using current quotations.',
    residency: 'Examine the relevant residence route and its requirements separately from company formation.',
    digital: 'Map payment processing, customer contracting, data handling and the substance of the actual operation.',
    local: 'Validate the buyer segment, procurement cycle, language needs and competitive alternatives.',
    international: 'Investigate whether a Gulf base improves client access, partnerships and time-zone coverage.',
    fit: 'Explore fit for regional consulting, trading and digital businesses only after activity and customer validation.',
    businessSource: 'https://u.ae/en/information-and-services/business', businessAuthority: 'UAE Government business portal'
  },
  uk: {
    name: 'United Kingdom', short: 'United Kingdom', code: 'GB', x: 27, y: 37, lastReviewed: '2026-09-27',
    tax: 'For non-ring-fence company profits, the main corporation tax rate is 25% above £250,000. The small-profits rate is 19% at £50,000 or less, subject to eligibility. Marginal Relief may apply between these amounts. Thresholds reduce for short accounting periods and associated companies.',
    taxSource: 'https://www.gov.uk/corporation-tax-rates', taxAuthority: 'HM Revenue & Customs',
    setup: 'Investigate company registration, directors’ obligations, identity verification and ongoing filings.',
    access: 'Test the UK customer opportunity independently from an EU market-entry plan.',
    operations: 'Model accounting, payroll, employment and location costs around the intended team.',
    residency: 'Company ownership is distinct from permission to live or work in the UK; investigate an appropriate immigration route.',
    digital: 'Check customer procurement requirements, privacy obligations, banking and international payment arrangements.',
    local: 'Test buyer trust, sector networks, sales cycles and the cost of serving UK customers.',
    international: 'Evaluate UK commercial positioning against where contracts, people and management actually sit.',
    fit: 'Investigate fit for professional services, software and brands with a defined UK buyer.',
    businessSource: 'https://www.gov.uk/set-up-business', businessAuthority: 'UK Government business guidance'
  },
  estonia: {
    name: 'Estonia', short: 'Estonia', code: 'EE', x: 57, y: 21, lastReviewed: '2026-09-27',
    tax: 'Estonian corporate income tax generally arises on profit distribution. From 2025, tax on the net distributed amount is calculated at 22/78, equivalent to 22% of gross profit. Other taxable payments, cross-border obligations and specific rules also need review.',
    taxSource: 'https://www.emta.ee/en/business-client/taxes-and-payment/income-and-social-taxes/income-tax-and-basic-exemption', taxAuthority: 'Estonian Tax and Customs Board',
    setup: 'Investigate digital company administration, address and contact-person requirements, accounting and banking access.',
    access: 'Separate an EU company presence from evidence of demand and distribution in individual European markets.',
    operations: 'Model administration alongside the real location of management, employees and service delivery.',
    residency: 'E-residency is a digital identity programme, not a residence permit or a personal tax-residency determination.',
    digital: 'Explore remote administration while checking substance, payment providers and obligations in other countries.',
    local: 'Validate the reachable domestic segment rather than assuming local scale from an EU registration.',
    international: 'Examine where the company is effectively managed and whether other jurisdictions can tax its activity.',
    fit: 'Investigate fit for remotely administered digital businesses with a clear cross-border compliance plan.',
    businessSource: 'https://www.e-resident.gov.ee/', businessAuthority: 'Estonian e-Residency programme'
  },
  lithuania: {
    name: 'Lithuania', short: 'Lithuania', code: 'LT', x: 54, y: 33, lastReviewed: '2026-09-27',
    tax: 'The standard Lithuanian corporate income tax rate is 17% for 2026 and subsequent tax periods. Reduced rates have eligibility conditions; investigate the applicable regime and cross-border treatment before modelling a net tax cost.',
    taxSource: 'https://www.vmi.lt/evmi/tarifai-5-str.-', taxAuthority: 'Lithuanian State Tax Inspectorate (VMI)',
    setup: 'Investigate the entity form, registered office, capital requirements and sector-specific permissions.',
    access: 'Validate the intended Lithuanian, Baltic or wider European customer base individually.',
    operations: 'Obtain current quotations for talent, premises, payroll and compliance in the chosen city.',
    residency: 'Confirm the founder’s right to reside and work through the relevant migration route.',
    digital: 'Investigate payment infrastructure, sector licensing, data obligations and hiring requirements.',
    local: 'Assess language, buyer access, distribution partners and achievable segment size.',
    international: 'Test the commercial value of a Baltic operating base for the actual business model.',
    fit: 'Explore fit for software, services and operational teams after demand and talent validation.',
    businessSource: 'https://investlithuania.com/', businessAuthority: 'Invest Lithuania'
  },
  poland: {
    name: 'Poland', short: 'Poland', code: 'PL', x: 47, y: 46, lastReviewed: '2026-09-27',
    tax: 'Standard Polish corporate income tax is 19%. A 9% rate may apply to eligible small or new taxpayers within the relevant revenue limits, excluding capital gains and subject to restrictions. Banks have special rates from 2026. Review the specific regime with a qualified professional.',
    taxSource: 'https://www.podatki.gov.pl/podatki-firmowe/cit/cit-klasyczny/stawki-i-limity', taxAuthority: 'Polish Ministry of Finance',
    setup: 'Investigate the appropriate legal form, registration, reporting and sector permissions.',
    access: 'Test domestic demand and the logistics of serving other European markets.',
    operations: 'Compare real hiring, warehousing, logistics and compliance quotations by location.',
    residency: 'Review residence and work permissions separately from ownership of a company.',
    digital: 'Plan localisation, payments, consumer obligations and cross-border VAT review where relevant.',
    local: 'Investigate local-language conversion, distributor economics and competing offers.',
    international: 'Assess whether the intended supply chain and customer footprint justify a Polish base.',
    fit: 'Explore fit for services, commerce and operating teams with a validated customer or supply-chain rationale.',
    businessSource: 'https://www.biznes.gov.pl/en', businessAuthority: 'Polish Government business portal'
  },
  saudi: {
    name: 'Saudi Arabia', short: 'Saudi Arabia', code: 'SA', x: 62, y: 84, lastReviewed: '2026-09-27',
    tax: 'Saudi income-tax obligations depend on ownership, residence, source of income and activity. ZATCA identifies non-Saudi ownership interests in resident capital companies and certain non-resident activity within scope. Assess income tax, Zakat and withholding obligations for the specific structure; no single headline rate is applied here.',
    taxSource: 'https://www.zatca.gov.sa/en/Pages/IncomeTax.aspx', taxAuthority: 'Zakat, Tax and Customs Authority',
    setup: 'Investigate foreign-investment requirements, commercial registration and sector-specific permissions.',
    access: 'Validate Saudi buyers, procurement requirements and the practical need for a local presence.',
    operations: 'Model staffing, localisation requirements, premises, compliance and contract delivery.',
    residency: 'Investigate the appropriate residence and work route for founders and employees.',
    digital: 'Check sector rules, data obligations, local payments and procurement expectations.',
    local: 'Test the commercial proposition with target buyers and prospective local partners.',
    international: 'Evaluate the base against the Saudi opportunity and the intended regional operating model.',
    fit: 'Explore fit for businesses with evidenced Saudi customer demand and a resourced entry plan.',
    businessSource: 'https://misa.gov.sa/', businessAuthority: 'Ministry of Investment of Saudi Arabia'
  }
};
