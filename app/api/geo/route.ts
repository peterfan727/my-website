import { geolocation } from '@vercel/functions';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const {city, country, flag, latitude, longitude } = geolocation(request);
  return NextResponse.json({
    latitude: latitude,
    longitude: longitude,
    countryCode: country,
    city: city,
    countryFlag: flag,
  });
}
