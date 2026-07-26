import { visit } from 'unist-util-visit';

// 마크다운 이미지 크기를 alt 텍스트로 지정한다 (Obsidian 표기).
//   ![설명|400](image.png)      -> width=400 (세로는 비율 자동)
//   ![설명|400x260](image.png)  -> width=400 height=260
// 크기 토큰은 alt에서 제거되어 접근성 텍스트에는 남지 않는다.
// 캡션(figure/figcaption)은 remark-image-figure가 담당한다.
const SIZE_PATTERN = /^(.*?)\s*\|\s*(\d+)(?:x(\d+))?\s*$/;

export default function rehypeImageSize() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;

      const alt = node.properties?.alt;
      if (typeof alt !== 'string') return;

      const match = alt.match(SIZE_PATTERN);
      if (!match) return;

      const [, cleanAlt, width, height] = match;
      node.properties.alt = cleanAlt;
      node.properties.width = Number(width);
      if (height) node.properties.height = Number(height);
    });
  };
}
