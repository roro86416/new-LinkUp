import DOMPurify from "isomorphic-dompurify";

export function sanitizeHTML(html: string) {
  return DOMPurify.sanitize(html);
}
