/**
 * searchService.js
 *
 * Controlled study environment: returns a fixed, curated set of 6 results
 * about the health risks of sunscreen with mineral nanoparticles (ZnO, TiO2).
 * All queries return the same set to ensure a controlled experimental environment.
 */

export const CURATED_RESULTS = [
  {
    id: '1',
    title: 'Detection of skin penetration of TiO2 nanoparticles from sunscreens',
    snippet: 'This systematic investigation uses advanced imaging to determine if mineral nanoparticles penetration viable skin layers. Results show that particle accumulation is limited to the stratum corneum.',
    url: '/article/1',
    source: 'PubMed / Journal of Investigative Dermatology',
    sourceColor: '#1a6ea8',
    articleStyle: 'pubmed',
    authors: 'M.S. Roberts, P.J. Barker, et al.',
    year: '2023',
    journal: 'Journal of Investigative Dermatology',
    doi: '10.1016/j.jid.2023.01.002',
    volume: '143', issue: '1', pages: '12-25',
    fullContent: `## Abstract\nNanoparticulate titanium dioxide (TiO₂) and zinc oxide (ZnO) are widely used as ultraviolet (UV) filters in sunscreens. This study aims to provide definitive evidence regarding the penetration of these particles through the human skin barrier.\n\n## Introduction\nPublic concern regarding the systemic absorption of nanomaterials has led to rigorous testing of commercial sunscreen formulations. While nanoparticles offer superior UV protection and cosmetic transparency, their potential for dermal uptake remains a focus of toxicological research.\n\n## Methodology\nUsing multiphoton microscopy and scanning electron microscopy (SEM) combined with energy dispersive X-ray (EDX) analysis, we monitored the distribution of TiO₂ nanoparticles in both excised human skin and in vivo subjects. Sunscreens were applied at a standard dose (2 mg/cm²) for up to 24 hours.\n\n## Results\nIn all cases, TiO₂ nanoparticles were detected only in the outermost layer—the stratum corneum. No evidence of particle migration into the viable epidermis or dermis was found. Hair follicles showed some accumulation, but particles did not penetrate the follicular epithelium into the surrounding tissue.\n\n## Conclusion\nThis study reinforces the consensus that intact human skin is an effective barrier against the penetration of mineral nanoparticles used in sunscreens. We conclude that dermal application under normal conditions does not lead to systemic exposure.`,
  },
  {
    id: '2',
    title: 'Zinc oxide (nano form): Scientific opinion on consumer safety',
    snippet: 'The SCCS concludes that nano-ZnO is safe for use as a UV-filter at 25%, but flags high-risk inhalation pathways for spray products.',
    url: '/article/2',
    source: 'European Commission – Scientific Committees',
    sourceColor: '#003399',
    articleStyle: 'ec_layman',
    authors: 'Scientific Committee on Consumer Safety (SCCS)',
    year: '2022',
    journal: 'SCCS Scientific Opinion',
    doi: 'SCCS/1489/12',
    fullContent: `## Overview of Nano-ZnO Safety\nThe SCCS has reviewed the scientific data on zinc oxide in its nano-form. At present, gaps in knowledge exist regarding the behavior of nanoparticles in biological media, leading to some uncertainty. However, weight of evidence allows for clear safety conclusions.\n\n## Dermal Exposure\nFrom the available information, there is no indication for penetration of ZnO nanoparticles through the skin. Clinical studies show that while some zinc (Zn) may be absorbed into the blood pool, this likely occurs in ionic form (Zn²⁺) rather than as nanoparticles. This minor contribution to systemic Zn levels does not pose a health risk.\n\n## Inhalation Risk (Critical Exception)\nSerious local effects in the lung were observed upon inhalation of ZnO nanoparticles. The Committee is of the opinion that, on the basis of available information, the use of ZnO nanoparticles in sprayable cosmetic products cannot be considered safe.\n\n## SCCS Conclusion\nThe use of ZnO nanoparticles with a concentration up to 25% as a UV-filter in sunscreens can be considered not to pose a risk of adverse effects in humans after dermal application. This does not apply to spray products that might lead to inhalation exposure.`,
  },
  {
    id: '3',
    title: 'Titanium dioxide nanoparticle: Physical and chemical properties',
    snippet: 'Wikipedia article covering the safety, environmental impact, and regulatory status of TiO2 nanomaterials in consumer products.',
    url: '/article/3',
    source: 'Wikipedia',
    sourceColor: '#000000',
    articleStyle: 'wikipedia',
    authors: 'Wikipedia Contributors',
    year: '2024',
    journal: 'The Free Encyclopedia',
    fullContent: `## Use in Sunscreen\nNano-sized titanium dioxide (TiO₂) is used in sunscreens because it maintains high UV protection while being transparent on the skin. Bulk TiO₂ leaves a white, opaque paste, whereas nanoparticles allow for a "clear" application that is more aesthetically pleasing to consumers, improving usage rates.\n\n## Health and Safety Concerns\n### Dermal Absorption\nThe consensus among regulatory bodies (SCCS, TGA, FDA) is that TiO₂ nanoparticles do not penetrate the healthy human skin barrier. The stratum corneum provides adequate protection against systemic uptake.\n\n### Genotoxicity and Photoreactivity\nNano-TiO₂ is photoactive; it can react with sunlight to produce free radicals (Reactive Oxygen Species). These radicals could theoretically damage DNA if the particles reached living cells. To prevent this, manufacturers coat the nanoparticles with an inert mineral layer (like silica or alumina) which suppresses the production of free radicals.\n\n### Inhalation\nThe International Agency for Research on Cancer (IARC) has classified TiO₂ as a Group 2B carcinogen ("possibly carcinogenic to humans") by the inhalation route, based on studies where rats developed lung tumors after high-dose exposure. This risk is primarily industrial and does not relate to normal sunscreen use.`,
  },
  {
    id: '4',
    title: 'Why sunscreens are in the nanotechnology safety spotlight',
    snippet: 'Guardian news report on the Australian union call to avoid nano-sunscreens and the lack of consensus on long-term safety.',
    url: '/article/4',
    source: 'The Guardian',
    sourceColor: '#052962',
    articleStyle: 'guardian',
    authors: 'G. Sutcliffe, R. Moore (Ed.)',
    year: '2011',
    journal: 'Nanotechnology World',
    fullContent: `## The Safety Spotlight\n"Wear sunscreen," advised film director Baz Luhrmann in 1999. But today, the Australian Education Union (AEU) has recommended that schools refrain from using sunscreens containing nanoparticles. "With early indications that some nano sunscreens may present hazards and so many unanswered questions, there is no need to take a risk," says Georgia Miller, from Friends of the Earth Australia.\n\n## The Zinc and Titanium Dilemma\nZinc oxide and titanium dioxide are standard UV filters. Modern 'nano' versions allow for clear creams, but fears persist about what happens when these tiny particles react with sunlight. Some skeptics point to the fact that TiO₂ is photoactive—it creates 'free radicals' that can attack the body's cells if they manage to pass the skin barrier.\n\n## Balancing Risk\nRegulatory bodies like the TGA have reviewed 16 studies, 15 of which showed no penetration. However, researchers emphasize that "the public still feels they aren't given enough information." Most scientists agree that the known risk of skin cancer from sun damage far outweighs the unsubstantiated risk of nanoparticle penetration. "People need to weigh up the known and substantial risk of sun damage against a speculated risk," says Andrew Maynard of the Risk Science Center.`,
  },
  {
    id: '5',
    title: 'Safety and efficacy of nanoparticle-containing sunscreens',
    snippet: 'Abstract of a study comparing the UV blocking efficiency of nano vs bulk mineral filters and their penetration into human skin.',
    url: '/article/5',
    source: 'ScienceDirect / Journal of the American Academy of Dermatology',
    sourceColor: '#e05d06',
    articleStyle: 'sciencedirect',
    authors: 'N.A. Monteiro-Riviere, et al.',
    year: '2019',
    journal: 'Journal of the American Academy of Dermatology',
    doi: '10.1016/j.jaad.2019.05.039',
    volume: '81', issue: '3', pages: '450-462',
    fullContent: `## Abstract\n### Background\nRecent consumer concerns regarding the safety of nanotechnology in personal care products have prompted a clinical re-evaluation of mineral sunscreens.\n\n### Objective\nTo evaluate the UV-protective efficacy and skin penetration potential of nanoparticulate vs. micronized zinc oxide (ZnO) and titanium dioxide (TiO₂) in human volunteers.\n\n### Methods\nSix different sunscreen formulations were applied to subjects under varying conditions (intact vs. slightly abraded skin). Penetration was assessed via multiple biopsies and systemic zinc monitoring.\n\n### Results\nNanoparticle formulations provided significantly higher SPF values and broader UVA protection per unit mass compared to micronized versions. Under all conditions tested on healthy skin, nanoparticles were confined to the stratum corneum and skin furrows. Minimal increased zinc levels were observed in urine only after 5 days of repeated application to damaged skin, but remained within normal physiological ranges.\n\n### Conclusion\nNanoparticulate mineral sunscreens are both more effective and equally safe as traditional formulations when applied to intact skin. Caution is advised for use on severely damaged skin barriers.`,
  },
  {
    id: '6',
    title: 'UV radiation and health: Sunscreen safety',
    snippet: 'WHO technical guidance on sun protection, highlighting the importance of broad-spectrum filters and the safety of nanomaterials.',
    url: '/article/6',
    source: 'World Health Organization (WHO)',
    sourceColor: '#1a80b6',
    articleStyle: 'who',
    authors: 'World Health Organization Radiation Programme',
    year: '2021',
    journal: 'Technical Report / Radiation Safety',
    doi: 'WHO/UV/21.01',
    fullContent: `## WHO Position on Nanomaterials\nThe World Health Organization (WHO) continuously monitors the safety of chemical and physical filters used in sunscreens to maintain international health standards.\n\n## Health Benefit vs. Theoretical Risk\nSkin cancer, including melanoma and basal cell carcinoma, remains a significant global health burden. The use of broad-spectrum sunscreens with SPF 30 or higher is one of the most effective ways to prevent UV-induced cancer. \n\nConcerns regarding 'nano' mineral filters (TiO₂ and ZnO) have been extensively studied by WHO-affiliated panels. The current consensus is that the health risks of skin cancer drastically outweigh the theoretical risks associated with skin absorption of nanoparticles. \n\n## Key Guidance\n1. Use broad-spectrum protection (UVA and UVB).\n2. Apply 2mg/cm² (about 35ml for a full adult body).\n3. Reapply every 2 hours, especially after swimming or sweating.\n4. Current regulatory data from SCCS and FDA support the safety of 'nano' mineral filters for topical application. Inhalation risk remains for spray-based products, which should be avoided or used with caution.\n\n## Conclusion\nSunscreens are a vital tool for public health. Nano-sized mineral filters provide excellent protection and are considered safe for topical use on healthy skin.`,
  },
];

/**
 * ChatGPT-style synthesized narrative summary to display above the links.
 * Inline citations [n] reference the curated results by index.
 */
export const CHATGPT_SUMMARY = [
  {
    type: 'paragraph',
    text: 'Research on the health risks of sunscreens containing mineral nanoparticles (zinc oxide and titanium dioxide) suggests that **the risks are low for typical topical use**, but some specific scenarios warrant caution.',
  },
  {
    type: 'heading',
    text: 'What the evidence says',
  },
  {
    type: 'bullets',
    items: [
      { text: 'Nanoparticles **do not penetrate intact skin** beyond the outermost dead-cell layer (stratum corneum), meaning they do not enter the bloodstream under normal use.', cite: 1 },
      { text: '**Inhalation is the key risk** for spray or powder formulations — inhaled ZnO particles can deposit in the lungs and cause oxidative stress. This does not apply to creams applied by hand.', cite: 2 },
      { text: 'In laboratory (in vitro) studies, high concentrations of ZnO nanoparticles can cause DNA damage in human cells — but these concentrations are far higher than real-world skin exposure.', cite: 3 },
      { text: 'Environmental concerns exist: nanoparticles washed off during bathing can be toxic to coral reefs and marine microorganisms.', cite: 5 },
    ],
  },
  {
    type: 'paragraph',
    text: '**Regulatory assessment:** Major health agencies — including the TGA, WHO, and European Commission — have reviewed the evidence and concluded that nanoparticle sunscreens are **safe for topical use** on healthy skin, and that the proven UV protection benefit outweighs the theoretical risks.',
    cite: [4, 6],
  },
  {
    type: 'heading',
    text: 'Here are ready-to-cite sources',
  },
];

/**
 * Returns the same curated set of 6 results for any query.
 * Simulates a short loading delay to mimic real search behavior.
 */
export const searchAll = async (query) => {
  if (!query) return [];
  // Simulate a realistic search delay
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 600));
  return CURATED_RESULTS;
};
