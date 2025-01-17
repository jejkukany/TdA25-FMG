# Piškvorky by FMG
Vítáme Vás v naší aplikaci👋
Tento projekt byl tvořen podle zadání [Tour de App](https://tourde.app/zadani) ročníku 2024/25 v rámci soutěže od Think Different Academy.

---

## Navigace

- [Členové týmu](#členové-týmu)
- [Použité technologie](#použité-technologie)
- [Spuštění aplikace](#spuštění-aplikace)
- [Spuštění aplikace v Dockeru](#spuštění-aplikace-v-dockeru)
- [Další informace](#další-informace)
  - [Skripty](#skripty)
  - [Struktura projektu](#struktura-projektu)

---

## Členové týmu
- [Daniel Young](https://github.com/jejkukany)
- [Jakub Majtán](https://github.com/xjakuub1)
- [Tomáš Martinec](https://github.com/fakeyn)

---

## Použité technologie
Tento projekt využívá následující technologie:
- ![Next.js](https://skillicons.dev/icons?i=nextjs) **Next.js**: Framework pro tvorbu webových aplikací v Reactu.
- ![pnpm](https://skillicons.dev/icons?i=pnpm) **pnpm**: Rychlý a efektivní package manager.
- <img src="/public/shadcn-ui.svg" width="50" height="50" alt="shadcn/ui Logo" /> **shadcn/ui**: Knihovna pro rychlé vytváření komponentů pro stránky.
- <svg  xmlns="http://www.w3.org/2000/svg"  width="50"  height="50"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-framer-motion"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12l-8 -8v16l16 -16v16l-4 -4" /><path d="M20 12l-8 8l-4 -4" /></svg> **Framer Motion**: Nástroj pro tvorbu animací.
- ![TypeScript](https://skillicons.dev/icons?i=ts) **TypeScript**: Jazyk nadstavby JavaScriptu pro silnější typovou kontrolu.
- ![SQLite](https://skillicons.dev/icons?i=sqlite) **SQLite**: Lehká, serverless databáze pro ukládání dat v aplikaci.

---

## Spuštění aplikace

1. **Klonování repozitáře**:
   ```bash
   git clone https://github.com/jejkukany/TdA25-FMG.git
   cd TdA25-FMG
   ```

2. **Instalace závislostí**:  
   Použijte pnpm pro instalaci všech závislostí:
   ```bash
   pnpm install
   ```

3. **Spuštění vývojového serveru**:
   ```bash
   pnpm dev
   ```

4. **Otevřete aplikaci ve vašem prohlížeči na adrese**:
   ```
   http://localhost:3000
   ```

## Spuštění aplikace v Dockeru

5. **Spuštění v Dockeru**:  
   Pokud chcete aplikaci spustit v Dockeru, postupujte podle následujících kroků:
   
   - **Vytvořte Docker image**:
     ```bash
     docker build -t fmg-tda .
     ```
   
   - **Spusťte kontejner**:
     ```bash
     docker run -p 3000:3000 fmg-tda
     ```

   - **Otevřete aplikaci ve vašem prohlížeči na adrese**:
     ```
     http://localhost:3000
     ```

---

## Další informace

### Skripty:
- `pnpm build`: Sestavení aplikace pro produkční prostředí.
- `pnpm start`: Spuštění aplikace v produkčním režimu.

### Struktura projektu:  
Projekt je rozdělen podle doporučených praktik frameworku Next.js, což zahrnuje složky jako `pages`, `components`, a `public`.

---
## Doufáme, že se Vám bude naše aplikace líbit! 🎉