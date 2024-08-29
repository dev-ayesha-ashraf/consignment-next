import mongoose, { Model, Schema } from 'mongoose';

export interface IConsignmentStatus {
    status: string;
    consignmentId: Schema.Types.ObjectId;
}

const consignmentStatusSchema = new Schema<IConsignmentStatus>({
    consignmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Consignment',
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

const ConsignmentStatus: Model<IConsignmentStatus> = mongoose.models.ConsignmentStatus || mongoose.model<IConsignmentStatus>('ConsignmentStatus', consignmentStatusSchema);

export default ConsignmentStatus;
