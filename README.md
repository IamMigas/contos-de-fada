# Contos de Fada — GitHub Pages

Versão estática para publicar diretamente num repositório público com GitHub Pages. Não precisa de Cloudflare, R2, Node.js, comandos de build ou cartão de pagamento para GitHub Pages num repositório público com GitHub Free.

## Substituir a versão anterior

1. Extrai este ZIP.
2. No repositório `IamMigas/contos-de-fada`, abre **Code → Add file → Upload files**.
3. Arrasta o conteúdo da pasta `contos-de-fada-pages`: `index.html`, `assets/`, `README.md` e `.nojekyll`.
4. Aceita a substituição dos ficheiros com o mesmo nome e clica **Commit changes**.
5. Os antigos `worker/`, `wrangler.jsonc`, `build.mjs`, `package.json` e testes não são usados por esta versão. Podem ficar no repositório por agora; não é necessário executá-los.

Não coloques a pasta `contos-de-fada-pages` inteira dentro do repositório: `index.html` tem de ficar na raiz.

## Ativar o site

1. Abre **Settings → Pages**.
2. Em **Source**, escolhe **Deploy from a branch**.
3. Escolhe a branch **main** e a pasta **/(root)**.
4. Clica **Save**.
5. Aguarda a publicação. O GitHub mostrará o endereço em **Pages → Visit site**.

Para o repositório `IamMigas/contos-de-fada`, o endereço esperado é `https://iammigas.github.io/contos-de-fada/`. O estado da publicação pode ser visto no separador Actions. Atualizar `main` volta a publicar o site.

## O que funciona

- Todas as receitas base e quantidades originais.
- Calculadora, quantidades e desconto dos componentes que já tens.
- Imagens da marca, mapa HD, mapa original e zoom.
- Local da Mauser visível apenas quando a arma está selecionada.
- Receitas personalizadas e marcadores guardados no navegador através de localStorage.

## Como os dados são guardados

Esta versão não depende de um servidor para guardar os dados. Por isso:

- Os dados de cada utilizador são independentes.
- Não há partilha automática entre pessoas, navegadores ou dispositivos.
- Limpar os dados do site pode apagar as receitas personalizadas e os marcadores.
- Navegação privada pode não conservar os dados ao fechar a janela.
- As seleções da calculadora continuam temporárias; as receitas personalizadas e marcadores são persistidos.
- Não copia os dados personalizados do site anterior. As receitas base e o local da Mauser estão incluídos no código.

O site e as imagens ficam acessíveis publicamente pelo GitHub Pages. Não existe autenticação ChatGPT nesta versão.

## Créditos

Mapa: Rockstar Games, compilação GTA Base. Créditos e marcas originais preservados. Imagem Contos de Fada gerada para o projeto. Fontes carregadas através de Google Fonts.

Documentação: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
