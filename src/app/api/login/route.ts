// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import connectToDatabase from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        //@ts-ignore
        const isMatch = await userData.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: userData._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const user = {
            _id: userData._id,
            email: userData.email,
            username: userData.username,
            isAdmin: userData.isAdmin
        }
        return NextResponse.json({ token, user });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 });
    }
}
