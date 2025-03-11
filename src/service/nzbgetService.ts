import axios, { AxiosResponse } from 'axios';

import { IplayarrParameter } from '../types/IplayarrParameters';
import { getParameter } from './configService';
import { NZBGetAppendRequest } from '../types/requests/nzbget/NZBGetAppendRequest';
import { v4 } from 'uuid';

const nzbGetService = {
    test: async (): Promise<boolean> => {
        const url = await getParameter(IplayarrParameter.NZB_URL);
        const username = await getParameter(IplayarrParameter.NZB_USERNAME);
        const password = await getParameter(IplayarrParameter.NZB_PASSWORD);
        if (url && username && password) {
            const result = await nzbGetService.testConnection(url, username, password);
            if (result == true) {
                return true;
            }
        }
        return false;
    },

    testConnection: async (inputUrl: string, username: string, password: string): Promise<string | boolean> => {
        const url = new URL(`${inputUrl}/jsonrpc`);
        url.username = username;
        url.password = password;

        try {
            const response = await axios.get(`${url.toString()}/version`);
            if (response.status == 200) return true;
            return false;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return error.message;
            }
            return false;
        }
    },

    addFile: async (files: Express.Multer.File[]): Promise<AxiosResponse> => {
        const inputUrl = await getParameter(IplayarrParameter.NZB_URL);
        const username = await getParameter(IplayarrParameter.NZB_USERNAME) as string;
        const password = await getParameter(IplayarrParameter.NZB_PASSWORD) as string;

        const url = new URL(`${inputUrl}/jsonrpc`);
        url.username = username;
        url.password = password;

        const file = files[0];
        const appendRequest: NZBGetAppendRequest = {
            NZBFilename: '',
            Content: file.buffer.toString('base64'),
            Category: 'iplayer',
            Priority: 0,
            AddToTop: false,
            AddPaused: false,
            DupeKey: v4(),
            DupeScore: 1000,
            DupeMode: 'force',
            PPParameters: []
        }

        const response = await axios.post(`${url}/append`, appendRequest);

        return response;
    }
}

export default nzbGetService;