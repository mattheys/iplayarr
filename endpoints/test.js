import iplayerService from "../service/iplayerService.js"

export default async (req, res) => {
    const response = await iplayerService.download("m00276xl");
    res.json({response});
}