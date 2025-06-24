// types/house.ts
export interface House {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToUSC: string;
  availableDate: string;
  landlordContact: {
    name: string;
    email: string;
    phone: string;
  };
  amenities: string[];
  images: string[];
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface FilterType {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  searchTerm: string;
}

export interface CreateHouseData {
  title: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToUSC: string;
  availableDate: string;
  landlordContact: {
    name: string;
    email: string;
    phone: string;
  };
  amenities: string[];
  images: string[];
  landlordId: string;
  isActive: boolean;
}

export interface UpdateHouseData extends Partial<Omit<House, 'id' | 'landlordId' | 'createdAt'>> {
  // For updating houses, we can update most fields except id, landlordId, and createdAt
}