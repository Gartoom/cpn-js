// Modified 2026-10-28. AGPL-3.0; see LICENSE.
// Read-only rendering: never parse this combined view back into the model.
export function declarationOverview(globbox: any, format: (type: string, node: any) => string): string {
  if (!globbox) return "";
  const sections: string[] = [];
  const list = (value: any) => value == null ? [] : Array.isArray(value) ? value : [value];
  const label = (value: any) => String(value || "Unnamed block").replace(/\(\*/g, "( *").replace(/\*\)/g, "* )");
  const walk = (block: any, path: string[]) => {
    if (!block || typeof block !== "object") return;
    const names = block === globbox ? path : path.concat(label(block.id));
    const heading = () => "(* " + (names.join(" / ") || "Declarations") + " *)";
    let headingAdded = false;
    Object.keys(block).forEach(type => {
      if (type === "block") {
        list(block.block).forEach(child => walk(child, names));
        headingAdded = false;
      } else if (["globref", "color", "var", "ml"].includes(type)) {
        list(block[type]).forEach(node => {
          const code = format(type, node);
          if (code) {
            if (!headingAdded) { sections.push(heading()); headingAdded = true; }
            sections.push(code);
          }
        });
      }
    });
  };
  walk(globbox, []);
  return sections.join("\n\n");
}
