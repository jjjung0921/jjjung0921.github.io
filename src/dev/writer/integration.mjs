// `npm run dev`에서만 /_write/ 작성 화면과 저장 API를 붙인다. 정적 빌드에는 들어가지 않는다.
export default function devWriter() {
  return {
    name: 'dev-writer',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return;
        injectRoute({ pattern: '/_write', entrypoint: './src/dev/writer/page.ts', prerender: false });
        injectRoute({ pattern: '/_write/api', entrypoint: './src/dev/writer/api.ts', prerender: false });
      },
    },
  };
}
