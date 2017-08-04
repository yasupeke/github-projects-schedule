const REG_TITLE_DATE = new RegExp(/^\[(\d{4}-\d{2}-\d{2})\]/);


export function extractDate(title: string): string | null {
  const date = title.match(REG_TITLE_DATE);
  if (!date) return null;
  return date[1];
}

export function replaceDate(title: string, dateStr: string): string {
  if (!REG_TITLE_DATE.test(title)) {
    return `[${dateStr}]${title || ''}`;
  }
  return title.replace(REG_TITLE_DATE, `[${dateStr}]`);
}