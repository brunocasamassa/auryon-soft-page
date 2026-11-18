# Auryon Software — site institucional

Site bilíngue (PT/EN) da **Auryon Software**, com foco no **Khronus** (app
Android que bloqueia apps quando o limite diário de uso acaba) e espaço para
os demais apps da empresa, como o **Retro Talks**. Publicado em
[auryonsoft.com.br](https://auryonsoft.com.br) pelo GitHub Pages.
Inspiração visual: [p5aholic.me](https://p5aholic.me/).

## Como rodar

Não precisa build. Só abrir `index.html` no navegador.

> Se algum recurso (como as fontes do Google ou as libs do CDN) não carregar
> porque você abriu via `file://`, use um servidor local simples:

```bash
# Python (já vem no Windows 10/11)
cd caminho\para\auryon-soft-page
python -m http.server 8080
# depois abra http://localhost:8080
```

Ou use a extensão **Live Server** do VS Code.

## Estrutura

```
auryon-soft-page/
├── index.html           # home: hero / Khronus / mais apps / sobre / contato
├── privacy.html         # política de privacidade e termos
├── CNAME                # domínio auryonsoft.com.br (GitHub Pages)
├── css/
│   └── style.css        # tema dark + editorial, variáveis CSS no topo
└── js/
    ├── i18n.js          # traduções PT/EN + toggle de idioma
    ├── webgl.js         # background three.js (campo de partículas com shader)
    └── main.js          # loader, cursor, GSAP reveals, timer do celular, relógio SP
```

## Stack

- **three.js r128** — background WebGL (shader GLSL customizado)
- **GSAP 3.12 + ScrollTrigger** — animações e reveals no scroll
- **Fraunces + JetBrains Mono** — tipografia (Google Fonts)
- **Sem build step** — HTML/CSS/JS puro, pronto pra hospedar em qualquer lugar

## O que editar

### 1. Textos
Arquivo: `js/i18n.js`

As strings estão organizadas por chave nos objetos `pt` e `en` (por exemplo
`f1.title`, `about.p1`, `rt.desc`). O HTML traz o texto em inglês como
fallback; o JS aplica o idioma escolhido no botão PT/EN (salvo no navegador)
ou, na primeira visita, o idioma do navegador (PT por padrão).

### 2. Links do Google Play
Arquivo: `index.html`

- **Khronus** — `com.auryonsoftware.appblockerservice` (hero, seção do produto e "Sobre")
- **Retro Talks** — `com.auryonsoftware.retrotalks` (seção "Mais apps" e "Sobre")

### 3. Adicionar um app
Na seção `#apps` do `index.html`, cada `<a class="app-row">` é um app.
Copie um bloco, ajuste nome, link e categoria, e crie as chaves de tradução
correspondentes no `js/i18n.js`. Lembre de incluir o app também no bloco
"Nossos apps" da seção `#about`.

### 4. Contato
E-mail e telefone ficam na seção `#contact` do `index.html`.

### 5. Política de privacidade
Arquivo: `privacy.html`

O Google Play aponta para `https://auryonsoft.com.br/privacy.html`, então não
renomeie nem mova esse arquivo.

A política existe em português e em inglês no próprio `privacy.html`: cada
versão fica em elementos com `data-lang-only="pt"` ou `data-lang-only="en"`, e
só a do idioma ativo aparece. Ao alterar o texto de uma, altere a outra também.

### 6. Screenshots reais
O mockup de celular é 100% HTML/CSS (não usa imagens). Se quiser trocar
por screenshots reais do app:

1. Salve as PNGs numa pasta `assets/`
2. No `index.html`, substitua o bloco `.phone-content` por:
   ```html
   <img src="assets/khronus-screenshot.png" alt="Khronus" style="width:100%;height:100%;object-fit:cover;border-radius:32px;" />
   ```

## Publicação

O site é estático e está no GitHub Pages com domínio próprio (arquivo
`CNAME`). Depois de um push na `main`, o GitHub Pages publica a nova versão.

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
- Cursor customizado é desabilitado em telas < 900px
- Animações GSAP têm fallback em IntersectionObserver se as libs falharem
- Fontes carregadas do Google Fonts com `preconnect`

## Licença

Código livre pra você usar como quiser. As libs (three.js, gsap) têm suas
próprias licenças — checar os sites oficiais.
