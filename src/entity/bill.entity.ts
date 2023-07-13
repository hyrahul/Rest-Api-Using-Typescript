import { IntegrationType } from "../schema/types";
import { ArtifactStatus } from "../schema/types";

export class Bill {
  public rootfiId: number;
  public rootfiCreatedAt: Date;
  public rootfiUpdatedAt: Date;
  public rootfiIntegrationType: IntegrationType;
  public rawData: any; // Assuming JSON data is stored in a generic 'any' type
  public platformId: string;
  public documentNumber?: string;
  public postedDate?: Date;
  public dueDate?: Date;
  public currency?: string;
  public totalAmount?: number;
  public taxAmount?: number;
  public amountDue?: number;
  public updatedAt?: Date;
  public status: ArtifactStatus;
  public currencyRate?: number;
  public dataHash?: string;
  public purchaseOrderIds: any[]; // Assuming an array of any type for purchase order IDs
  public subTotal?: number;
  public totalDiscount?: number;
  public contactId?: string;
  public memo?: string;
  public lineItems: any[]; // Assuming an array of any type for line items
  public payments: any[]; // Assuming an array of any type for payments
  public documents: any[]; // Assuming an array of any type for documents
}
