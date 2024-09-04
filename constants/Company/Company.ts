  export type Company = {
      uuid: string;
      name: string;
      address?: string;
      cityId?: number;
      postalCode?: string;
      phoneNumber?: string;
      email?: string;
      website?: string;
      taxId?: string;
      createdAt?: Date;
      updatedAt?: Date;
      deletedAt?: Date;
      subscriptionUuid?: string;
    }