import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAddress {
    name: string;
    place: string;
    address: string;
    phone: string;
    email: string;
    city: string;
}

export interface IAddressSchema extends IAddress, Document {
    userId?: Schema.Types.ObjectId
}

const addressSchema = new Schema<IAddressSchema>({
    name: { type: String, required: true },
    place: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    }
}, {
    timestamps: true,
})

const Address: Model<IAddress> = mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);

export default Address;
