import { visit } from 'unist-util-visit';

// 이미지 하나만 담은 문단에서 이미지 title을 캡션으로 승격한다.
//   ![설명](image.png "그림 1. 캡션") -> <figure><img><figcaption>캡션</figcaption></figure>
// rehype가 아닌 remark(콘텐츠 단계)에서 처리해야 dev/build 모두 일관되게 유지된다.
// (dev의 Astro 이미지 파이프라인은 rehype 단계 이후 <p> 컨테이너를 재구성한다.)
const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function remarkImageFigure() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      const meaningful = node.children.filter(
        (child) => !(child.type === 'text' && child.value.trim() === ''),
      );
      if (meaningful.length !== 1 || meaningful[0].type !== 'image') return;

      const image = meaningful[0];
      const caption = image.title;
      if (!caption) return;

      image.title = null;
      const replacement = [
        { type: 'html', value: '<figure class="note-figure">' },
        image,
        { type: 'html', value: `<figcaption>${escapeHtml(caption)}</figcaption></figure>` },
      ];
      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
