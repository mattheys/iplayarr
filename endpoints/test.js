import queueService from "../service/queueService.js";

export default (req, res) => {
    const {pid, name} = req.query;

    queueService.addToQueue(pid, name);

    res.status(200).send({status: 'OK'});
}