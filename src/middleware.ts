// Importing NextRequest and NextResponse to handle incoming requests and generate responses in Next.js middleware
import { NextRequest, NextResponse } from 'next/server';
// Importing jwtVerify to validate JWT tokens
import { jwtVerify } from 'jose';

// Encoding the secret key from environment variable for JWT verification
const secret = new TextEncoder().encode(process.env.SECRET_KEY);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token')?.value;

    // Allow API requests under /api/user to pass through without token verification
    console.log(pathname);
    
    if (pathname.startsWith('/api/user') || !pathname.includes('api')) {
        return NextResponse.next();
    }

    console.log('token', token);

    // If token is missing, return an unauthorized response
    if (!token) {
        console.log('pathname', pathname);
        return NextResponse.json({ error: 'Unauthorized', loggedIn: false }, { status: 401 });
    }

    try {
        // Verifying the JWT token and extracting the payload
        const { payload }: { payload: { user: string } } = await jwtVerify(token, secret);

        // If user info is missing in payload, throw error
        if (!payload?.user) throw new Error('Invalid payload');

        // Set user-id header and allow the request to continue
        const res = NextResponse.next();
        console.log('Set user id');        
        res.headers.set('user-id', payload.user);

        return res;
    } catch (error: any) {
        // If token verification fails, return an unauthorized response with error message
        return NextResponse.json(
            { error: error.message },
            { status: 401 }
        );
    }
}
