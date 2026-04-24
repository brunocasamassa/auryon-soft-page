# Bruno Casamassa — Portfolio & AppBlockerService Landing

Site bilíngue (PT/EN) para promover o **AppBlockerService** e servir também
como portfólio pessoal. Inspiração visual: [p5aholic.me](https://p5aholic.me/).

## Como rodar

Não precisa build. Só abrir `index.html` no navegador.

> Se algum recurso (como as fontes do Google ou as libs do CDN) não carregar
> porque você abriu via `file://`, use um servidor local simples:

```bash
# Python (já vem no Windows 10/11)
cd caminho\para\bruno-site
python -m http.server 8080
# depois abra http://localhost:8080
```

Ou use a extensão **Live Server** do VS Code.

## Estrutura

```
bruno-site/
├── index.html           # markup completo (hero / produto / portfólio / sobre / contato)
├── css/
│   └── style.css        # tema dark + editorial, variáveis CSS no topo
├── js/
│   ├── i18n.js          # traduções PT/EN + toggle de idioma
│   ├── webgl.js         # background three.js (campo de partículas com shader)
│   └── main.js          # loader, cursor, GSAP reveals, timer do celular, relógio SP
└── assets/              # coloque screenshots do app aqui se quiser
```

## Stack

- **three.js r128** — background WebGL (shader GLSL customizado)
- **GSAP 3.12 + ScrollTrigger** — animações e reveals no scroll
- **Fraunces + JetBrains Mono** — tipografia (Google Fonts)
- **Sem build step** — HTML/CSS/JS puro, pronto pra hospedar em qualquer lugar

## O que editar primeiro

### 1. Copy do AppBlockerService
Arquivo: `js/i18n.js`

As strings estão organizadas por chave nos objetos `pt` e `en`. Procure
por `f1.title`, `f1.desc`, etc. para ajustar as features.

### 2. Links
Arquivo: `index.html`

- **Email** — busque `brunocasamassa@gmail.com` e troque pelo seu email real
- **LinkedIn / GitHub / X** — já estão corretos (puxei do seu perfil)
- **Play Store do AppBlocker** — procure `href="#"` no primeiro
  `.project` do portfólio e troque pelo link quando o app for publicado

### 3. Screenshots reais
O mockup de celular é 100% HTML/CSS (não usa imagens). Se quiser trocar
por screenshots reais do seu app:

1. Salve as PNGs na pasta `assets/`
2. No `index.html`, substitua o bloco `.phone-content` por:
   ```html
   <img src="assets/app-screenshot.png" alt="AppBlocker" style="width:100%;height:100%;object-fit:cover;border-radius:32px;" />
   ```

### 4. Lista de projetos
No `index.html`, seção `.projects`, cada `<a class="project">` é uma
entrada. Ajuste nome, ano e link conforme for publicando cases.

## Publicar na web (opcional)

Como é tudo estático, qualquer host gratuito serve:

- **GitHub Pages** — crie um repo `brunocasamassa.github.io`, faça push do
  conteúdo desta pasta pro `main`
- **Vercel** / **Netlify** — arraste a pasta na interface, sobe em 30s
- **Cloudflare Pages** — mesma ideia, CDN global grátis

## Customização de cor

No `css/style.css`, topo do arquivo:

```css
:root {
  --accent: #00ff9d;   /* verde neon principal */
  --accent-2: #ff2d55; /* vermelho dos apps bloqueados */
  --bg: #0a0a0a;       /* fundo */
}
```

Muda tudo de uma vez.

## Performance

- WebGL usa `Math.min(devicePixelRatio, 2)` para não matar retina displays
- Cursor customizado e WebGL são desabilitados em telas < 900px
- Animações GSAP têm fallback em IntersectionObserver se as libs falharem
- Fontes carregadas do Google Fonts com `preconnect`

## Licença

Código livre pra você usar como quiser. As libs (three.js, gsap) têm suas
próprias licenças — checar os sites oficiais.
