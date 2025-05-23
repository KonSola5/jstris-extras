export function multiline(strings: TemplateStringsArray, ...values: unknown[]) {
  let output = "";
  strings.forEach((string, i) => {
    output += string + (values[i] ?? "");
  });
  output = output.replace(/ {2,}|\t+/g, "").trim();
  return output;
}
