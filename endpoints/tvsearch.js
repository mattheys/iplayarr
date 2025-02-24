import { Builder } from "xml2js";
import iplayerService from "../service/iplayerService.js";

export default async (req, res) => {
    const {q, season, episode} = req.query;
    const searchTerm = q ?? '*' +(season ? ` Series ${season}` : '') + (episode ? ` Episode ${episodoe}` : ''); 
    const results = await iplayerService.search(searchTerm);

    const date = new Date();
    date.setMinutes(date.getMinutes() - 720);

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
                item: results.map(({show, id, nzbName}) => (
                    {
                        title: nzbName,
                        description: nzbName,
                        guid: `https://www.bbc.co.uk/iplayer/episodes/${id}`,
                        size: "2147483648",
                        category: ["5000", "5040"],
                        pubDate,
                        "newznab:attr": [
                          { $: { name: "category", value: "5000" } },
                          { $: { name: "category", value: "5040" } },
                        //   { $: { name: "tvdbid", value: "326124" } },
                          { $: { name: "language", value: "English" } },
                          { $: { name: "files", value: "0" } },
                          { $: { name: "grabs", value: "0" } }
                        ],
                        link: `http://192.168.1.19:3000/api/download/${id}`,
                        enclosure: {$:{url : `http://192.168.1.19:3000/api/download/${id}`, length : "2147483648", type: "application/x-nzb"} } 
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