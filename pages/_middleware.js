import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req){
    //Token exists if user logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { url:pathname } = req

    //Allow requests if following is true
    //If its authentication request or token exists
    if(pathname.includes(`/api/auth`) || (token && pathname!==`/login`) ){
        return NextResponse.next();
    }
    else if(token && pathname===`/login`){
        return NextResponse.redirect(`/`)
    }    
    else if(pathname.includes(`/static`)){
        return NextResponse.next()
    }
    //Redirect to login if token does not exist AND requesting protected routes
    else if(!token && (pathname !== `/login`)){
        return NextResponse.redirect(`/login`);
    }
}