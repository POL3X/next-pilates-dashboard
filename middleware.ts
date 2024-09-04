'use server'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, res: NextResponse) {

  const response = NextResponse.redirect(new URL('/', request.url))
  
}

export const config = { matcher: ['/dashboard/:path*'] };
