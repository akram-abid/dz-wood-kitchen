export const processLocationData = (rawData) => {
  const wilayas = [];
  const dairas = [];
  const communes = [];

  // Use a Set to avoid duplicates
  const wilayaSet = new Set();
  const dairaSet = new Set();

  rawData.forEach(item => {
    // Process wilaya
    if (!wilayaSet.has(item.wilaya_code)) {
      wilayaSet.add(item.wilaya_code);
      wilayas.push({
        id: item.wilaya_code,
        name: item.wilaya_name_ascii,
        name_ar: item.wilaya_name
      });
    }

    // Process daira
    const dairaKey = `${item.wilaya_code}-${item.daira_name_ascii}`;
    if (!dairaSet.has(dairaKey)) {
      dairaSet.add(dairaKey);
      dairas.push({
        id: dairas.length + 1, // or use a more unique identifier if needed
        wilaya_id: item.wilaya_code,
        name: item.daira_name_ascii,
        name_ar: item.daira_name
      });
    }

    // Process commune
    communes.push({
      id: item.id,
      daira_id: dairas.find(d => d.name === item.daira_name_ascii && d.wilaya_id === item.wilaya_code)?.id || 0,
      name: item.commune_name_ascii,
      name_ar: item.commune_name
    });
  });

  return { wilayas, dairas, communes };
};

export default processLocationData;