"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Dorm = {
  id: string;
  name: string;
  area: string;
  price: string;
  rating: number;
  distance: string;
  gender: string;
  beds: string;
  description: string;
  amenities: string[];
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  image: string;
  gallery: string[];
  mapQuery: string;
  latitude?: number;
  longitude?: number;
};

type DormDraft = {
  name: string;
  area: string;
  price: string;
  rating: number;
  distance: string;
  gender: string;
  beds: string;
  description: string;
  amenities: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  image: string;
  gallery: string;
  mapQuery: string;
  latitude?: number;
  longitude?: number;
};

const ADMIN_SESSION_KEY = "rentadorm-admin-session";
const dormStorageKey = "rentadorm-iloilo-dorms";
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const iloiloCenter = { lat: 10.7202, lng: 122.5621 };

const defaultDorms: Dorm[] = [
  {
    id: "greenfield",
    name: "Greenfield Student Homes",
    area: "Jaro",
    price: "₱3,800/mo",
    rating: 4.9,
    distance: "5 min to UP Visayas",
    gender: "Co-ed",
    beds: "Single room",
    description:
      "A bright and practical student dorm with clean shared spaces, reliable Wi-Fi, and a quiet environment ideal for studying.",
    amenities: ["Wi-Fi", "Laundry", "Study desk", "Security"],
    ownerName: "Maria Santos",
    ownerPhone: "+63 917 123 4567",
    ownerEmail: "maria@greenfielddorm.com",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    mapQuery: "Greenfield Student Homes, Jaro, Iloilo City",
  },
  {
    id: "avenue",
    name: "Avenue Nest Dorm",
    area: "Molo",
    price: "₱4,200/mo",
    rating: 4.8,
    distance: "8 min to city center",
    gender: "Female-only",
    beds: "Shared room",
    description:
      "A modern dorm near the city center designed for comfort and convenience, with easy access to food hubs and transport.",
    amenities: ["Aircon", "Water heater", "CCTV", "Kitchen"],
    ownerName: "Rhea Dela Cruz",
    ownerPhone: "+63 998 765 4321",
    ownerEmail: "rhea@avenuenestdorm.com",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    ],
    mapQuery: "Avenue Nest Dorm, Molo, Iloilo City",
  },
  {
    id: "brio",
    name: "Brio Residences",
    area: "Mandurriao",
    price: "₱5,000/mo",
    rating: 4.9,
    distance: "6 min to SM City Iloilo",
    gender: "Co-ed",
    beds: "Private room",
    description:
      "A more premium option with tasteful interiors, good airflow, and a convenient spot close to malls and dining choices.",
    amenities: ["Gym", "Pool", "Reception", "Security"],
    ownerName: "Earl Ramos",
    ownerPhone: "+63 915 431 9090",
    ownerEmail: "earl@brioresidences.ph",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    ],
    mapQuery: "Brio Residences, Mandurriao, Iloilo City",
  },
];

const draftDefaults: DormDraft = {
  name: "",
  area: "Jaro",
  price: "",
  rating: 4.8,
  distance: "",
  gender: "Co-ed",
  beds: "Single room",
  description: "",
  amenities: "Wi-Fi, Security, Laundry",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  gallery: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80, https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  mapQuery: "",
  latitude: iloiloCenter.lat,
  longitude: iloiloCenter.lng,
};

const areaOptions = ["Jaro", "Molo", "City Proper", "Mandurriao", "La Paz"];

const areaDistanceMap: Record<string, string> = {
  Jaro: "5 min to UP Visayas",
  Molo: "8 min to city center",
  "City Proper": "4 min to market area",
  Mandurriao: "6 min to SM City Iloilo",
  "La Paz": "10 min to La Paz market",
};

const mapLocationOptions = [
  { name: "Greenfield Student Homes", area: "Jaro", distance: "5 min to UP Visayas", x: "18%", y: "58%", latitude: 10.7356, longitude: 122.5431 },
  { name: "Avenue Nest Dorm", area: "Molo", distance: "8 min to city center", x: "61%", y: "48%", latitude: 10.7046, longitude: 122.5608 },
  { name: "Casa de Flores", area: "City Proper", distance: "4 min to market area", x: "56%", y: "65%", latitude: 10.6967, longitude: 122.5682 },
  { name: "Brio Residences", area: "Mandurriao", distance: "6 min to SM City Iloilo", x: "73%", y: "37%", latitude: 10.7125, longitude: 122.5482 },
  { name: "The Blue House", area: "La Paz", distance: "10 min to La Paz market", x: "29%", y: "25%", latitude: 10.7558, longitude: 122.5733 },
  { name: "Euphoria Rooms", area: "Molo", distance: "7 min to Rizal Street", x: "52%", y: "44%", latitude: 10.7021, longitude: 122.5564 },
];

const inferDistrictFromLocation = (input: string, fallback: string) => {
  const query = input.toLowerCase();
  for (const area of areaOptions) {
    if (query.includes(area.toLowerCase())) {
      return area;
    }
  }
  return fallback;
};

const inferDormNameFromLocation = (input: string, fallback: string) => {
  const clean = input
    .trim()
    .replace(/^https?:\/\/[^\s]+\/maps\/search\/?\??/i, "")
    .replace(/^https?:\/\/[^\s]+\?q=/i, "")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .split(/[|,]/)[0]
    .trim();

  if (!clean) {
    return fallback;
  }

  return clean;
};

const applyLocationDetails = (value: string, currentDraft: DormDraft) => {
  const nextArea = inferDistrictFromLocation(value, currentDraft.area);
  return {
    ...currentDraft,
    area: nextArea,
    distance: areaDistanceMap[nextArea] ?? (currentDraft.distance || "Near city center"),
    mapQuery: value,
    name: currentDraft.name.trim() || inferDormNameFromLocation(value, currentDraft.name),
  };
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [dorms, setDorms] = useState<Dorm[]>(defaultDorms);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState<DormDraft>(draftDefaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const mapMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAuthenticated = window.localStorage.getItem(ADMIN_SESSION_KEY) === "active";
    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    const savedDorms = window.localStorage.getItem(dormStorageKey);
    if (savedDorms) {
      try {
        const parsed = JSON.parse(savedDorms) as Dorm[];
        if (parsed.length) {
          setDorms(parsed);
        }
      } catch {
        setDorms(defaultDorms);
      }
    }

    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    window.localStorage.setItem(dormStorageKey, JSON.stringify(dorms));
  }, [dorms, isReady]);

  useEffect(() => {
    if (!isCrudOpen || !mapContainerRef.current || !googleMapsApiKey || typeof window === "undefined") return;

    setOptions({ key: googleMapsApiKey, v: "weekly" });

    let isMounted = true;

    importLibrary("maps")
      .then(() => {
        if (!isMounted || !mapContainerRef.current || !window.google) return;

        const center = {
          lat: draft.latitude ?? iloiloCenter.lat,
          lng: draft.longitude ?? iloiloCenter.lng,
        };

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
        });

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          title: draft.name || "Dorm location",
        });

        mapInstanceRef.current = map;
        mapMarkerRef.current = marker;

        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;

          const latitude = event.latLng.lat();
          const longitude = event.latLng.lng();

          setDraft((current) => ({
            ...current,
            latitude,
            longitude,
          }));

          marker.setPosition({ lat: latitude, lng: longitude });
          map.panTo({ lat: latitude, lng: longitude });

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status !== "OK" || !results?.[0]) return;

            const place = results[0].formatted_address;
            setSelectedMapPin(place);
            setDraft((current) => ({
              ...current,
              mapQuery: place,
              name: current.name.trim() || inferDormNameFromLocation(place, current.name),
              area: inferDistrictFromLocation(place, current.area),
              distance: areaDistanceMap[inferDistrictFromLocation(place, current.area)] ?? (current.distance || "Near city center"),
              latitude,
              longitude,
            }));
          });
        });
      })
      .catch(() => {
        if (isMounted) {
          setSelectedMapPin("Map unavailable — add a valid Google Maps key");
        }
      });

    return () => {
      isMounted = false;
      if (mapMarkerRef.current) {
        mapMarkerRef.current.setMap(null);
        mapMarkerRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [isCrudOpen, draft.latitude, draft.longitude, draft.name, draft.area, draft.distance]);

  const filteredDorms = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return dorms.filter((dorm) => {
      if (!normalized) return true;
      return (
        dorm.name.toLowerCase().includes(normalized) ||
        dorm.area.toLowerCase().includes(normalized) ||
        dorm.description.toLowerCase().includes(normalized)
      );
    });
  }, [dorms, searchQuery]);

  const openCreateDorm = () => {
    setEditingId(null);
    setDraft({
      ...draftDefaults,
      latitude: iloiloCenter.lat,
      longitude: iloiloCenter.lng,
    });
    setIsCrudOpen(true);
  };

  const openEditDorm = (dorm: Dorm) => {
    setEditingId(dorm.id);
    setDraft({
      name: dorm.name,
      area: dorm.area,
      price: dorm.price,
      rating: dorm.rating,
      distance: dorm.distance,
      gender: dorm.gender,
      beds: dorm.beds,
      description: dorm.description,
      amenities: dorm.amenities.join(", "),
      ownerName: dorm.ownerName,
      ownerPhone: dorm.ownerPhone,
      ownerEmail: dorm.ownerEmail,
      image: dorm.image,
      gallery: dorm.gallery.join(", "),
      mapQuery: dorm.mapQuery,
      latitude: dorm.latitude ?? iloiloCenter.lat,
      longitude: dorm.longitude ?? iloiloCenter.lng,
    });
    setIsCrudOpen(true);
  };

  const handleSaveDorm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanAmenities = draft.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const cleanGallery = draft.gallery
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const nextDorm: Dorm = {
      id: editingId ?? Date.now().toString(),
      name: draft.name.trim(),
      area: draft.area,
      price: draft.price.trim(),
      rating: Number(draft.rating) || 4.8,
      distance: draft.distance.trim() || "Near city center",
      gender: draft.gender,
      beds: draft.beds,
      description: draft.description.trim(),
      amenities: cleanAmenities.length ? cleanAmenities : ["Wi-Fi", "Security"],
      ownerName: draft.ownerName.trim() || "Dorm owner",
      ownerPhone: draft.ownerPhone.trim() || "+63 912 345 6789",
      ownerEmail: draft.ownerEmail.trim() || "owner@rentadormiloilo.com",
      image: draft.image.trim() || defaultDorms[0].image,
      gallery: cleanGallery.length ? cleanGallery : [draft.image.trim() || defaultDorms[0].image],
      mapQuery: draft.mapQuery.trim() || `${draft.name.trim() || "Dorm"}, ${draft.area}, Iloilo City`,
      latitude: draft.latitude ?? iloiloCenter.lat,
      longitude: draft.longitude ?? iloiloCenter.lng,
    };

    setDorms((current) => {
      if (editingId) {
        return current.map((dorm) => (dorm.id === editingId ? nextDorm : dorm));
      }
      return [nextDorm, ...current];
    });

    setIsCrudOpen(false);
    setEditState(null);
  };

  const handleMapPinSelect = (location: (typeof mapLocationOptions)[number]) => {
    setSelectedMapPin(location.name);
    setDraft((current) => ({
      ...current,
      name: current.name.trim() || location.name,
      area: location.area,
      distance: location.distance,
      mapQuery: `${location.name}, ${location.area}, Iloilo City`,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  const handleMapDetails = () => {
    const trimmed = draft.mapQuery.trim();
    if (!trimmed) return;
    setDraft((current) => applyLocationDetails(trimmed, current));
  };

  const handleDeleteDorm = (dormId: string) => {
    setDorms((current) => current.filter((dorm) => dorm.id !== dormId));
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
    }
    router.push("/admin/login");
  };

  const setEditState = (value: string | null) => {
    setEditingId(value);
    setDraft({ ...draftDefaults });
  };

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-200">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-300">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-700">Admin dashboard</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">RentaDorm Iloilo</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCreateDorm}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Add listing
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Listings</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{dorms.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Average rating</p>
            <p className="mt-3 text-3xl font-black text-slate-900">
              {(dorms.reduce((sum, dorm) => sum + dorm.rating, 0) / Math.max(dorms.length, 1)).toFixed(1)}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Locations</p>
            <p className="mt-3 text-3xl font-black text-slate-900">{new Set(dorms.map((dorm) => dorm.area)).size}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Manage rooms</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Dorm listings</h2>
          </div>

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full max-w-md rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            placeholder="Search dorms or areas"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDorms.map((dorm) => (
            <article key={dorm.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <img src={dorm.image} alt={dorm.name} className="h-52 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{dorm.area}</p>
                    <h3 className="mt-2 text-xl font-black text-slate-900">{dorm.name}</h3>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">{dorm.rating} ★</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{dorm.description}</p>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>{dorm.gender}</span>
                  <span className="font-black text-slate-900">{dorm.price}</span>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditDorm(dorm)}
                    className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDorm(dorm.id)}
                    className="flex-1 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-slate-900">
                {editingId ? "Edit dorm listing" : "Add a new listing"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCrudOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveDorm} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Dorm name</label>
                <input
                  required
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Area</label>
                <select
                  value={draft.area}
                  onChange={(event) => setDraft((current) => ({ ...current, area: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                >
                  {areaOptions.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Monthly rent</label>
                <input
                  required
                  value={draft.price}
                  onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={draft.rating}
                  onChange={(event) => setDraft((current) => ({ ...current, rating: Number(event.target.value) }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Distance</label>
                <input
                  value={draft.distance}
                  onChange={(event) => setDraft((current) => ({ ...current, distance: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Room type</label>
                <select
                  value={draft.beds}
                  onChange={(event) => setDraft((current) => ({ ...current, beds: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                >
                  <option value="Single room">Single room</option>
                  <option value="Shared room">Shared room</option>
                  <option value="Private room">Private room</option>
                  <option value="Private studio">Private studio</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                <select
                  value={draft.gender}
                  onChange={(event) => setDraft((current) => ({ ...current, gender: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                >
                  <option value="Co-ed">Co-ed</option>
                  <option value="Female-only">Female-only</option>
                  <option value="Male-only">Male-only</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Short description</label>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Amenities</label>
                <input
                  value={draft.amenities}
                  onChange={(event) => setDraft((current) => ({ ...current, amenities: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Owner name</label>
                <input
                  value={draft.ownerName}
                  onChange={(event) => setDraft((current) => ({ ...current, ownerName: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Owner phone</label>
                <input
                  value={draft.ownerPhone}
                  onChange={(event) => setDraft((current) => ({ ...current, ownerPhone: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Owner email</label>
                <input
                  type="email"
                  value={draft.ownerEmail}
                  onChange={(event) => setDraft((current) => ({ ...current, ownerEmail: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Main image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = typeof reader.result === "string" ? reader.result : "";
                      if (result) {
                        setDraft((current) => ({ ...current, image: result }));
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Gallery photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (!files.length) return;

                    Promise.all(
                      files.map(
                        (file) =>
                          new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
                            reader.readAsDataURL(file);
                          }),
                      ),
                    ).then((results) => {
                      const nextGallery = results.filter(Boolean);
                      setDraft((current) => ({
                        ...current,
                        gallery: [...nextGallery, ...current.gallery.split(",").map((item) => item.trim()).filter(Boolean)].slice(0, 8).join(", "),
                      }));
                    });
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-slate-700">Map location</label>
                  <button
                    type="button"
                    onClick={handleMapDetails}
                    className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                  >
                    Use selected location
                  </button>
                </div>

                <div className="mb-3 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 p-3">
                  <div
                    ref={mapContainerRef}
                    className="h-52 w-full overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-200"
                  />
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {mapLocationOptions.map((location) => (
                    <button
                      key={location.name}
                      type="button"
                      onClick={() => handleMapPinSelect(location)}
                      className={`rounded-full border px-2 py-1 text-[10px] font-bold transition ${
                        selectedMapPin === location.name
                          ? "border-amber-400 bg-amber-500 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>

                <input
                  value={draft.mapQuery}
                  onChange={(event) => setDraft((current) => ({ ...current, mapQuery: event.target.value }))}
                  onBlur={() => {
                    if (draft.mapQuery.trim()) {
                      handleMapDetails();
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
                  placeholder="e.g. Greenfield Student Homes, Jaro, Iloilo City"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Main image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = typeof reader.result === "string" ? reader.result : "";
                      setDraft((current) => ({ ...current, image: result || current.image }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCrudOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-900"
                >
                  {editingId ? "Save changes" : "Create listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
