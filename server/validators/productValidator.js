export default function validateProduct(product) {
  if (product.name.length < 2 || product.name.length > 150) return { err: 'Name does not meet requirements' };
  if (product.description.length > 500) return { err: 'Description exceeds permitted length of 500 characters' };
  if (product.price <= 0) return { err: 'Price incorrectly set' };
  if (product.number_in_stock <= 0) return { err: 'Stock incorrectly set' };
  if (product.genres.length <= 0) return { err: 'Minimum genres not met' };
  if (
    product.type.length <= 0
      || !['hardware', 'video/disc', 'game/disc', 'book'].includes(product.type.toLowerCase())
  ) return { err: 'Invalid product type chosen' };
  return true;
}
