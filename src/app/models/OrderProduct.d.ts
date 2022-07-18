export interface OrderProduct {
  gtin: string; // Product GTIN	String (14)	Да (Yes)
  quantity: number; // Quantity of ICs / Identifiers	"Integer ($int64)"	Да (Yes)
  serialNumberType: string; // Method of generation of individual serial number	"String (Voc. №3) (See section.3.2.3)"	Да (Yes)
  serialNumbers: string[]; // "«serialNumberType = SELF_MADE». Unique serial numbers. This field is to be filled if only serialNumberType = SELF_MADE"	"JSON Array of String"	Да (Yes)
  templateId: string; // IC template ID	"String (Voc. №7) (See section. 3.2.7)"	Да (Yes)
}
