const slugify = require('slugify')
const slugGenerate = async (value, collection) => {
    const generateSlugUrl = await slugify(value, {
        replacement: '-',
        lower: true,
        strict: false,
    })

    const existingValue = await collection.find({ slug: generateSlugUrl }).toArray();
    if (existingValue.length > 0) {
        const totalCount = await collection.countDocuments();
        let newSlug = generateSlugUrl;
        while (existingValue.find(existValue => existValue.slug === newSlug)) {
            newSlug = `${generateSlugUrl}-${totalCount}`;
        }
        generateSlugUrl = newSlug;
    }
    return generateSlugUrl
}

module.exports = slugGenerate;