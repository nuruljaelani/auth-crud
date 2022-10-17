import { NextResponse } from "next/server"

export function middleware(request) {
	const {cookies} = request
	const jwt = cookies.get('token')

	if(request.nextUrl.pathname == '/') {
		if(jwt) {
			return NextResponse.redirect(new URL("/dashboard", request.url))
		}
	}

	if(request.nextUrl.pathname.startsWith('/dashboard')) {
		if(!jwt) {
			return NextResponse.redirect(new URL("/", request.url))
		}
	}

	if(request.nextUrl.pathname.startsWith('/product')) {
		if(!jwt) {
			return NextResponse.redirect(new URL("/", request.url))
		}
	}

	return NextResponse.next()

}