export default async (_, res) => {
    const missing = await sonarrService.getMissing();
    res.json(missing);
}