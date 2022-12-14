import readEol from "./readEol.js";
import readHtmlAttributeValue from "./readHtmlAttributeValue.js";
import readMdBlockPropertyName from "./readMdBlockPropertyName.js";
import readSpaces from "./readSpaces.js";

export default function readMdBlockProperty(str, i) {
  const token = readMdBlockPropertyName(str, i);
  if (!token) return;
  token.type = "MdBlockProperty";
  i = token.end;

  const value = token.value = [];
  token.valueStart = i;

  let textStart = i;
  const flushText = () => {
    if (i > textStart) {
      value.push(str.substring(textStart, i));
      textStart = i;
    }
  };
  while (i < str.length) {
    let spaces = readSpaces(str, i);
    if (spaces) {
      i = spaces.end;
    }
    let eol = readEol(str, i);
    if (eol) {
      i = eol.end;
      if (eol.count > 1) {
        // Stop if there is more than one EOL
        break;
      }

      // Stop if the next line starts with a new property name
      const nextName = readMdBlockPropertyName(str, i);
      if (nextName) break;

      // Append whitespaces after the EOL
      spaces = readSpaces(str, i);
      if (spaces) i = spaces.end;
    }
    const t = readHtmlAttributeValue(str, i, []);
    if (!t) break;
    flushText();
    value.push(...t.value);
    i = textStart = t.end;
  }
  flushText();
  token.valueEnd = i;
  token.end = i;
  return token;
}
