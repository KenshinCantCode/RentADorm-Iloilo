"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
};

type UserSession = {
  email: string;
  name: string;
};

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
    id: "casa",
    name: "Casa de Flores",
    area: "City Proper",
    price: "₱3,500/mo",
    rating: 4.7,
    distance: "4 min to market area",
    gender: "Co-ed",
    beds: "Private studio",
    description:
      "A welcoming dorm with a cozy layout, practical amenities, and a lively location that makes daily errands very easy.",
    amenities: ["Parking", "Laundry", "Wi-Fi", "24/7 guard"],
    ownerName: "Nina Fernandez",
    ownerPhone: "+63 925 345 7788",
    ownerEmail: "nina@casadeflores.ph",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    ],
    mapQuery: "Casa de Flores, City Proper, Iloilo City",
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
  {
    id: "bluehouse",
    name: "The Blue House",
    area: "La Paz",
    price: "₱3,900/mo",
    rating: 4.6,
    distance: "10 min to La Paz market",
    gender: "Female-only",
    beds: "Shared room",
    description:
      "A student-friendly residence with comfortable rooms, dependable utilities, and a calm environment for rest and study.",
    amenities: ["Study lounge", "Wi-Fi", "Water heater", "Housekeeping"],
    ownerName: "Liza Villanueva",
    ownerPhone: "+63 932 443 9981",
    ownerEmail: "liza@thebluehouse.ph",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    ],
    mapQuery: "The Blue House, La Paz, Iloilo City",
  },
  {
    id: "euphoria",
    name: "Euphoria Rooms",
    area: "Molo",
    price: "₱4,600/mo",
    rating: 4.8,
    distance: "7 min to Rizal Street",
    gender: "Co-ed",
    beds: "Single room",
    description:
      "A stylish dorm with modern finishes, shared social spaces, and convenient access to Iloilo's lively streets.",
    amenities: ["Balcony", "Wi-Fi", "Security", "Parking"],
    ownerName: "Cris Romero",
    ownerPhone: "+63 909 122 3344",
    ownerEmail: "cris@euphoriarooms.com",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    ],
    mapQuery: "Euphoria Rooms, Molo, Iloilo City",
  },
];

const dormDraftDefaults: DormDraft = {
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
  image:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  gallery:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80, https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  mapQuery: "",
};

const storage = {
  dorms: "rentadorm-iloilo-dorms",
  session: "rentadorm-iloilo-session",
  favorites: "rentadorm-iloilo-favorites",
};

const areaOptions = [
  "All",
  "Jaro",
  "Molo",
  "City Proper",
  "Mandurriao",
  "La Paz",
];

export default function Home() {
  const [dorms, setDorms] = useState<Dorm[]>(defaultDorms);
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedDormId, setSelectedDormId] = useState(defaultDorms[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DormDraft>(dormDraftDefaults);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedDorms = window.localStorage.getItem(storage.dorms);
    const savedSession = window.localStorage.getItem(storage.session);
    const savedFavorites = window.localStorage.getItem(storage.favorites);

    if (savedDorms) {
      try {
        const parsed = JSON.parse(savedDorms) as Dorm[];
        if (parsed.length) {
          setDorms(parsed);
          setSelectedDormId(parsed[0].id);
        }
      } catch {
        setDorms(defaultDorms);
      }
    }

    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as UserSession;
        setSession(parsed);
        setIsLoggedIn(true);
      } catch {
        setSession(null);
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites) as string[]);
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storage.dorms, JSON.stringify(dorms));
    }
  }, [dorms]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storage.favorites, JSON.stringify(favorites));
    }
  }, [favorites]);

  const areas = useMemo(() => ["All", ...new Set(dorms.map((dorm) => dorm.area))], [dorms]);

  const filteredDorms = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return dorms.filter((dorm) => {
      const matchesArea = selectedArea === "All" || dorm.area === selectedArea;
      const matchesSearch =
        normalized.length === 0 ||
        dorm.name.toLowerCase().includes(normalized) ||
        dorm.area.toLowerCase().includes(normalized) ||
        dorm.description.toLowerCase().includes(normalized);

      return matchesArea && matchesSearch;
    });
  }, [dorms, searchQuery, selectedArea]);

  useEffect(() => {
    if (!filteredDorms.some((dorm) => dorm.id === selectedDormId) && filteredDorms[0]) {
      setSelectedDormId(filteredDorms[0].id);
    }
  }, [filteredDorms, selectedDormId]);

  const selectedDorm =
    filteredDorms.find((dorm) => dorm.id === selectedDormId) ?? filteredDorms[0] ?? dorms[0];

  const totalRooms = dorms.length;
  const averageRate =
    dorms.length > 0 ? (dorms.reduce((sum, dorm) => sum + dorm.rating, 0) / dorms.length).toFixed(1) : "0.0";
  const favoriteCount = favorites.length;

  const openCreateDorm = () => {
    setEditingId(null);
    setDraft({ ...dormDraftDefaults });
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
    });
    setIsCrudOpen(true);
  };

  const handleAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    const email = authForm.email.trim();
    const password = authForm.password.trim();

    if (!email || !password) {
      setAuthError("Please complete the email and password fields.");
      return;
    }

    if (authMode === "register") {
      const name = authForm.name.trim() || "Dorm Owner";
      const userPayload = { email, name };

      if (typeof window !== "undefined") {
        window.localStorage.setItem(storage.session, JSON.stringify(userPayload));
      }

      setSession(userPayload);
      setIsLoggedIn(true);
      setAuthForm({ name: "", email: "", password: "" });
      return;
    }

    const stored = window.localStorage.getItem(storage.session);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserSession;
        if (parsed.email === email) {
          setSession(parsed);
          setIsLoggedIn(true);
          setAuthForm({ name: "", email: "", password: "" });
          return;
        }
      } catch {
        // ignore bad session
      }
    }

    setAuthError("No saved account was found for that email. Please register first.");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSession(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storage.session);
    }
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
    };

    if (editingId) {
      setDorms((current) => current.map((dorm) => (dorm.id === editingId ? nextDorm : dorm)));
    } else {
      setDorms((current) => [nextDorm, ...current]);
      setSelectedDormId(nextDorm.id);
    }

    setIsCrudOpen(false);
    setDraft({ ...dormDraftDefaults });
    setEditingId(null);
  };

  const handleDeleteDorm = (dormId: string) => {
    const nextDorms = dorms.filter((dorm) => dorm.id !== dormId);
    setDorms(nextDorms);

    if (selectedDormId === dormId) {
      setSelectedDormId(nextDorms[0]?.id ?? defaultDorms[0].id);
    }

    setFavorites((current) => current.filter((item) => item !== dormId));
  };

  const toggleFavorite = (dormId: string) => {
    setFavorites((current) =>
      current.includes(dormId) ? current.filter((item) => item !== dormId) : [...current, dormId],
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed,_#fff_35%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.ico"
              alt="RentaDorm Iloilo logo"
              className="h-11 w-11 rounded-2xl object-cover shadow-lg shadow-amber-200"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-700">
                Rent a room
              </p>
              <h1 className="text-xl font-black tracking-tight text-slate-900">RentaDorm Iloilo</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#listings" className="transition hover:text-slate-950">Dorms</a>
            <a href="#map" className="transition hover:text-slate-950">Map</a>
            <a href="#gallery" className="transition hover:text-slate-950">Gallery</a>
          </nav>

          {showAdminLogin && (
            <Link
              href="/admin/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800"
            >
              Admin login
            </Link>
          )}
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pb-16">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
            Iloilo City stays
          </span>

          <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Discover the best dorms for your budget, routine, and lifestyle.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Compare dorms by price, neighborhood, room type, and owner contact details. Browse nearby student-friendly spaces in Iloilo City and find the right place faster.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#listings"
              className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-200 transition hover:bg-amber-400"
            >
              Explore listings
            </a>
            <a
              href="#map"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              View map
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-black text-slate-900">{totalRooms}</p>
              <p className="mt-1 text-sm text-slate-600">Listings</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-black text-slate-900">{averageRate}</p>
              <p className="mt-1 text-sm text-slate-600">Average rating</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-black text-slate-900">{favoriteCount}</p>
              <p className="mt-1 text-sm text-slate-600">Saved rooms</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_70px_rgba(15,23,42,0.12)]">
          <img src={selectedDorm.image} alt={selectedDorm.name} className="h-[420px] w-full object-cover" />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Featured stay</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{selectedDorm.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(selectedDorm.id)}
                className={`rounded-full px-2.5 py-1 text-sm font-bold ${
                  favorites.includes(selectedDorm.id)
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {favorites.includes(selectedDorm.id) ? "♥ Saved" : "♡ Save"}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              <span>{selectedDorm.area}</span>
              <span className="font-black text-slate-900">{selectedDorm.price}</span>
            </div>
          </div>
        </div>
      </section>

      {isCrudOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black text-slate-900">
                {editingId ? "Edit dorm listing" : "Add a new dorm listing"}
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Area</label>
                <select
                  value={draft.area}
                  onChange={(event) => setDraft((current) => ({ ...current, area: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {areaOptions.filter((area) => area !== "All").map((area) => (
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  placeholder="₱4,200/mo"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Distance</label>
                <input
                  value={draft.distance}
                  onChange={(event) => setDraft((current) => ({ ...current, distance: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  placeholder="5 min to downtown"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Room type</label>
                <select
                  value={draft.beds}
                  onChange={(event) => setDraft((current) => ({ ...current, beds: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <option value="Co-ed">Co-ed</option>
                  <option value="Female-only">Female-only</option>
                  <option value="Male-only">Male-only</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Short description</label>
                <textarea
                  required
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Amenities (comma-separated)</label>
                <input
                  value={draft.amenities}
                  onChange={(event) => setDraft((current) => ({ ...current, amenities: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Owner name</label>
                <input
                  value={draft.ownerName}
                  onChange={(event) => setDraft((current) => ({ ...current, ownerName: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Owner phone</label>
                <input
                  value={draft.ownerPhone}
                  onChange={(event) => setDraft((current) => ({ ...current, ownerPhone: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Owner email</label>
                <input
                  type="email"
                  value={draft.ownerEmail}
                  onChange={(event) => setDraft((current) => ({ ...current, ownerEmail: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Main image URL</label>
                <input
                  value={draft.image}
                  onChange={(event) => setDraft((current) => ({ ...current, image: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Gallery image URLs (comma-separated)</label>
                <input
                  value={draft.gallery}
                  onChange={(event) => setDraft((current) => ({ ...current, gallery: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Map query</label>
                <input
                  value={draft.mapQuery}
                  onChange={(event) => setDraft((current) => ({ ...current, mapQuery: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  placeholder="Dorm Name, Jaro, Iloilo City"
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

      <section id="listings" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Explore options</p>
            <h3 className="mt-2 text-3xl font-black text-slate-900">Featured dorms in Iloilo City</h3>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              placeholder="Search dorms or areas"
            />
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                selectedArea === area
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDorms.map((dorm) => (
              <button
                key={dorm.id}
                type="button"
                onClick={() => setSelectedDormId(dorm.id)}
                className={`overflow-hidden rounded-[1.75rem] border bg-white text-left shadow-sm transition ${
                  selectedDorm?.id === dorm.id
                    ? "border-slate-900 ring-2 ring-slate-900/10"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="relative">
                  <img src={dorm.image} alt={dorm.name} className="h-52 w-full object-cover" />
                  {isLoggedIn && (
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditDorm(dorm);
                        }}
                        className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteDorm(dorm.id);
                        }}
                        className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{dorm.area}</p>
                      <h4 className="mt-2 text-xl font-black text-slate-900">{dorm.name}</h4>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                      {dorm.rating} ★
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                    <span>{dorm.gender}</span>
                    <span className="font-black text-slate-900">{dorm.price}</span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">{dorm.distance}</p>
                </div>
              </button>
            ))}
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5">
            <div className="rounded-[1.5rem] bg-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Selected room</p>
                  <h4 className="mt-2 text-2xl font-black text-slate-900">{selectedDorm.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedDorm.id)}
                  className={`rounded-full px-2.5 py-1 text-sm font-bold ${
                    favorites.includes(selectedDorm.id) ? "bg-red-100 text-red-600" : "bg-white text-slate-700"
                  }`}
                >
                  {favorites.includes(selectedDorm.id) ? "♥ Saved" : "♡ Save"}
                </button>
              </div>

              <img src={selectedDorm.image} alt={selectedDorm.name} className="mt-4 h-56 w-full rounded-2xl object-cover" />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Location</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedDorm.area}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Rent</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedDorm.price}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{selectedDorm.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedDorm.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Owner contact</p>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Name</span>
                    <span className="mt-1 block font-semibold text-slate-900">{selectedDorm.ownerName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Phone</span>
                    <a href={`tel:${selectedDorm.ownerPhone}`} className="mt-1 block font-semibold text-slate-900 hover:text-amber-700">
                      {selectedDorm.ownerPhone}
                    </a>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Email</span>
                    <a href={`mailto:${selectedDorm.ownerEmail}`} className="mt-1 block font-semibold text-slate-900 hover:text-amber-700">
                      {selectedDorm.ownerEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div id="map" className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Map</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedDorm.area}</p>
                </div>
                <span className="text-xs font-medium text-slate-500">{selectedDorm.distance}</span>
              </div>
              <iframe
                key={selectedDorm.mapQuery}
                src={`https://www.google.com/maps?q=${encodeURIComponent(selectedDorm.mapQuery)}&output=embed`}
                title={`${selectedDorm.name} location`}
                className="h-72 w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </aside>
        </div>
      </section>

      <section id="gallery" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Gallery</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">A closer look at {selectedDorm.name}</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {selectedDorm.gallery.map((photo, index) => (
            <img
              key={`${selectedDorm.id}-${index}`}
              src={photo}
              alt={`${selectedDorm.name} room ${index + 1}`}
              className="h-64 w-full rounded-[1.5rem] object-cover shadow-sm"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-[0_25px_50px_rgba(15,23,42,0.18)] sm:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300">Why locals choose us</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-2xl font-black text-white">Convenient</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Discover dorms near schools, transport, markets, and shopping areas across Iloilo City.
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Budget-smart</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Compare room types and utilities to choose a place that fits your monthly budget.
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Owner-ready</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Owner accounts can directly manage listings, update prices, and keep room information fresh.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
