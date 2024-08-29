import { IAddress } from '@/models/Address'
import { useState } from 'react'


const useAddress = () => {
    const initialState = {
        name: "",
        place: "",
        address: "",
        phone: "",
        email: "",
        city: "",
    }
    const [address, setAddress] = useState<IAddress>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return {
        address, handleChange
    }
}

export default useAddress