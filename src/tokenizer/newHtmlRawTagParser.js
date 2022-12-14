import readHtmlTag from "./readHtmlTag.js";
import newSkipParser from "./newSkipParser.js";

export default function newHtmlRawTagParser(...tagNames) {
  const set = tagNames.reduce((set, name) => (set.add(name), set), new Set());
  return (str, i) => {
    const openTag = readHtmlTag(str, i);
    if (!openTag) return;
    if (!set.has(openTag.name)) return;
    i = openTag.end;
    const token = {
      type: "HtmlRawTag",
      open: openTag,
      close: null,
      contentStart: openTag.end,
      contentEnd: openTag.end,
      content: [],
      start: openTag.start,
      end: openTag.end,
    };
    if (!openTag.closing) {
      let closingTag;
      const readTagContent = newSkipParser("", (str, i) => {
        if (str[i] !== "<" || str[i + 1] !== "/") return;
        const t = readHtmlTag(str, i);
        if (!t || !t.closing || t.name !== openTag.name) return;
        closingTag = t;
        return t;
      });
      const content = readTagContent(str, i);
      if (content) {
        token.contentStart = content.contentStart;
        token.contentEnd = content.contentEnd;
        token.content = content.content;
        token.end = content.end;
        if (closingTag) {
          token.close = closingTag;
        }
      }
    }
    return token;
  };
}
