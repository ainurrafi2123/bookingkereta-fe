// components/sections/testimonials/data.ts

export interface BaseReview {
  name: string;
  persona: string;
  avatar: string;
}

export interface Review extends BaseReview {
  rating?: number;
  text: string;
}

export interface ReviewWithImage extends Review {
  image: string;
  route: string;
  hasVideo: boolean;
}

export interface QuoteReview extends BaseReview {
  quote: string;
  icon: string;
}

// Dummy data – Tema Perjalanan Kereta
export const testimonials = {
  cards: [
    // ===== Column 1 =====
    {
      type: "review-with-image",
      data: {
        name: "Shin Eun Soo",
        route: "Surabaya → Jakarta",
        persona: "Traveler & Content Creator",
        avatar: "/src/review/avatar1.jpg",
        image: "/src/experience/experience1.jpg", // kereta berbelok, asap mengepul
        hasVideo: false,
        text: "Perjalanan kereta ini benar-benar berkesan. Saat kereta berbelok perlahan dengan asap mengepul di pagi hari, rasanya seperti masuk ke dalam film perjalanan yang tenang dan penuh cerita.",
      } as ReviewWithImage,
    },
    {
      type: "review",
      data: {
        name: "Minji",
        persona: "Backpacker",
        avatar: "/src/review/avatar2.jpg",
        rating: 5,
        text: "Aku suka bagaimana perjalanan kereta memberi waktu untuk menikmati proses, bukan hanya tujuan. Nyaman, tepat waktu, dan pemandangannya selalu bikin betah.",
      } as Review,
    },

    // ===== Column 2 =====
    {
      type: "quote",
      data: {
        name: "Hanni",
        persona: "Lifestyle Enthusiast",
        icon: "/src/icon/quote.svg",
        avatar: "/src/review/avatar3.jpg",
        quote:
          "Duduk di dalam kereta sambil melihat pemandangan berganti di balik jendela membuat perjalanan terasa lebih bermakna. Ini bukan sekadar transportasi, tapi pengalaman.",
      } as QuoteReview,
    },
    {
      type: "review-with-image",
      data: {
        name: "Minji",
        persona: "Nature Lover",
        route: "Jakarta → Yogyakarta",
        avatar: "/src/review/avatar2.jpg",
        image: "/src/experience/experience2.jpg", // cewek duduk menikmati pemandangan
        hasVideo: false,
        text: "Aku duduk diam sambil memotret pemandangan dari balik kaca. Pegunungan, sawah, dan langit senja membuat perjalanan terasa singkat.",
      } as ReviewWithImage,
    },

    // ===== Column 3 =====
    {
      type: "review",
      data: {
        name: "Shin Eun Soo",
        persona: "Daily Commuter",
        avatar: "/src/review/avatar1.jpg",
        rating: 5,
        text: "Kereta selalu jadi pilihan favoritku. Suasananya tenang, pelayanannya ramah, dan aku bisa menikmati perjalanan tanpa harus terburu-buru.",
      } as Review,
    },
    {
      type: "review-with-image",
      data: {
        name: "Hanni",
        persona: "Travel Blogger",
        route: "Bandung → Yogyakarta",
        avatar: "/src/review/avatar3.jpg",
        image: "/src/experience/experience3.jpg", // pelayan menunjuk pemandangan
        hasVideo: false,
        text: "Saat pelayan menunjuk pemandangan indah di luar jendela, aku tersenyum tanpa sadar. Momen kecil seperti ini yang membuat perjalanan kereta terasa spesial.",
      } as ReviewWithImage,
    },
  ] as const,
};
