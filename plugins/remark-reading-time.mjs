import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
  return (tree, { data }) => {
    const text = toString(tree);
    data.astro.frontmatter.minutesRead = Math.max(1, Math.round(getReadingTime(text).minutes));
  };
}
