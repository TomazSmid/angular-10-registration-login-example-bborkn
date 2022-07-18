import { OrderDetails } from '../OrderDetails';
import { OrderProduct } from '../OrderProduct';

export interface EmissionCmRequest {
  omsId: string; // Unique OMS identifier.	String	Да (Yes)
  products: OrderProduct[]; // List of products.	JSON Array of OrderProduct	Да (Yes)
  orderDetails: OrderDetails; // Additional order information.	Object of type OrderDetails	Нет (No)
}
