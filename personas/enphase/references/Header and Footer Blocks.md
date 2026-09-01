# SFMC Header & Footer Content Blocks

Reference list of Salesforce Marketing Cloud (SFMC) Content Builder header and footer blocks, including their corresponding SFMC IDs.

Only footers that correspond to an available header are listed. If a requested country/language has no matching block, fall back to the US pair: `Header_Dark_Version1_EN` + `NA_Footer_Section` (see Selection & Fallback Rules below).

---

## Footer Blocks

| Footer Block Name              | SFMC ID |
| ------------------------------ | ------: |
| `APAC_AU_Footer_Section`       |  171604 |
| `EMEA_DE_Footer_Section`       |  171508 |
| `EMEA_DK_Footer_Section`       |  171594 |
| `EMEA_ES_Footer_Section`       |  171507 |
| `EMEA_FI_Footer_Section`       |  171515 |
| `EMEA_FR_Footer_Section`       |  171494 |
| `EMEA_HR_Footer_Section`       |  171501 |
| `EMEA_IT_Footer_Section`       |  171495 |
| `EMEA_LT_Footer_Section`       |  171502 |
| `EMEA_LU_Footer_Section`       |  171513 |
| `EMEA_NL_Footer_Section`       |  171606 |
| `EMEA_PL_Footer_Section`       |  171602 |
| `EMEA_PT_Footer_Section`       |  171491 |
| `EMEA_RO_Footer_Section`       |  171597 |
| `EMEA_SE_Footer_Section`       |  171599 |
| `EMEA_UK_Footer_Section`       |  171605 |
| `Footer_BlackBG_Dark_Version1` |  163781 |
| `Footer_BlackBG_Dark_Version2` |  163779 |
| `LATAM_BR_Footer_Section`      |  171493 |
| `LATAM_MX_Footer_Section`      |  171496 |
| `LATAM_PR_Footer_Section`      |  171603 |
| `NA_Footer_Section`            |  171497 |

---

## Standard Header Blocks

| Header Block Name          | SFMC ID |
| -------------------------- | ------: |
| `Header_Dark_Version1_AU`  |  209197 |
| `Header_Dark_Version1_DE`  |  199964 |
| `Header_Dark_Version1_EN`  |  196561 |
| `Header_Dark_Version1_ES`  |  197213 |
| `Header_Dark_Version1_FR`  |  199061 |
| `Header_Dark_Version1_IT`  |  199063 |
| `Header_Dark_Version1_LUX` |  208382 |
| `Header_Dark_Version1_NL`  |  196658 |
| `Header_Dark_Version1_PL`  |  197350 |
| `Header_Dark_Version1_PT`  |  198739 |
| `Header_Dark_Version2`     |  206404 |
| `Header_Light_Version1_DE` |  205769 |
| `Header_Light_Version1_EN` |  196551 |
| `Header_Light_Version1_FR` |  198492 |
| `Header_Light_Version1_NL` |  200663 |
| `Header_Light_Version1_PT` |  205749 |

---

## New Country Header Blocks

| Header Block Name             | SFMC ID |
| ----------------------------- | ------: |
| `Header_Dark_Version_DK`      |  222325 |
| `Header_Dark_Version_EL`      |  222327 |
| `Header_Dark_Version_FI`      |  222326 |
| `Header_Dark_Version_HR`      |  222324 |
| `Header_Dark_Version_LT`      |  222328 |
| `Header_Dark_Version_LU`      |  222329 |
| `Header_Dark_Version_MT`      |  222330 |
| `Header_Dark_Version_RO`      |  222331 |
| `Header_Dark_Version_SE`      |  222332 |
| `Header_Light_Version1_BR`    |  196319 |
| `Header_Light_Version1_EN_UK` |  205171 |
| `Header_Light_Version1_ES_PR` |  196320 |
| `Header_Light_Version1_IT`    |  196317 |
| `Header_Light_Version1_MX`    |  196318 |

---

## Header ↔ Footer Correspondence

| Country / Language     | Header Block                                            | Footer Block (SFMC ID)                |
| ---------------------- | ------------------------------------------------------- | ------------------------------------- |
| US / English (default) | `Header_Dark_Version1_EN` (196561)                       | `NA_Footer_Section` (171497)          |
| Australia (AU)         | `Header_Dark_Version1_AU` (209197)                       | `APAC_AU_Footer_Section` (171604)     |
| Brazil (BR)            | `Header_Light_Version1_BR` (196319)                      | `LATAM_BR_Footer_Section` (171493)    |
| Croatia (HR)           | `Header_Dark_Version_HR` (222324)                        | `EMEA_HR_Footer_Section` (171501)     |
| Denmark (DK)           | `Header_Dark_Version_DK` (222325)                        | `EMEA_DK_Footer_Section` (171594)     |
| Finland (FI)           | `Header_Dark_Version_FI` (222326)                        | `EMEA_FI_Footer_Section` (171515)     |
| France (FR)            | `Header_Dark_Version1_FR` (199061)                       | `EMEA_FR_Footer_Section` (171494)     |
| Germany (DE)           | `Header_Dark_Version1_DE` (199964)                       | `EMEA_DE_Footer_Section` (171508)     |
| Italy (IT)             | `Header_Dark_Version1_IT` (199063)                       | `EMEA_IT_Footer_Section` (171495)     |
| Lithuania (LT)         | `Header_Dark_Version_LT` (222328)                        | `EMEA_LT_Footer_Section` (171502)     |
| Luxembourg (LUX / LU)  | `Header_Dark_Version1_LUX` (208382) / `Header_Dark_Version_LU` (222329) | `EMEA_LU_Footer_Section` (171513) |
| Mexico (MX)            | `Header_Light_Version1_MX` (196318)                      | `LATAM_MX_Footer_Section` (171496)    |
| Netherlands (NL)       | `Header_Dark_Version1_NL` (196658)                       | `EMEA_NL_Footer_Section` (171606)     |
| Poland (PL)            | `Header_Dark_Version1_PL` (197350)                       | `EMEA_PL_Footer_Section` (171602)     |
| Portugal (PT)          | `Header_Dark_Version1_PT` (198739)                       | `EMEA_PT_Footer_Section` (171491)     |
| Puerto Rico (ES_PR)    | `Header_Light_Version1_ES_PR` (196320)                   | `LATAM_PR_Footer_Section` (171603)    |
| Romania (RO)           | `Header_Dark_Version_RO` (222331)                        | `EMEA_RO_Footer_Section` (171597)     |
| Spain (ES)             | `Header_Dark_Version1_ES` (197213)                       | `EMEA_ES_Footer_Section` (171507)     |
| Sweden (SE)            | `Header_Dark_Version_SE` (222332)                        | `EMEA_SE_Footer_Section` (171599)     |
| United Kingdom (EN_UK) | `Header_Light_Version1_EN_UK` (205171)                   | `EMEA_UK_Footer_Section` (171605)     |
| Greece (EL)            | `Header_Dark_Version_EL` (222327)                        | *(no footer — use `NA_Footer_Section` 171497)* |
| Malta (MT)             | `Header_Dark_Version_MT` (222330)                        | *(no footer — use `NA_Footer_Section` 171497)* |

Light-variant headers (`Header_Light_Version1_DE/EN/FR/NL/PT/IT`) pair with the same country footer as their dark counterparts. `Header_Dark_Version2` (206404) is generic and pairs with `Footer_BlackBG_Dark_Version1/2` or the country footer as instructed.

---

## Selection & Fallback Rules

1. **Detect the country/language** from the user's instructions (or the design/content language) and pick the matching header + its corresponding footer from the tables above.
2. **Swap both the `ContentBlockbyID` value AND the surrounding comment names** so the comments always name the exact block being used, e.g.:

   ```html
   <!-- Header_Dark_Version1_FR Content Block Below -->
   %%=ContentBlockbyID("199061")=%%
   <!-- //Header_Dark_Version1_FR Content Block below -->
   ...
   <!-- EMEA_FR_Footer_Section Content Block Below -->
   %%=ContentBlockbyID("171494")=%%
   <!-- //EMEA_FR_Footer_Section Content Block below -->
   ```

3. **Fallback (US / EN / NA):** if the user's instructions include a country or language that we do NOT have blocks for, use the US ones — `Header_Dark_Version1_EN` (196561) and `NA_Footer_Section` (171497). The US country uses the NA footer and EN-named header.
4. **Partial coverage:** if a country has a header but no corresponding footer (Greece `EL`, Malta `MT`), keep that country's header and use the `NA_Footer_Section` (171497) footer fallback.
5. **Header + footer travel as a pair** — never mix one country's header with another country's footer (fallback cases excepted).

---

## Quick Reference

### Countries With a Full Header + Footer Pair

* **APAC:** Australia (`AU`)
* **EMEA:** Germany (`DE`), Denmark (`DK`), Spain (`ES`), Finland (`FI`), France (`FR`), Croatia (`HR`), Italy (`IT`), Lithuania (`LT`), Luxembourg (`LUX`/`LU`), Netherlands (`NL`), Poland (`PL`), Portugal (`PT`), Romania (`RO`), Sweden (`SE`), United Kingdom (`EN_UK`)
* **LATAM:** Brazil (`BR`), Mexico (`MX`), Puerto Rico (`ES_PR`)
* **NA:** United States (`EN` header + `NA` footer — also the global fallback)

### Header-Only Countries (footer falls back to `NA_Footer_Section`)

* Greece (`EL`)
* Malta (`MT`)

### Generic Blocks

* `Footer_BlackBG_Dark_Version1`
* `Footer_BlackBG_Dark_Version2`
* `Header_Dark_Version2`

---

## Usage

Use the **SFMC Content Blocks** when referencing Header and footers in an Email.

> **Note:** Block names and IDs should be treated as the source of truth for the current SFMC Content Builder configuration. Verify against SFMC before making changes to production content.

Also note that US Country uses NA ones or EN ones in Name
