/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desliga o cache de navegação client-side para páginas dinâmicas.
  // Sem isso, o Next.js reaproveita a versão da página em cache por até
  // 30s ao navegar pelo menu, mostrando dado desatualizado logo após uma
  // importação ou um novo lançamento (o dado no banco já está certo — o
  // problema é só a tela reaproveitada).
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};
export default nextConfig;
