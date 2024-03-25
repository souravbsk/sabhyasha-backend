const slugify = require('slugify')
const slugGenerate = async (value, collection) => {
    try {
        let generateSlugUrl = await slugify(value, {
            replacement: '-',
            lower: true,
            strict: false,
        })

        const existingValue = await collection?.find({ slug: generateSlugUrl }).toArray();

        if (existingValue?.length > 0) {
            const totalCount = await collection.countDocuments();
            let newSlug = generateSlugUrl;
            while (existingValue.find(existValue => existValue.slug == newSlug)) {
                newSlug = `${generateSlugUrl}-${totalCount}`;
            }
            console.log(newSlug)
            generateSlugUrl = newSlug;
        }
        return generateSlugUrl

    } catch (error) {
        throw error;
    }
}

module.exports = slugGenerate;