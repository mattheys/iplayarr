import { Builder } from "xml2js";
import iplayerService from "../service/iplayerService.js";

export default async (req, res) => {
    const {q} = req.query;
    const searchTerm = q ?? '*';
    const results = await iplayerService.search(searchTerm);

    const date = new Date();
    date.setMinutes(date.getMinutes() - minutesAgo);

    const pubDate = date.toUTCString().replace("GMT", "+0000");

    const json = {
        rss: {
            $: {
                version: "1.0",
                "xmlns:atom": "http://www.w3.org/2005/Atom",
                "xmlns:newznab": "http://www.newznab.com/DTD/2010/feeds/attributes/"
            },
            channel: {
                "atom:link": { $: { rel: "self", type: "application/rss+xml" } },
                title: "iPlayarr",
                item: results.map(({show, id}) => (
                    {
                        title: show,
                        description: show,
                        guid: `https://www.bbc.co.uk/iplayer/episodes/${id}`,
                        size: "1073741824",
                        category: ["5000"],
                        pubDate,
                        "newznab:attr": [
                          { $: { name: "category", value: "5000" } }
                        ]
                      }
                ))
            }
        }
    };

    const builder = new Builder({ headless: false, xmldec: { version: "1.0", encoding: "UTF-8" } });
    const xml = builder.buildObject(json);

    res.set("Content-Type", "application/xml");
    res.send(xml);
}