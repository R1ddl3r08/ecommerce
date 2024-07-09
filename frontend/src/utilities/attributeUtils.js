export function groupAttributesBySet(attributes) {
    return attributes.reduce((acc, attribute) => {
      const setName = attribute.attribute_set.name;
      if (!acc[setName]) {
        acc[setName] = [];
      }
      acc[setName].push(attribute);
      return acc;
    }, {});
}

export const normalizeAttributes = (attributes) => {
  const sortedKeys = Object.keys(attributes).sort();
  const normalizedAttributes = {};

  sortedKeys.forEach((key) => {
    normalizedAttributes[key] = attributes[key];
  });

  return normalizedAttributes;
};


