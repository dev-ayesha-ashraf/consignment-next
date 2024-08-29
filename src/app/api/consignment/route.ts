import { NextRequest, NextResponse } from 'next/server';
import Address from '@/models/Address';
import mongoose from 'mongoose';
import Consignment from '@/models/Consignment';
import ConsignmentStatus from '@/models/ConsignmentStatus';
const JWT_SECRET = process.env.JWT_SECRET as string;
import jwt from 'jsonwebtoken';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {

        //TODO : GET USER FROM SESSION
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // @ts-ignore
        const user = await User.findOne({ _id: decoded.userId }).select("-password")
        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }


        const { pickUp, dropOff, weight,
            deliveryType,
            type,
            COD } = await req.json();
        if (!pickUp || !dropOff) {
            return NextResponse.json({ error: 'Pick-up and drop-off coordinates are required' }, { status: 400 });
        }
        //@ts-ignore
        const userId = new mongoose.Types.ObjectId(user._id);
        const pickUpAddress = new Address({ ...pickUp, userId });
        const dropOffAddress = new Address({ ...dropOff, userId });
        const newPickUp = await dropOffAddress.save();
        const newDropOff = await pickUpAddress.save();
        const minPrice = Number(process.env.MINIMUM_PRICE);
        const status = "Ready for Pickup"
        const price = weight < 2 ? Number(process.env.MINIMUM_PRICE) : ((weight - 1) * 30) + minPrice
        const consignmentData = new Consignment({
            pickUpId: newPickUp._id,
            dropOffId: newDropOff._id,
            userId: userId,
            weight,
            deliveryType,
            type,
            COD,
            price,
            status,
        })
        const consignment = await consignmentData.save();
        const newConsignmentData = new ConsignmentStatus(
            {
                consignmentId: consignment._id,
                status
            }
        )
        await newConsignmentData.save()
        return NextResponse.json({ consignment });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}

export async function GET(req: NextRequest) {
    try {
        //TODO : GET USER FROM SESSION
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // @ts-ignore
        const user = await User.findOne({ _id: decoded.userId }).select("-password")
        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }



        if (user.isAdmin) {
            const consignments = await Consignment.find().populate('pickUpId dropOffId userId')
            return NextResponse.json({ consignments });
        }
        const consignments = await Consignment.find({
            userId: user._id,
        }).populate('pickUpId dropOffId')
        return NextResponse.json({ consignments });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        //TODO : GET USER FROM SESSION
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // @ts-ignore
        const user = await User.findOne({ _id: decoded.userId }).select("-password")
        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { status, consignmentId } = await req.json();
        if (!consignmentId || !status) {
            return NextResponse.json({ error: 'Status and Consignment Id Required' }, { status: 401 });
        }


        if (user.isAdmin) {
            const consignment = await Consignment.findOne({ _id: consignmentId });
            if (!consignment) {
                return NextResponse.json({ error: 'Consignment not found' }, { status: 404 });
            }
            const newConsignmentData = new ConsignmentStatus(
                {
                    consignmentId: consignment._id,
                    status
                }
            )
            await newConsignmentData.save()
            const updatedConsignment = await Consignment.findByIdAndUpdate(consignment._id, { status }, { new: true })
            return NextResponse.json({ consignment: updatedConsignment });
        } else {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 401 });
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}




