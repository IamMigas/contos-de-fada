# Contos de Fada · Atlas 3.0.0

Aplicação estática para GitHub Pages. Mantém as receitas base e quantidades originais.

## Publicar esta atualização

1. Extrai o ZIP. O `index.html` encontra-se diretamente na raiz do ZIP.
2. No repositório `IamMigas/contos-de-fada`, abre **Code → Add file → Upload files**.
3. Envia **todo o conteúdo extraído**, incluindo `assets` e `data`, para a raiz. Não envies o ZIP nem uma pasta exterior. Esta atualização precisa dos novos ficheiros, não basta enviar index.html.
4. Clica em **Commit changes**. Não apagues os dados no navegador.
5. Em **Actions**, espera que a publicação mais recente termine com visto verde.
6. Abre https://iammigas.github.io/contos-de-fada/ e atualiza com Ctrl+F5.
7. Confirma que aparece **ATLAS · EDIÇÃO 03** por baixo do cabeçalho.

Mantém **Settings → Pages → Deploy from a branch → main → /(root)**. Não precisa de Cloudflare nem de serviços pagos.

## Utilizar

- Pesquisa e filtra receitas por favoritas, selecionadas ou com localização.
- Seleciona itens, ajusta quantidades e indica os componentes que já tens.
- Na lista de recolha, regista os materiais brutos obtidos. As quantidades são persistentes e partilhadas entre categorias. Não há consumo automático ao fabricar: atualiza o inventário após usar materiais.
- **Ver no mapa** seleciona a arma, abre o mapa e centra o local. Selecionar uma receita por si só não abre o mapa.
- Sem armas selecionadas não há marcadores de craft. Marcadores pessoais são independentes.
- Locais partilhados usam um marcador único. Abre o marcador para ver os nomes e a imagem de referência.
- O mapa carrega apenas quando o abres e usa blocos conforme a zona e o zoom. Roda do rato, botões +/−, setas no teclado e gesto com dois dedos. O limite de zoom respeita os 7200 × 5400 píxeis da fonte; não há detalhe inventado.
- Ativa **Adicionar marcador** antes de clicar no mapa para criar um ponto.
- Guarda conjuntos de seleção e carrega-os mais tarde. Favoritas, inventário e seleção ficam guardados automaticamente.
- Exporta uma cópia JSON regularmente. Importar substitui os dados atuais, mediante confirmação. Cópias inválidas são rejeitadas.
- **Desfazer** recupera a última eliminação ou limpeza durante a sessão e recarrega a página.

## Dados e limitações

Os dados são pessoais e ficam no navegador, neste domínio. Não há contas ou sincronização entre utilizadores/dispositivos. Exportar/importar permite transferi-los manualmente. Não existe servidor de autenticação neste pacote; partilha automática e permissões exigem um serviço de backend e uma decisão sobre quem pode ler e editar.

As localizações foram fornecidas por imagens do utilizador e alinhadas com o mapa; não foram verificadas dentro do jogo. A receita de **Remington 1858 não foi fornecida**: a localização está preparada para uma receita personalizada com esse nome, mas não foram inventados materiais.

Os testes de integração verificam cálculo, persistência, seleção, favoritos, referências, grupos de marcadores e validação de backups. A pré-visualização num navegador real não estava disponível no ambiente de preparação; confirmar o aspeto final no computador e telemóvel após publicação.

## Estrutura e manutenção

- `index.html`: interface e calculadora original, corrigida.
- `data/recipes.js`: receitas base; preservar os nomes e quantidades.
- `data/recipes-baseline.json`: valores de referência para validação.
- `data/locations.js`: posições e metadados dos locais.
- `assets/pro.js`, `assets/atlas.js`, `assets/atlas.css`: experiência e persistência da oficina.
- `assets/map-tiles.js`, `assets/tiles`: mapa progressivo.
- `assets/reference-*.png`: imagens dos pontos fornecidas pelo utilizador.

Antes de publicar alterações, com Node.js instalado, executa `node validate.mjs` nesta pasta. O comando verifica as receitas contra a referência, coordenadas, sintaxe e presença de ficheiros/blocos do mapa. Se uma receita base mudar legitimamente, atualizar a referência deve ser uma decisão explícita.

## Créditos

Mapa: GTA Base / Rockstar Games. Ver `assets/map-source.md`. Mantidas as marcas da imagem original. Visual Contos de Fada preservado.

## Interface Atlas 3.0

Nova direção visual: navegação lateral verde, superfície marfim, tipografia editorial, acesso ao mapa no cabeçalho e ferramentas recolhidas em «O teu caderno». O tema escuro está disponível em «Alternar ambiente». A versão 3.0.0 é visível no rodapé e no caderno. As funções da versão 2.0 foram mantidas.
