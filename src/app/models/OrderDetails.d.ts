export interface OrderDetails {
  factoryId: string; // Factory Identifier (GLN).	String	Да (Yes)
  factoryName: string; // Factory Name.	String	Нет (No)
  factoryAddress: string; // Factory Address	String	Нет (No)
  factoryCountry: string; // Factory Country.	String	Да (Yes)
  productionLineId: string; // Line Identifier. Could be either a GAI or a string for line identification	String	Да (Yes)
  productCode: string; // Product Code.	String	Да (Yes)
  productDescription: string; // Product Description	String	Да (Yes)
  poNumber: string; // PO Number	String	Нет (No)
  expectedStartDate: string; // Expected Start Date	String	Нет (No)
}
