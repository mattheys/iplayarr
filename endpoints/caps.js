import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (req, res) => {
    try {
        const filePath = join(__dirname, "../static/caps.xml");
        const data = await readFile(filePath, "utf8");
        res.set("Content-Type", "application/xml");
        res.send(data);
    } catch (err) {
        res.status(500).send("Error reading file");
    }
}