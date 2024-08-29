import { IConsignment } from '@/models/Consignment';
import httpService, { API_ENDPOINTS, API_METHODS } from '@/services/httpService';
import { useState } from 'react';

export enum ConsignmentType {
    LOCAL = "LOCAL",
    DOMESTIC = "DOMESTIC",
    INTERNATIONAL = "INTERNATIONAL"
}

export enum ConsignmentDelivery {
    SAME_DAY = "SAME_DAY",
    NEXT_DAY = "NEXT_DAY",
    OVERNIGHT = "OVERNIGHTz"
}

export interface IUpdateConsignment {
    consignmentId: string;
    status: string;
}

const useConsignment = () => {
    const [consignments, setConsignments] = useState<IConsignment[]>([])
    const [data, setData] = useState<IUpdateConsignment>({
        consignmentId: "",
        status: ""
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const create = async (consignment: IConsignment) => {
        const data = await httpService.call({
            message: "Consignment Creation Failed",
            data: consignment,
            method: API_METHODS.POST,
            url: API_ENDPOINTS.CONSIGNMENT,
        });
    };

    const getAll = async () => {
        const data = await httpService.call({
            method: API_METHODS.GET,
            url: API_ENDPOINTS.CONSIGNMENT,
        });
        if (data.consignments) {
            setConsignments(data.consignments)
        }
    };

    const update = async () => {
        await httpService.call({
            method: API_METHODS.PUT,
            url: API_ENDPOINTS.CONSIGNMENT,
            data
        });
    };

    return {
        create,
        getAll,
        consignments,
        update,
        handleChange,
        data
    }

}

export default useConsignment