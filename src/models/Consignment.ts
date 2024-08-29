import mongoose, { Document, Model, Schema } from 'mongoose';
import { IAddress } from "./Address"

export interface IBaseConsignment {
    weight: number;
    deliveryType: string;
    type: string;
    COD: number;
}

export interface IConsignment extends IBaseConsignment {
    pickUp: IAddress;
    dropOff: IAddress
}

export interface IConsignmentSchema extends IBaseConsignment, Document {
    userId: Schema.Types.ObjectId;
    price: number;
    status: string;
    pickUpId: Schema.Types.ObjectId;
    dropOffId: Schema.Types.ObjectId
}

const consignmentSchema = new Schema<IConsignmentSchema>({
    pickUpId: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    dropOffId: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    deliveryType: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    COD: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
})

const Consignment: Model<IConsignmentSchema> = mongoose.models.Consignment || mongoose.model<IConsignmentSchema>('Consignment', consignmentSchema);

export default Consignment;
