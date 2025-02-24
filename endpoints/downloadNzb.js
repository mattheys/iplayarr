import { Builder } from "xml2js";

export default async (req, res) => {
    const { pid } = req.query;

    const date = new Date();
    date.setMinutes(date.getMinutes() - 720);

    const builder = new Builder({
        headless: true,
        renderOpts: { pretty: true }
    });

    const json = {
        nzb: {
            $: { xmlns: "http://www.newzbin.com/DTD/2003/nzb" },
            head: {
                title: pid
            },
            file: {
                $: {
                    poster: "iplayer@bbc.com",
                    date: date.getTime(),
                    subject: `${pid}.mp4`
                },
                groups: {
                    group: ["alt.binaries.example"]
                },
                segments: {
                    segment: [
                        { _: `${pid}@news.example.com`, $: { bytes: "2147483648", number: "1" } }
                    ]
                }
            }
        }
    };

    const xml = builder.buildObject(json);
    const finalXml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
                     `<!DOCTYPE nzb PUBLIC "-//newzBin//DTD NZB 1.1//EN" "http://www.newzbin.com/DTD/2003/nzb-1.1.dtd">\n` +
                     xml;

    res.set("Content-Type", "application/x-nzb");
    res.send(finalXml);
};
