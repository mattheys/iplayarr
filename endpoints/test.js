import iplayerService from "../service/iplayerService.js"

export default async (req, res) => {
    const response = iplayerService.download("m0026ywz", "testFile");
    res.json({response});
}