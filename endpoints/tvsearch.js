export default async (req, res) => {
    import { Builder } from "xml2js";

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
      item: []
    }
  }
};

const builder = new Builder({ headless: false, xmldec: { version: "1.0", encoding: "UTF-8" } });
const xml = builder.buildObject(json);

console.log(xml);

}