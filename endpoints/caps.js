import { Builder } from "xml2js";

export default async (req, res) => {
    const json = {
        caps: {
            server: { $: { title: "iPlayarr" } },
            limits: { $: { default: "100", max: "100" } },
            searching: {
                search: { $: { available: "yes", supportedParams: "q" } },
                "tv-search": { $: { available: "yes", supportedParams: "q,season,ep" } },
                "movie-search": { $: { available: "no", supportedParams: "q" } },
                "music-search": { $: { available: "no", supportedParams: "q" } },
                "audio-search": { $: { available: "no", supportedParams: "q" } },
                "book-search": { $: { available: "no", supportedParams: "q" } }
            },
            categories: {
                category: [
                    { $: { id: "0", name: "Other" } },
                    { $: { id: "2000", name: "Movies" } },
                    { $: { id: "5000", name: "TV" }, subcat: [
                        { $: { id: "5040", name: "TV/HD" } }
                    ]}
                ]
            },
            tags: ""
        }
    };

    const builder = new Builder({ headless: true });
    const xml = builder.buildObject(json);
    res.set("Content-Type", "application/xml");
    res.send(xml);
}