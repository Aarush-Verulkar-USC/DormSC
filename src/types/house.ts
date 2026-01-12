// types/house.ts
export interface LandlordContact {
  name: string;
  email: string;
  phone: string;
}

export interface FilterType {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

export interface House {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToUSC?: string;
  availableDate?: string;
  landlordContact: LandlordContact;
  amenities: string[];
  images: string[];
  landlordId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CreateHouseData {
  title: string;
  description: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToUSC?: string;
  availableDate?: string;
  landlordContact: LandlordContact;
  amenities: string[];
  images: string[];
  landlordId: string;
  isActive: boolean;
}

export interface UpdateHouseData extends Partial<Omit<CreateHouseData, 'landlordId'>> {
  isActive?: boolean;
}