export default function imageKitLoader({ src, width, quality }) {
  const params = [`w-${width}`, `q-${quality || 80}`];
  return `${src}?tr=${params.join(",")}`;
}
