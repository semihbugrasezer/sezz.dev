import mermaid from 'mermaid';

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  if (t === 'dark') return true;
  if (t === 'light') return false;
  return matchMedia('(prefers-color-scheme: dark)').matches;
};

function themeVars() {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    darkMode: isDark(),
    background: v('--bg-raised'),
    primaryColor: v('--bg-sunken'),
    primaryTextColor: v('--ink'),
    primaryBorderColor: v('--rule-strong'),
    secondaryColor: v('--accent-wash'),
    tertiaryColor: v('--bg-raised'),
    lineColor: v('--ink-3'),
    textColor: v('--ink'),
    clusterBkg: v('--bg'),
    clusterBorder: v('--rule-strong'),
    noteBkgColor: v('--accent-wash'),
    noteTextColor: v('--ink'),
    actorBkg: v('--bg-sunken'),
    actorBorder: v('--rule-strong'),
    actorTextColor: v('--ink'),
    signalColor: v('--ink-2'),
    signalTextColor: v('--ink'),
    labelBoxBkgColor: v('--bg-sunken'),
    fontFamily: 'Inter Variable, ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
  };
}

type Item = { figure: HTMLElement; source: string };
const items: Item[] = [];
let seq = 0;

async function draw() {
  mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: themeVars(), securityLevel: 'strict' });
  for (const { figure, source } of items) {
    const target = figure.querySelector<HTMLElement>('.diagram-canvas')!;
    try {
      const { svg } = await mermaid.render(`mmd-${++seq}`, source);
      target.innerHTML = svg;
    } catch (err) {
      // Leave the readable source in place if a diagram fails to render.
      console.error('[diagram]', err);
    }
  }
}

export async function renderDiagrams(nodes: HTMLElement[]) {
  for (const pre of nodes) {
    const source = pre.textContent ?? '';
    const figure = document.createElement('figure');
    figure.className = 'diagram';
    const canvas = document.createElement('div');
    canvas.className = 'diagram-canvas';
    // Keep the source available to assistive tech and as a no-JS fallback.
    const details = document.createElement('details');
    details.innerHTML = '<summary class="meta">Diagram source</summary>';
    details.append(pre.cloneNode(true));
    figure.append(canvas, details);
    pre.replaceWith(figure);
    items.push({ figure, source });
  }
  await draw();
  // Re-render when the colour scheme changes.
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
}
