import readHtmlToken from "./readHtmlToken.js";

export default function* splitToHtmlTokens(str, i = 0) {
  let textStart = i;
  const getTextToken = () => {
    let t;
    if (i > textStart) {
      t = {
        type: "Text",
        text: str.substring(textStart, i),
        start: textStart,
        end: i,
      };
    }
    textStart = i;
    return t;
  };
  for (; i < str.length; i++) {
    const t = readHtmlToken(str, i);
    if (t) {
      const textToken = getTextToken();
      if (textToken)
        yield textToken;
      yield t;
      textStart = i = t.end;
      i--;
    }
  }
  const textToken = getTextToken();
  if (textToken)
    yield textToken;
}
