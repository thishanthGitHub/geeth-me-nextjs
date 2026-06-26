import { createServerFn } from "@tanstack/react-start";

const PLACE_ID = "ChIJAVL8ur68-zoR1vDmfjNscU0";
const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export type PlaceReview = {
  name: string;
  rating: number;
  text: string;
  relativeTime: string;
  authorName: string;
  authorPhoto?: string;
  authorUri?: string;
};

export type PlaceInfo = {
  name: string;
  address: string;
  rating: number;
  userRatingCount: number;
  mapsUrl: string;
  phone?: string;
  openNow?: boolean;
  hours: string[];
  reviews: PlaceReview[];
};

export const getRestaurantPlace = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlaceInfo> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    const connKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
    if (!connKey) throw new Error("GOOGLE_MAPS_API_KEY missing");

    const fields = [
      "id",
      "displayName",
      "formattedAddress",
      "rating",
      "userRatingCount",
      "googleMapsUri",
      "internationalPhoneNumber",
      "regularOpeningHours",
      "reviews",
    ].join(",");

    const res = await fetch(`${GATEWAY}/places/v1/places/${PLACE_ID}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Connection-Api-Key": connKey,
        "X-Goog-FieldMask": fields,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Places API failed [${res.status}]: ${body}`);
    }
    const d = await res.json();

    type RawReview = {
      name?: string;
      rating?: number;
      text?: { text?: string };
      originalText?: { text?: string };
      relativePublishTimeDescription?: string;
      authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
    };

    return {
      name: d.displayName?.text ?? "Geeth Me",
      address: d.formattedAddress ?? "",
      rating: d.rating ?? 0,
      userRatingCount: d.userRatingCount ?? 0,
      mapsUrl: d.googleMapsUri ?? "",
      phone: d.internationalPhoneNumber,
      openNow: d.regularOpeningHours?.openNow,
      hours: d.regularOpeningHours?.weekdayDescriptions ?? [],
      reviews: (d.reviews ?? []).slice(0, 6).map((r: RawReview) => ({
        name: r.name ?? "",
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        authorName: r.authorAttribution?.displayName ?? "Guest",
        authorPhoto: r.authorAttribution?.photoUri,
        authorUri: r.authorAttribution?.uri,
      })),
    };
  }
);
